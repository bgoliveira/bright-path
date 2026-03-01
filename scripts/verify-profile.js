#!/usr/bin/env node
/**
 * Verify profile was created in Supabase
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load .env.local
const envPath = path.join(__dirname, '..', '.env.local');
const envContent = fs.readFileSync(envPath, 'utf-8');
const envVars = {};
envContent.split('\n').forEach(line => {
  const match = line.match(/^([^#=]+)=(.*)$/);
  if (match) {
    envVars[match[1].trim()] = match[2].trim();
  }
});

const supabase = createClient(
  envVars.NEXT_PUBLIC_SUPABASE_URL,
  envVars.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { persistSession: false } }
);

async function main() {
  console.log('=== Verifying Supabase Data ===\n');

  // Check profiles
  console.log('1. Checking profiles table...');
  const { data: profiles, error: profilesError } = await supabase
    .from('profiles')
    .select('id, email, role, full_name, created_at')
    .limit(5);

  if (profilesError) {
    console.log('   Error:', profilesError.message);
  } else if (profiles && profiles.length > 0) {
    console.log(`   ✓ Found ${profiles.length} profile(s):`);
    profiles.forEach(p => {
      console.log(`     - ${p.email} (${p.role}) - ${p.full_name}`);
    });
  } else {
    console.log('   ⚠ No profiles found');
  }

  // Check auth.users
  console.log('\n2. Checking auth.users...');
  const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();

  if (authError) {
    console.log('   Error:', authError.message);
  } else if (authUsers && authUsers.users.length > 0) {
    console.log(`   ✓ Found ${authUsers.users.length} user(s):`);
    authUsers.users.slice(0, 5).forEach(u => {
      console.log(`     - ${u.email} (created: ${new Date(u.created_at).toLocaleDateString()})`);
    });
  } else {
    console.log('   ⚠ No auth users found');
  }

  // Check tables exist
  console.log('\n3. Checking all tables exist...');
  const tables = ['profiles', 'courses', 'assignments', 'submissions', 'student_parent_links'];
  for (const table of tables) {
    const { error } = await supabase.from(table).select('count').limit(0);
    if (error) {
      console.log(`   ✗ ${table}: ${error.message}`);
    } else {
      console.log(`   ✓ ${table}`);
    }
  }

  console.log('\n=== Verification Complete ===');
}

main().catch(console.error);
