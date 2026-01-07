#!/usr/bin/env node

// Script to apply Supabase schema
// This is for documentation purposes - in practice, you would copy the contents of supabase/schema.sql
// and paste it into the Supabase SQL editor

const fs = require('fs');
const path = require('path');

console.log('=== DevSentinel AI - Supabase Schema Application ===\n');

console.log('To apply the Supabase schema:');
console.log('1. Go to your Supabase project dashboard');
console.log('2. Navigate to SQL Editor');
console.log('3. Copy the contents of supabase/schema.sql');
console.log('4. Paste it into the SQL editor');
console.log('5. Click "Run" to execute the schema\n');

console.log('Schema contents:');
console.log('================\n');

const schemaPath = path.join(__dirname, 'supabase', 'schema.sql');
try {
  const schemaContent = fs.readFileSync(schemaPath, 'utf8');
  console.log(schemaContent);
} catch (error) {
  console.error('Error reading schema file:', error.message);
  process.exit(1);
}

console.log('\n=== Next Steps ===');
console.log('1. Enable Row Level Security (RLS) on all tables');
console.log('2. Configure authentication providers (Email, GitHub, Google)');
console.log('3. Set up OAuth redirect URLs in Supabase Auth settings');
console.log('4. Test the database connection with the test script');