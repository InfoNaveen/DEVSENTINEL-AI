const { supabaseServer } = require('./lib/supabase');

async function testSupabase() {
  try {
    console.log('Testing Supabase integration...');
    
    // Initialize Supabase client
    const supabase = supabaseServer();
    
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
    
    // Test inserting a sample project
    const { data: insertData, error: insertError } = await supabase
      .from('projects')
      .insert([
        {
          name: 'Test Project',
          user_id: '00000000-0000-0000-0000-000000000000', // Placeholder user ID
          repo_url: 'https://github.com/example/repo'
        }
      ])
      .select();
    
    if (insertError) {
      console.error('Error inserting test project:', insertError);
    } else {
      console.log('Successfully inserted test project:', insertData[0]);
      
      // Clean up - delete the test project
      const { error: deleteError } = await supabase
        .from('projects')
        .delete()
        .eq('id', insertData[0].id);
      
      if (deleteError) {
        console.error('Error cleaning up test project:', deleteError);
      } else {
        console.log('Successfully cleaned up test project');
      }
    }
    
    console.log('Supabase integration test completed successfully!');
  } catch (error) {
    console.error('Supabase test failed:', error);
  }
}

testSupabase();