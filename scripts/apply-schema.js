#!/usr/bin/env node
/**
 * Apply Database Schema to Supabase
 * This script reads the migration SQL and executes it via Supabase's pg_query endpoint
 *
 * Run: node scripts/apply-schema.js
 */

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
const SUPABASE_SERVICE_KEY = envVars.SUPABASE_SERVICE_ROLE_KEY;

// Read the migration SQL
const migrationPath = path.join(__dirname, '..', 'supabase', 'migrations', '001_initial_schema.sql');
const migrationSQL = fs.readFileSync(migrationPath, 'utf-8');

console.log('=== Applying Database Schema ===\n');
console.log(`Supabase URL: ${SUPABASE_URL}`);
console.log(`Migration file: ${migrationPath}\n`);

// Split the SQL into individual statements (roughly)
// This is a simple split - for more complex migrations you'd use a proper SQL parser
function splitSQLStatements(sql) {
  // Remove comments and split by semicolons, being careful about function bodies
  const statements = [];
  let current = '';
  let inFunction = false;

  const lines = sql.split('\n');

  for (const line of lines) {
    // Skip empty lines and comments
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('--')) continue;

    current += line + '\n';

    // Track if we're inside a function/trigger body
    if (trimmed.includes('$$')) {
      inFunction = !inFunction;
    }

    // If we see a semicolon and we're not in a function body, that's end of statement
    if (trimmed.endsWith(';') && !inFunction) {
      const stmt = current.trim();
      if (stmt.length > 0 && stmt !== ';') {
        statements.push(stmt);
      }
      current = '';
    }
  }

  // Don't forget the last statement if it doesn't end with semicolon
  if (current.trim().length > 0) {
    statements.push(current.trim());
  }

  return statements;
}

async function executeSQL(sql) {
  // Use the pg REST endpoint with service role key
  const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/exec_sql`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': SUPABASE_SERVICE_KEY,
      'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
      'Prefer': 'return=minimal'
    },
    body: JSON.stringify({ sql_query: sql })
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`SQL execution failed: ${error}`);
  }

  return true;
}

async function main() {
  console.log('Reading migration file...');
  console.log(`SQL length: ${migrationSQL.length} characters\n`);

  // For Supabase, we need to use the postgres connection directly
  // or execute via the Dashboard SQL Editor
  // The REST API doesn't support arbitrary SQL execution for security reasons

  console.log('Note: Supabase REST API does not support arbitrary SQL execution.');
  console.log('You have two options:\n');

  console.log('Option 1: Use Supabase CLI (recommended)');
  console.log('  1. Run: supabase login');
  console.log('  2. Run: supabase link --project-ref kryoqxltssxrsbivbzqe');
  console.log('  3. Run: supabase db push\n');

  console.log('Option 2: Use Supabase Dashboard SQL Editor');
  console.log('  1. Go to: https://supabase.com/dashboard/project/kryoqxltssxrsbivbzqe/sql');
  console.log('  2. Copy the contents of: supabase/migrations/001_initial_schema.sql');
  console.log('  3. Paste and run in the SQL Editor\n');

  console.log('Option 3: Use the database connection string directly');
  console.log('  1. Get connection string from Supabase Dashboard > Settings > Database');
  console.log('  2. Run: psql <connection_string> -f supabase/migrations/001_initial_schema.sql\n');

  // Print the SQL for easy copy-paste
  console.log('='.repeat(60));
  console.log('SQL to execute (copy this to Supabase SQL Editor):');
  console.log('='.repeat(60));
  console.log('\n' + migrationSQL);
}

main().catch(console.error);
