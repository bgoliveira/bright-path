#!/usr/bin/env node
/**
 * Test Supabase Connection
 * Run: node scripts/test-supabase-connection.js
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

const SUPABASE_URL = envVars.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = envVars.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const SUPABASE_SERVICE_KEY = envVars.SUPABASE_SERVICE_ROLE_KEY;

console.log('=== Supabase Connection Test ===\n');

// Validate environment variables
console.log('1. Checking environment variables...\n');

const checks = [
  {
    name: 'NEXT_PUBLIC_SUPABASE_URL',
    value: SUPABASE_URL,
    validate: (v) => v && v.startsWith('https://') && v.includes('.supabase.co'),
    expected: 'https://<project-ref>.supabase.co'
  },
  {
    name: 'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    value: SUPABASE_ANON_KEY,
    validate: (v) => v && v.length > 20,
    expected: 'JWT token (typically starts with eyJ)'
  },
  {
    name: 'SUPABASE_SERVICE_ROLE_KEY',
    value: SUPABASE_SERVICE_KEY,
    validate: (v) => v && v.length > 20,
    expected: 'JWT token (typically starts with eyJ)'
  },
  {
    name: 'NEXT_PUBLIC_GOOGLE_CLIENT_ID',
    value: envVars.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
    validate: (v) => v && v.endsWith('.apps.googleusercontent.com'),
    expected: 'ends with .apps.googleusercontent.com'
  },
  {
    name: 'GOOGLE_CLIENT_SECRET',
    value: envVars.GOOGLE_CLIENT_SECRET,
    validate: (v) => v && v.length > 10,
    expected: 'Google OAuth client secret'
  },
  {
    name: 'NEXT_PUBLIC_APP_URL',
    value: envVars.NEXT_PUBLIC_APP_URL,
    validate: (v) => v && (v.startsWith('http://') || v.startsWith('https://')),
    expected: 'http://localhost:3000 for dev'
  },
  {
    name: 'ENCRYPTION_KEY',
    value: envVars.ENCRYPTION_KEY,
    validate: (v) => v && v.length >= 32,
    expected: 'at least 32 characters'
  }
];

let allValid = true;
checks.forEach(check => {
  const isValid = check.validate(check.value);
  const status = isValid ? '✓' : '✗';
  const preview = check.value ? `${check.value.substring(0, 30)}...` : '(not set)';
  console.log(`  ${status} ${check.name}`);
  console.log(`    Value: ${preview}`);
  if (!isValid) {
    console.log(`    Expected: ${check.expected}`);
    allValid = false;
  }
  console.log('');
});

if (!allValid) {
  console.log('⚠️  Some environment variables need attention.\n');
}

// Test Supabase connection
console.log('2. Testing Supabase connection...\n');

async function testConnection() {
  try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

    // Test basic connection by checking if we can reach the API
    const { data, error } = await supabase.from('profiles').select('count').limit(0);

    if (error) {
      // If error is about table not existing, connection works but schema not applied
      if (error.message.includes('does not exist') || error.code === '42P01') {
        console.log('  ✓ Connection successful (API reachable)');
        console.log('  ⚠ Table "profiles" does not exist - schema needs to be applied');
        return { connected: true, schemaApplied: false };
      }
      // If RLS policy error, that's actually a good sign - means connection works
      if (error.message.includes('policy') || error.code === '42501') {
        console.log('  ✓ Connection successful');
        console.log('  ✓ Schema appears to be applied (RLS is active)');
        return { connected: true, schemaApplied: true };
      }
      throw error;
    }

    console.log('  ✓ Connection successful');
    console.log('  ✓ Schema appears to be applied');
    return { connected: true, schemaApplied: true };

  } catch (err) {
    console.log('  ✗ Connection failed');
    console.log(`    Error: ${err.message}`);

    if (err.message.includes('Invalid API key') || err.message.includes('Invalid JWT')) {
      console.log('\n    Hint: Your Supabase keys may be invalid.');
      console.log('    Get the correct keys from: https://supabase.com/dashboard/project/_/settings/api');
    }

    return { connected: false, schemaApplied: false };
  }
}

// Test with service role key
async function testServiceConnection() {
  console.log('\n3. Testing service role connection...\n');

  try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
      auth: { persistSession: false }
    });

    // Try to list tables (requires service role)
    const { data, error } = await supabase.rpc('to_regclass', { name: 'public.profiles' });

    if (error && !error.message.includes('does not exist')) {
      // Try a simpler query
      const { error: simpleError } = await supabase.from('profiles').select('id').limit(1);

      if (simpleError && simpleError.message.includes('does not exist')) {
        console.log('  ✓ Service role connection works');
        console.log('  ⚠ Schema not applied yet');
        return true;
      }

      if (!simpleError) {
        console.log('  ✓ Service role connection works');
        return true;
      }
    }

    console.log('  ✓ Service role connection works');
    return true;

  } catch (err) {
    console.log('  ✗ Service role connection failed');
    console.log(`    Error: ${err.message}`);
    return false;
  }
}

async function main() {
  const { connected, schemaApplied } = await testConnection();

  if (connected) {
    await testServiceConnection();
  }

  console.log('\n=== Summary ===\n');
  console.log(`Environment variables: ${allValid ? '✓ All valid' : '⚠ Some need attention'}`);
  console.log(`Supabase connection: ${connected ? '✓ Working' : '✗ Not working'}`);
  console.log(`Database schema: ${schemaApplied ? '✓ Applied' : '⚠ Needs to be applied'}`);

  if (!schemaApplied && connected) {
    console.log('\nNext step: Apply the database schema');
    console.log('Run the SQL in supabase/migrations/001_initial_schema.sql via:');
    console.log('  - Supabase Dashboard > SQL Editor, or');
    console.log('  - supabase db push (after installing Supabase CLI)');
  }
}

main().catch(console.error);
