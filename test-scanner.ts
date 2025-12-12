import { scanProject } from './lib/sentinel.js';

async function testScanner() {
  try {
    console.log('Testing DevSentinel AI scanner...');
    
    // Scan the test project
    const result = await scanProject('./tmp/devsentinel/test-project');
    
    console.log('Scan Results:');
    console.log('Findings:', JSON.stringify(result.findings, null, 2));
    console.log('Patches:', JSON.stringify(result.patches, null, 2));
    
    console.log('Test completed successfully!');
  } catch (error) {
    console.error('Test failed:', error);
  }
}

// Run the test
testScanner();