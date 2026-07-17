/* MotorPool — Supabase config.
 *
 * Paste your project's URL and public "anon" key below to turn on the Account
 * section (sign-in) and, later, cloud sync. BOTH values are safe to commit —
 * they're protected by Supabase row-level security (the anon key is meant to be
 * public). Find them in the Supabase dashboard → Project Settings → API.
 *
 * Leave the placeholders empty to keep MotorPool 100% local: with no keys the
 * Account section stays hidden and nothing leaves the device.
 */
window.MP_SUPABASE = {
  url: 'https://jwkvfibsetjwsfnvmqvy.supabase.co',
  anonKey: 'sb_publishable_ZZTdegcyK_W2DaZ4H27RMQ_rWn5bJP7',  // publishable key — safe to commit, protected by RLS
  // Sign-in methods to offer — remove any you haven't enabled in Supabase Auth.
  providers: ['magiclink']
};
