#!/usr/bin/env node
/**
 * Create missing profiles for existing auth users
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
  console.log('=== Creating Missing Profiles ===\n');

  // Get all auth users
  const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();

  if (authError) {
    console.log('Error getting auth users:', authError.message);
    return;
  }

  for (const user of authUsers.users) {
    // Check if profile exists
    const { data: profile } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', user.id)
      .single();

    if (!profile) {
      console.log(`Creating profile for: ${user.email}`);

      const { error: insertError } = await supabase.from('profiles').insert({
        id: user.id,
        email: user.email,
        role: 'student',
        full_name: user.user_metadata?.full_name || user.email.split('@')[0],
        avatar_url: user.user_metadata?.avatar_url || null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });

      if (insertError) {
        console.log(`  Error: ${insertError.message}`);
      } else {
        console.log(`  ✓ Profile created`);
      }
    } else {
      console.log(`Profile already exists for: ${user.email}`);
    }
  }

  console.log('\n=== Done ===');
}

main().catch(console.error);
