const fs = require('fs');
const path = require('path');

// Simple test to demonstrate the scanning functionality
async function testScan() {
  try {
    console.log('Testing DevSentinel AI scanning functionality...');
    
    // Create a test directory
    const testDir = path.join(__dirname, 'tmp', 'devsentinel', 'test-' + Date.now());
    fs.mkdirSync(testDir, { recursive: true });
    
    // Copy our vulnerable test file to the test directory
    const sourceFile = path.join(__dirname, 'test-zip', 'vulnerable-test.js');
    const destFile = path.join(testDir, 'vulnerable-test.js');
    fs.copyFileSync(sourceFile, destFile);
    
    console.log('Test file copied to:', destFile);
    console.log('Running scan...');
    
    // Import and run the scanner
    const { scanProject } = require('./lib/sentinel.ts');
    
    const result = await scanProject(testDir);
    
    console.log('\n=== SCAN RESULTS ===');
    console.log('Findings:', result.findings.length);
    console.log('Patches:', result.patches.length);
    
    if (result.findings.length > 0) {
      console.log('\n--- FINDINGS ---');
      result.findings.forEach((finding, index) => {
        console.log(`${index + 1}. ${finding.type} (${finding.severity})`);
        console.log(`   File: ${finding.file}`);
        console.log(`   Line: ${finding.line}`);
        console.log(`   Code: ${finding.snippet}`);
        if (finding.description) {
          console.log(`   Description: ${finding.description}`);
        }
        if (finding.recommendation) {
          console.log(`   Recommendation: ${finding.recommendation}`);
        }
        console.log('');
      });
    }
    
    if (result.patches.length > 0) {
      console.log('\n--- PATCHES ---');
      result.patches.forEach((patch, index) => {
        console.log(`${index + 1}. ${patch.change}`);
        console.log(`   File: ${patch.file}`);
        if (patch.before) {
          console.log(`   Before: ${patch.before}`);
        }
        if (patch.after) {
          console.log(`   After: ${patch.after}`);
        }
        console.log('');
      });
    }
    
    console.log('Test completed successfully!');
  } catch (error) {
    console.error('Test failed:', error);
  }
}

testScan();