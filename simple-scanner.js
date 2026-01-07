const fs = require('fs');
const path = require('path');

// Simple vulnerability scanner for demonstration
function scanFileForVulnerabilities(filePath, fileName) {
  const findings = [];
  const patches = [];
  
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');
    
    // Scan each line for vulnerabilities
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const lineNumber = i + 1;
      
      // Check for eval()
      if (line.includes('eval(')) {
        findings.push({
          type: 'Unsafe eval()',
          severity: 'high',
          file: fileName,
          line: lineNumber,
          snippet: line.trim(),
          description: 'Use of eval() function can lead to code injection vulnerabilities',
          recommendation: 'Replace with safer alternatives like JSON.parse() or Function constructor with strict validation'
        });
        
        // Auto-patch: Replace eval with safer alternative
        const patchedLine = line.replace(/eval\(/g, '/* TODO: Replace eval with safer alternative */ safeEval(');
        patches.push({
          file: fileName,
          change: `Replaced eval() with safeEval() on line ${lineNumber}`,
          before: line,
          after: patchedLine
        });
      }
      
      // Check for exec()
      if (line.includes('exec(')) {
        findings.push({
          type: 'Unsafe exec()',
          severity: 'high',
          file: fileName,
          line: lineNumber,
          snippet: line.trim(),
          description: 'Use of exec() function can lead to command injection vulnerabilities',
          recommendation: 'Validate all inputs and use safer alternatives like child_process.execFile()'
        });
        
        // Auto-patch: Add TODO comment
        patches.push({
          file: fileName,
          change: `Added TODO comment for exec() on line ${lineNumber}`,
          before: line,
          after: `// TODO: Replace exec() with safer alternative\n${line}`
        });
      }
      
      // Check for hardcoded secrets
      const secretPatterns = [
        /password\s*=\s*['"][^'"]+['"]/i,
        /api[key|secret]\s*=\s*['"][^'"]+['"]/i,
        /secret\s*=\s*['"][^'"]+['"]/i
      ];
      
      for (const pattern of secretPatterns) {
        if (pattern.test(line)) {
          findings.push({
            type: 'Hardcoded Secret',
            severity: 'high',
            file: fileName,
            line: lineNumber,
            snippet: line.trim(),
            description: 'Hardcoded credentials pose a significant security risk',
            recommendation: 'Move secrets to environment variables or secure vault'
          });
          
          // Auto-patch: Replace with environment variable
          const varName = line.match(/([a-zA-Z_][a-zA-Z0-9_]*)\s*=/)?.[1] || 'SECRET';
          const envVarName = varName.toUpperCase();
          patches.push({
            file: fileName,
            change: `Replaced hardcoded secret with environment variable on line ${lineNumber}`,
            before: line,
            after: `${varName} = process.env.${envVarName} || 'MISSING_${envVarName}';`
          });
        }
      }
      
      // Check for SQL injection patterns
      const sqlPatterns = [
        /select\s+.*\s+from\s+.*\s*\+\s*\w+/i,
        /insert\s+into\s+.*\s+values\s*\(.*\s*\+\s*\w+/i,
        /update\s+.*\s+set\s+.*\s*\+\s*\w+/i
      ];
      
      for (const pattern of sqlPatterns) {
        if (pattern.test(line)) {
          findings.push({
            type: 'Potential SQL Injection',
            severity: 'high',
            file: fileName,
            line: lineNumber,
            snippet: line.trim(),
            description: 'Dynamic SQL construction can lead to injection attacks',
            recommendation: 'Use parameterized queries or ORM methods'
          });
          
          // Auto-patch: Add TODO comment
          patches.push({
            file: fileName,
            change: `Added TODO comment for SQL injection on line ${lineNumber}`,
            before: line,
            after: `// TODO: Use parameterized queries to prevent SQL injection\n${line}`
          });
        }
      }
      
      // Check for XSS patterns
      if (line.includes('innerHTML=')) {
        findings.push({
          type: 'Potential XSS',
          severity: 'medium',
          file: fileName,
          line: lineNumber,
          snippet: line.trim(),
          description: 'Direct DOM manipulation can lead to cross-site scripting',
          recommendation: 'Use textContent or sanitize HTML content'
        });
        
        // Auto-patch: Add TODO comment
        patches.push({
          file: fileName,
          change: `Added TODO comment for XSS on line ${lineNumber}`,
          before: line,
          after: `// TODO: Use textContent or sanitize HTML to prevent XSS\n${line}`
        });
      }
    }
  } catch (err) {
    console.error('Error scanning file:', err);
  }
  
  return { findings, patches };
}

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
    
    // Scan the file
    const result = scanFileForVulnerabilities(destFile, 'vulnerable-test.js');
    
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