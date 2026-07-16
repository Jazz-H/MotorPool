# Motorpool — Accounts & Settings Scope

**Direction:** local-first **profiles** (no login required) **+ optional Supabase sign-in for cloud sync**.
The app keeps working fully offline as a template; signing in is purely additive (syncs a profile across devices).

Status: **Phase 1 shipped** (local profiles). **Phase 2 scaffolded** (auth UI + Supabase client, gated on `config.js` — see §10). Phase 3 (sync) is next; needs the project + the SQL below.

---

## 1. Principles
- **Local-first.** The app always reads/writes local storage first; it never *requires* an account to work.
- **Additive auth.** Sign-in only enables sync. Sign-out keeps all local data intact.
- **Privacy by default.** Nothing leaves the device until a user explicitly signs in.
- **Non-destructive migration.** Existing `mp.*` data becomes the first profile automatically.

---

## 2. Data model

### Local (localStorage)
- `mp.profiles` → `[{ id, name, avatar?, createdAt, cloud?: { userId, lastSynced } }]`
- `mp.activeProfile` → `"<id>"`
- **Per-profile namespacing:** every existing key `mp.<x>` becomes `mp.p.<profileId>.<x>`.
  (e.g. `mp.mbud.cap` → `mp.p.p1.mbud.cap`). A tiny storage shim maps get/set through the active profile so the rest of the app is untouched.
- Global (not per-profile): `mp.profiles`, `mp.activeProfile`, `mp.prefs.*`, `mp.session`.

### Cloud (Supabase / Postgres) — Phases 2–3
- `auth.users` — managed by Supabase Auth.
- `profiles` table: `id (uuid)`, `user_id (uuid, fk)`, `name`, `data (jsonb)`, `updated_at`.
  - `data` is the same JSON blob the current **Export** produces (the `mp.*` map for that profile) — so sync reuses the export/import format we already have.
- **Row-Level Security:** `user_id = auth.uid()` on all reads/writes. The client only ever holds the public **anon key** (safe under RLS).

---

## 3. Auth flow (Supabase, Phase 2)
- **Sign in:** email magic-link **or** password, plus OAuth (**Google** and/or **GitHub**). _(final list = open decision)_
- **Sign out:** clear Supabase session + `mp.session`; local profiles/data remain.
- **Session:** Supabase JS SDK persists the session; app checks it on load and shows Account state.
- Client config: `SUPABASE_URL` + `SUPABASE_ANON_KEY` inlined in the page (public, RLS-protected).

---

## 4. Sync strategy (Phase 3)
- **Local-first write-through:** UI writes local immediately; when signed in, a debounced push serializes the active profile's `mp.*` blob → `profiles.data`.
- **Pull:** on sign-in and on load, fetch the user's profiles; offer to import any not present locally.
- **Conflict:** start with **last-write-wins** using `updated_at`; if both local and cloud changed since `lastSynced`, show a "Keep local / Keep cloud" prompt. (No field-level merge in v1.)
- **Offline:** fully functional; queue a sync for when back online + signed in.
- **Controls:** show *Last synced*, a manual **Sync now**, and an **auto-sync** toggle.

---

## 5. Settings page redesign (applies across phases)
Restructure the single "Your Data" screen into labeled sections:
- **Account** — signed-out: "Sign in to sync"; signed-in: email/name + **Sign out**.
- **Profiles** — list with active indicator; **switch / add / rename / delete**; avatar (initial or emoji).
- **Sync** — status, last-synced, **Sync now**, auto-sync toggle _(visible when signed in)_.
- **Preferences** — theme, default landing tab, units ($/mi). _(nice-to-have)_
- **Data** — existing **Export / Import / Reset**, now scoped to the active profile.
- **Danger zone** — delete profile; delete account + all cloud data.

---

## 6. Migration (first load after update)
1. If `mp.profiles` is absent, create profile `p1` "My Build".
2. Move every existing `mp.<x>` (except globals) → `mp.p.p1.<x>`.
3. Set `mp.activeProfile = p1`. Set a `mp.migrated.profiles` flag so it runs once.
Non-destructive, reversible via the pre-existing backup export.

---

