const AdmZip = require('adm-zip');
import path from 'path';
import { promises as fs } from 'fs';

export default async function extractZip(zipPath: string, extractTo: string): Promise<void> {
  try {
    const zip = new AdmZip(zipPath);
    const zipEntries = zip.getEntries();
    
    // Create all directories first
    for (const entry of zipEntries) {
      const entryPath = path.join(extractTo, entry.entryName);
      
      if (entry.isDirectory) {
        try {
          await fs.access(entryPath);
        } catch {
          await fs.mkdir(entryPath, { recursive: true });
        }
      }
    }
    
    // Extract all files
    for (const entry of zipEntries) {
      const entryPath = path.join(extractTo, entry.entryName);
      
      if (!entry.isDirectory) {
        // Ensure parent directory exists
        const dirPath = path.dirname(entryPath);
        try {
          await fs.access(dirPath);
        } catch {
          await fs.mkdir(dirPath, { recursive: true });
        }
        
        // Write file
        await fs.writeFile(entryPath, entry.getData());
      }
    }
  } catch (error) {
    console.error('ZIP extraction error:', error);
    throw new Error(`Failed to extract ZIP file: ${error instanceof Error ? error.message : String(error)}`);
  }
}