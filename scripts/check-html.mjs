#!/usr/bin/env node
// Structural check for index.html — no dependencies, no install:
//
//   node scripts/check-html.mjs
//
// Why this exists: on 2026-11-06 a <div class="cross"> was opened and never
// closed. Browsers silently recover (the parser implicitly closes it at the
// parent's end tag), so nothing looked broken — but the element that followed
// became a grid item inside the list instead of a sibling after it, and no
// tooling could read the file at all. Prettier refused to parse it.
//
// This repo has no build step and no package.json on purpose, so this runs on
// plain node rather than pulling in an HTML linter.

import { readFile } from "node:fs/promises";

const VOID = new Set([
  "area", "base", "br", "col", "embed", "hr", "img", "input",
  "link", "meta", "source", "track", "wbr",
]);

const file = process.argv[2] ?? "index.html";
let html = await readFile(file, "utf8");

// Track how many newlines each removed region held, so reported line numbers
// still point at the real place in the file.
const blank = (m) => "\n".repeat((m.match(/\n/g) ?? []).length);
html = html
  .replace(/<style[\s\S]*?<\/style>/g, blank)
  .replace(/<script[\s\S]*?<\/script>/g, blank)
  .replace(/<!--[\s\S]*?-->/g, blank);

const lineOf = (i) => html.slice(0, i).split("\n").length;

const stack = [];
const problems = [];

for (const m of html.matchAll(/<(\/?)([a-zA-Z][a-zA-Z0-9]*)\b[^>]*?(\/?)>/g)) {
  const [, closing, rawTag, selfClosing] = m;
  const tag = rawTag.toLowerCase();
  if (VOID.has(tag) || selfClosing) continue;

  if (!closing) {
    stack.push({ tag, line: lineOf(m.index) });
    continue;
  }

  if (stack.length && stack[stack.length - 1].tag === tag) {
    stack.pop();
    continue;
  }

  // A mismatch. If this tag is open further down the stack, everything above
  // it was left unclosed and the browser is closing it implicitly.
  const depth = stack.findLastIndex((e) => e.tag === tag);
  if (depth === -1) {
    problems.push(`${file}:${lineOf(m.index)}  stray </${tag}> with nothing open`);
  } else {
    for (const e of stack.slice(depth + 1)) {
      problems.push(
        `${file}:${e.line}  <${e.tag}> is never closed ` +
          `(implicitly closed by </${tag}> at line ${lineOf(m.index)})`,
      );
    }
    stack.length = depth;
  }
}

for (const e of stack) {
  problems.push(`${file}:${e.line}  <${e.tag}> is never closed`);
}

if (problems.length) {
  console.error(`✗ ${problems.length} structural problem(s) in ${file}:\n`);
  for (const p of problems) console.error("  " + p);
  process.exit(1);
}

console.log(`✓ ${file}: tags balanced`);
