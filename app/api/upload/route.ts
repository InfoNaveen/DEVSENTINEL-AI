import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';
import extractZip from '@/lib/extractZip';

const execPromise = promisify(exec);

export async function POST(request: NextRequest) {
  try {
    // Create tmp directory if it doesn't exist
    const tmpDir = path.join(process.cwd(), 'tmp');
    try {
      await fs.access(tmpDir);
    } catch {
      await fs.mkdir(tmpDir);
    }

    const devsentinelDir = path.join(tmpDir, 'devsentinel');
    try {
      await fs.access(devsentinelDir);
    } catch {
      await fs.mkdir(devsentinelDir);
    }

    // Generate unique project ID
    const projectId = Date.now().toString();
    const projectDir = path.join(devsentinelDir, projectId);
    await fs.mkdir(projectDir);

    // Check if it's a file upload or GitHub URL
    const contentType = request.headers.get('content-type') || '';
    
    if (contentType.includes('multipart/form-data')) {
      // Handle ZIP file upload
      const formData = await request.formData();
      const file = formData.get('file') as File;
      
      if (!file) {
        return NextResponse.json({ success: false, error: 'No file provided' }, { status: 400 });
      }

      // Convert File to Buffer
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Save uploaded file temporarily
      const tempFilePath = path.join(projectDir, 'uploaded.zip');
      await fs.writeFile(tempFilePath, buffer);

      // Extract ZIP file
      await extractZip(tempFilePath, projectDir);

      // Clean up temporary ZIP file
      await fs.unlink(tempFilePath);

      return NextResponse.json({ 
        success: true, 
        projectId,
        projectPath: projectDir
      });
    } else {
      // Handle GitHub repository URL
      const body = await request.json();
      const { repoUrl, githubToken } = body;

      if (!repoUrl) {
        return NextResponse.json({ success: false, error: 'No repository URL provided' }, { status: 400 });
      }

      // Clone repository
      let cloneCmd = `git clone ${repoUrl} "${projectDir}"`;
      
      if (githubToken) {
        // Add token to URL for private repositories
        const urlObj = new URL(repoUrl);
        if (urlObj.hostname === 'github.com') {
          cloneCmd = `git clone https://${githubToken}@${urlObj.hostname}${urlObj.pathname} "${projectDir}"`;
        }
      }

      try {
        await execPromise(cloneCmd);
      } catch (cloneError) {
        console.error('Git clone error:', cloneError);
        return NextResponse.json({ success: false, error: 'Failed to clone repository' }, { status: 500 });
      }

      return NextResponse.json({ 
        success: true, 
        projectId,
        projectPath: projectDir
      });
    }
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}