# Motorpool — Backlog

Working list, roughly in priority order. Knock 'em down top to bottom.

## Usability (make it a real tool)
- [ ] **Persist checklist state** — save/restore every checkbox (inspection lists on Moto & Car, the Hub decision queue, per-candidate verify lists) to `localStorage` so they don't reset on reload.
- [ ] **Persist editable candidate fields** — the blank-candidate `contenteditable` fields (year/make/model, price, miles…) currently lose their content on reload; persist to `localStorage`.
- [ ] **Add-a-mod** — log a new mod (name, price, note, bought/planned) from the Garage tab UI; recompute Spent / Still-to-buy / All-in; persist. _(needs persistence plumbing)_
- [ ] **Add-a-candidate** — a "+ Add candidate" control for the Moto/Car logs; persisted. _(builds on field persistence)_

## Content
- [ ] **Real Car build candidates** — replace the placeholder cards on the Car tab with actual cars being considered.
- [ ] **Mustang photos** — add real photos of the 2026 Mustang EcoBoost to the Garage tab.

## Polish / housekeeping
- [ ] **"What's new" banner** — one-time dismissible announcement (new Garage tab, mobile app, Motorpool rename).
- [ ] **Delete old merged branch** — housekeeping; proxy blocks branch deletion from the agent, so this is a GitHub-UI action.

## Done
- [x] Initialize repo + GitHub Pages
- [x] Mobile-first CSS refactor
- [x] Garage tab (2026 Mustang daily + mod list)
- [x] Collapsible reference sections with insights
- [x] Mod money split (Spent / Still-to-buy / All-in)
- [x] Mobile-app feel: bottom nav + installable PWA
- [x] Install (Add to Home Screen) prompt + service worker
- [x] Rebrand to Motorpool with hex "MP" logo
- [x] Fix Pages deploy hang (`.nojekyll`)
