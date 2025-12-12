// Intentionally vulnerable code for testing DevSentinel AI

// HIGH RISK: eval() usage
function dangerousEval(userInput) {
    return eval(userInput);
}

// HIGH RISK: Hardcoded password
const dbPassword = "123456";

// HIGH RISK: SQL Injection
function getUserData(userId) {
    const query = "SELECT * FROM users WHERE id=" + userId;
    return executeQuery(query);
}

// MEDIUM RISK: XSS vulnerability
function renderUserContent(content) {
    document.getElementById("user-content").innerHTML = content;
}

// HIGH RISK: exec() usage
const { exec } = require('child_process');
function runCommand(cmd) {
    exec(cmd, (error, stdout, stderr) => {
        console.log(stdout);
    });
}

console.log("Vulnerable test file loaded");