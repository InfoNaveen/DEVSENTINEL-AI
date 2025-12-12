import { scanProject } from './sentinel';

async function testSentinel() {
  try {
    console.log('Testing DevSentinel AI scanner...');
    
    // Scan the test project
    const result = await scanProject('./tmp/devsentinel/test-project');
    
    console.log('Scan Results:');
    console.log('Findings:', result.findings);
    console.log('Patches:', result.patches);
    
    console.log('Test completed successfully!');
  } catch (error) {
    console.error('Test failed:', error);
  }
}

// Run the test
testSentinel();