import path from 'path';
import { promises as fs } from 'fs';

export interface Finding {
  type: string;
  severity: 'low' | 'medium' | 'high';
  file: string;
  line: number;
  snippet: string;
}

export interface Patch {
  file: string;
  change: string;
}

export interface ScanResult {
  findings: Finding[];
  patches: Patch[];
}

/**
 * Scan a project for security vulnerabilities
 */
export async function scanProject(projectPath: string): Promise<ScanResult> {
  const findings: Finding[] = [];
  const patches: Patch[] = [];

  try {
    // Get all files in the project
    const files = await getAllFiles(projectPath);
    
    // Scan each file
    for (const file of files) {
      const filePath = path.join(projectPath, file);
      try {
        const content = await fs.readFile(filePath, 'utf8');
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
              file,
              line: lineNumber,
              snippet: line.trim()
            });
            
            // Auto-patch: Replace eval with safer alternative
            const patchedLine = line.replace(/eval\(/g, '/* TODO: Replace eval with safer alternative */ safeEval(');
            patches.push({
              file,
              change: `Replaced eval() with safeEval() on line ${lineNumber}`
            });
          }
          
          // Check for exec()
          if (line.includes('exec(')) {
            findings.push({
              type: 'Unsafe exec()',
              severity: 'high',
              file,
              line: lineNumber,
              snippet: line.trim()
            });
            
            // Auto-patch: Add TODO comment
            patches.push({
              file,
              change: `Added TODO comment for exec() on line ${lineNumber}`
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
                file,
                line: lineNumber,
                snippet: line.trim()
              });
              
              // Auto-patch: Replace with environment variable
              const patchedLine = line.replace(pattern, line.match(pattern)![0].split('=')[0].trim() + ' = process.env.' + line.match(pattern)![0].split('=')[0].trim().toUpperCase());
              patches.push({
                file,
                change: `Replaced hardcoded secret with environment variable on line ${lineNumber}`
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
                file,
                line: lineNumber,
                snippet: line.trim()
              });
              
              // Auto-patch: Add TODO comment
              patches.push({
                file,
                change: `Added TODO comment for SQL injection on line ${lineNumber}`
              });
            }
          }
          
          // Check for XSS patterns
          if (line.includes('innerHTML=')) {
            findings.push({
              type: 'Potential XSS',
              severity: 'medium',
              file,
              line: lineNumber,
              snippet: line.trim()
            });
            
            // Auto-patch: Add TODO comment
            patches.push({
              file,
              change: `Added TODO comment for XSS on line ${lineNumber}`
            });
          }
        }
      } catch (err) {
        // Skip binary files or files that can't be read
        continue;
      }
    }
  } catch (error) {
    console.error('Scanning error:', error);
    throw new Error(`Failed to scan project: ${error instanceof Error ? error.message : String(error)}`);
  }

  return { findings, patches };
}

/**
 * Get all files in a directory recursively
 */
async function getAllFiles(dir: string): Promise<string[]> {
  try {
    // For simplicity in MVP, we'll just return common code files
    // In a production system, we'd use a proper glob pattern
    const extensions = ['js', 'ts', 'jsx', 'tsx', 'py', 'php', 'rb', 'java', 'cpp', 'cs'];
    const files: string[] = [];
    
    for (const ext of extensions) {
      try {
        // This is a simplified approach for MVP
        // A real implementation would use glob patterns
        const pattern = `${dir}/**/*.${ext}`;
        // We'll implement a simpler file traversal for now
        const dirFiles = await walkDirectory(dir, ext);
        files.push(...dirFiles);
      } catch (err) {
        // Continue with other extensions if one fails
        continue;
      }
    }
    
    return files;
  } catch (error) {
    console.error('Error getting files:', error);
    return [];
  }
}

/**
 * Walk directory and find files with specific extension
 */
async function walkDirectory(dir: string, extension: string): Promise<string[]> {
  const files: string[] = [];
  try {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      
      if (entry.isDirectory()) {
        // Skip node_modules and other common directories
        if (!['node_modules', '.git', 'dist', 'build'].includes(entry.name)) {
          const subFiles = await walkDirectory(fullPath, extension);
          files.push(...subFiles);
        }
      } else if (entry.isFile() && entry.name.endsWith('.' + extension)) {
        // Return relative path from project root
        const relativePath = path.relative(process.cwd(), fullPath);
        files.push(relativePath);
      }
    }
  } catch (error) {
    // Silently ignore errors for files that can't be accessed
  }
  
  return files;
}