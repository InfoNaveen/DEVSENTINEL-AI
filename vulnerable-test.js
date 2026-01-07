// Sample vulnerable JavaScript code for testing DevSentinel AI

// Hardcoded secret - HIGH SEVERITY
const apiKey = "sk-1234567890abcdef1234567890abcdef";

// Unsafe eval usage - HIGH SEVERITY
function dangerousFunction(userInput) {
  eval(userInput);
}

// SQL injection vulnerability - HIGH SEVERITY
function getUserData(userId) {
  const query = "SELECT * FROM users WHERE id = " + userId;
  // Execute query...
}

// Weak password comparison - MEDIUM SEVERITY
function checkPassword(inputPassword, storedPassword) {
  if (inputPassword == storedPassword) {
    return true;
  }
  return false;
}

// Insecure random number generation - MEDIUM SEVERITY
function generateToken() {
  return Math.random().toString(36).substring(2);
}

// XSS vulnerability - HIGH SEVERITY
function displayUserContent(content) {
  document.getElementById('user-content').innerHTML = content;
}

// Command injection vulnerability - HIGH SEVERITY
const { exec } = require('child_process');
function runCommand(userCommand) {
  exec('ls -la ' + userCommand, (error, stdout, stderr) => {
    console.log(stdout);
  });
}

// Exposed internal information - MEDIUM SEVERITY
function debugInfo() {
  return {
    version: "1.0.0",
    server: "prod-server-01",
    database: "mysql-prod-db"
  };
}

// Weak cryptographic hashing - MEDIUM SEVERITY
const crypto = require('crypto');
function hashPassword(password) {
  return crypto.createHash('md5').update(password).digest('hex');
}

console.log("This is a test file with intentional vulnerabilities for DevSentinel AI scanning");