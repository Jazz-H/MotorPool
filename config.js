/* MotorPool — Supabase config.
 *
 * Paste your project's URL and public "anon" key below to turn on the Account
 * section (sign-in) and cloud sync. BOTH values are safe to commit — they're
 * protected by Supabase row-level security (the anon key is meant to be
 * public). Find them in the Supabase dashboard → Project Settings → API.
 *
 * Leave the placeholders empty to keep MotorPool 100% local: with no keys the
 * Account section stays hidden and nothing leaves the device. That is the
 * current state.
 *
 * NOTE — before putting keys back: cloud sync is implemented (see Phase 3 in
 * index.html) and uploads each profile's BUILD DATA to the `profiles` table,
 * not just an email address. Enable row-level security on `profiles` in the
 * new project first, restricting each row to its owning user.
 *
 * The previous project (ref jwkvfibsetjwsfnvmqvy) was deleted — its subdomain
 * no longer resolves — so its keys were cleared on 2026-11-06.
 */
window.MP_SUPABASE = {
  url: '',
  anonKey: '',  // publishable key — safe to commit, protected by RLS
  // Sign-in methods to offer — remove any you haven't enabled in Supabase Auth.
  providers: ['magiclink']
};
