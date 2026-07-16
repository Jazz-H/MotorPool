# Motorpool — Backlog

Working list, roughly in priority order. Knock 'em down top to bottom.

## ⭐ Queued features
- [x] _(All five queued features shipped — see Done below.)_

## Reframe as a shareable, portfolio-worthy tool
- [ ] **Accounts Phase 2–3** — real login + cloud sync via Supabase. Scoped in `docs/accounts-scope.md`; needs a Supabase project + the 4 open decisions. (Phase 1 — local profiles — is shipped.)
- [ ] **Portfolio story** — write the positioning + case study: what it is, the problem it solves, the build story, and how to feature it on the portfolio site, **LinkedIn**, and **jazzharrisstudio.com**.

## Content (needs Jazz's real inputs)
- [ ] **Real Car build candidates** — replace the placeholder Wrangler/4Runner/Tacoma cards with the actual cars being considered (specs, prices, links).
- [ ] **Mustang photos** — add real photos of the 2026 Mustang EcoBoost (photo upload works now).

## Housekeeping
- [ ] **Delete old merged branches** — GitHub-UI action (proxy blocks branch deletion from the agent).

## Done
### Shareable template + accounts
- [x] Local **profiles** (multiple builds on a device: switch / add / rename / delete; snapshot isolation) — accounts Phase 1
- [x] **"Make It Yours"** template framing + two-tap **Reset to the sample**; first-run template banner
- [x] Accounts scope doc (`docs/accounts-scope.md`)

### Collapsibility, editability, nav & QA
- [x] Every Moto/Garage/Car section collapsible, **summary-first**, remembered (`mp.sec.*`) with live-value mirrors
- [x] Editable **cash cap** + **funding note**, **Car money** figures; **gear** and **candidate** add/remove/edit; **add-a-mod**
- [x] Section-nav **"jump to" dropdown**; **hero chips wrap**; **wordmark centered**; **id/label routing** (Hub/Garage)
- [x] **Service-worker font caching**; **Market Values tables scroll** (were clipped); **tap-to-expand nudge**
- [x] Backup **export / import**; QA smoke + UAT (0 console errors)

### Recent UI polish
- [x] **"Add candidate" at the top** of the Candidate Log (moto + car) — adding is now the first action, above every seed card
- [x] **Dismissible amber side-quotes** — every `.insight` yellow-bordered note in a section summary gets a subtle ×; dismissal is remembered globally (`mp.hint.insight.*`, seen-once like the NEW banner)
- [x] **Gear as its own Moto section** — pulled the gear/setup list out of "01 The Money" into a standalone collapsible **02 Gear & Setup** section with its own live summary; remaining sections renumbered
- [x] **Owned vehicles in the Garage** — new **Also Owned** section: add/edit/remove vehicles you already own, each with a photo, four spec cells, and its own per-vehicle mod list (installed vs. planned totals), persisted to `mp.garage.owned`
- [x] **AI listing rater** — bring-your-own Anthropic key (Settings → AI, stored on-device, excluded from backups); drop listing photos atop either Candidate Log and Claude vision returns a verdict + score + pros/cons/red-flags/questions/suggested-offer, savable straight to the log. Direct browser call — no backend
- [x] **Daily-photo render fix** (fallback overlay was covering saved photos) + cropper hardening (downscale + size fallback)
- [x] **Unified high-quality checkboxes** + **strikethrough on checked items**
- [x] **Bought gear sinks to the bottom** of the list
- [x] **Removable cards** in Contenders / Candidate Log / Cross-Shop (two-tap, per profile)
- [x] **Standardized add-forms** — gear & candidates now use the Add-a-mod button + form pattern

### Earlier
- [x] Repo + GitHub Pages · mobile-first refactor · Garage tab · mod money split · bottom-nav PWA · A2HS + service worker · Motorpool rebrand · `.nojekyll` fix · NEW banner
