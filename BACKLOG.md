# Motorpool — Backlog

Working list, roughly in priority order. Knock 'em down top to bottom.

## ⭐ Queued features
- [ ] **Dismissible insights / callouts** — the amber "side-quote" blocks (`.callout`, `.insight`, `.port-note` — the ones with the yellow left border) should be dismissible, and once a user has seen/dismissed one it should stay gone (persist per profile, like the NEW banner and tap-to-expand nudge already do). Add a subtle × and remember dismissal.
- [ ] **Rate a vehicle from photos** — no way today for a user to submit photos of a vehicle they're considering and have the app score/rate it. (Ties into the split-off `jazz-h/vehicle-match` tool — integrate its scoring, or add a photo-in → rating flow inside a candidate card.)
- [ ] **Add owned vehicles to the Garage** — the Garage tab only holds the one daily driver. Let users add multiple vehicles they already own (each with its own identity, photo, specs, and mod list), not just candidates they're shopping.
- [ ] **Gear as its own Moto section** — pull the gear/setup list out of "01 The Money" and give it a standalone collapsible section on the Moto tab (with its own summary), so money and gear aren't conflated.

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
- [x] **Daily-photo render fix** (fallback overlay was covering saved photos) + cropper hardening (downscale + size fallback)
- [x] **Unified high-quality checkboxes** + **strikethrough on checked items**
- [x] **Bought gear sinks to the bottom** of the list
- [x] **Removable cards** in Contenders / Candidate Log / Cross-Shop (two-tap, per profile)
- [x] **Standardized add-forms** — gear & candidates now use the Add-a-mod button + form pattern

### Earlier
- [x] Repo + GitHub Pages · mobile-first refactor · Garage tab · mod money split · bottom-nav PWA · A2HS + service worker · Motorpool rebrand · `.nojekyll` fix · NEW banner
