const required = ['SUPABASE_URL', 'SUPABASE_SERVICE_ROLE_KEY', 'SNAPSHOT_BUCKET'];
let ok = true;
for (const k of required) {
  if (!process.env[k]) {
    console.error(`Missing env: ${k}`);
    ok = false;
  } else {
    console.log(`Found env: ${k}`);
  }
}
if (!ok) process.exit(2);
console.log('All required envs present.');
