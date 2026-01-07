const { createClient } = require('@supabase/supabase-js');

async function testSupabase() {
  try {
    console.log('Testing Supabase integration...');
    
    // Get environment variables
    const supabaseUrl = process.env.SUPABASE_URL || 'https://nvpjmgwyulwfnpmiwnke.supabase.co';
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'YOUR_SUPABASE_SERVICE_ROLE_KEY_HERE';
    
    console.log('Using Supabase URL:', supabaseUrl);
    
    // Initialize Supabase client
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Test connection by fetching projects (should return empty array if no projects exist)
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .limit(1);
    
    if (error) {
      console.error('Supabase connection error:', error);
      return;
    }
    
    console.log('Supabase connection successful!');
    console.log('Projects table accessible. Found', data?.length || 0, 'records');
    
    console.log('Supabase integration test completed successfully!');
  } catch (error) {
    console.error('Supabase test failed:', error);
  }
}

testSupabase();