## 7. Phased build plan
- **Phase 1 — Local profiles (Path A). Fully static, testable here.**
  Storage shim + namespacing + migration; Settings **Profiles** section (switch/add/rename/delete); per-profile export/reset. Ships standalone value with zero backend.
- **Phase 2 — Supabase auth (part of Path C). Needs Supabase project + your live verification.**
  Add SDK + config; **Account** section; sign in / sign out (email + one OAuth); session on load. Auth only, no sync yet.
- **Phase 3 — Cloud sync (completes Path C).**
  `profiles` table + RLS; push/pull; last-synced; Sync now + auto-sync; conflict prompt.
- **Phase 4 — Polish.**
  More OAuth providers, avatars, preferences, delete-account, empty/onboarding states.

---

## 8. Constraints & what I need from you
- **Supabase project (free tier)** — you create it (or authorize me to scaffold and you paste keys). I need the **project URL** + **anon key** (both safe to commit under RLS).
- **Login methods** — email magic-link vs. password, and which OAuth (Google / GitHub / none) for v1.
- **Sync scope** — sync **all** local profiles to your account, or **one profile per account**?
- **Live testing** — this sandbox is network-restricted, so I can't complete real OAuth/DB round-trips here. I build + you verify the live auth/sync; Phase 1 is fully verifiable in-repo.

---

## 9. Open decisions (to finalize before Phase 2)
1. OAuth providers for v1.
2. Sync scope (all profiles vs one).
3. Conflict UX (auto last-write-wins vs. always prompt).
4. Where the Supabase keys live (inline in `index.html` vs. a small `config.js`).

---

## 10. Setup — turning on auth (Phase 2, shipped)

Auth is **scaffolded and gated**. With empty keys the Account section stays hidden and the app is 100% local (the Supabase SDK is never even fetched). To enable it:

### a. Create the Supabase project
1. supabase.com → **New project**. Pick an org (or **New organization** — name it yourself), a project name, a strong DB password, and a region. Free tier is fine.
2. **If you hit "Unable to retrieve GitHub repos for this account":** that's Supabase's *optional* GitHub integration failing — MotorPool needs **none** of it. Fixes, easiest first:
   - Just create the project under a plain organization (skip any "connect a repo / deploy from GitHub" step).
   - If it blocks you: GitHub → **Settings → Applications → Installed GitHub Apps → Supabase → Configure** → grant repository access (All, or the org you want) → **Save**, then retry.
   - Or sidestep entirely: sign out of Supabase, sign back in **with email** instead of GitHub, then create the project.

### b. Get the keys
Project → **Settings → API** → copy **Project URL** and the **anon public** key. Both are safe to commit (RLS-protected).

### c. Paste into `config.js`
```js
window.MP_SUPABASE = {
  url: 'https://YOURREF.supabase.co',
  anonKey: 'eyJ…the anon public key…',
  providers: ['magiclink', 'google', 'github']  // keep only what you enable below
};
```

### d. Enable the sign-in methods (Supabase → Authentication → Providers)
- **Email** (magic link) works out of the box.
- **Google / GitHub**: create an OAuth app on that provider, paste its client id/secret into Supabase, and add your site URL + `…/auth/v1/callback` to the redirect allow-list. Add the deployed MotorPool URL under **Auth → URL Configuration → Redirect URLs**. Remove any provider you don't set up from the `providers` array.

Once keys are in, the **Account** section appears in Settings (sign in / sign out; session persists across reloads).

---

## 11. Phase 3 — cloud sync (next; SQL ready)

Table + row-level security (run in Supabase → **SQL editor**):
```sql
create table if not exists public.profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  data jsonb not null default '{}',
  updated_at timestamptz not null default now()
);
alter table public.profiles enable row level security;
create policy "own rows" on public.profiles
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
```
Client work (not yet built): on sign-in, pull the user's rows and offer to import any not present locally; debounced write-through of the active profile's `mp.*` blob → `profiles.data` (reuse the Export format); last-write-wins on `updated_at`, prompt only on a true local-vs-cloud clash. Decisions from §9 chosen: **all profiles sync**, **last-write-wins + prompt on conflict**.
