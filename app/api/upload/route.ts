import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';
import extractZip from '@/lib/extractZip';
import { supabaseServiceRole } from '@/lib/supabase';
import { getAuthenticatedUser } from '@/lib/auth-utils';
import { uploadToStorage } from '@/lib/storage-utils';
import AdmZip from 'adm-zip';

const execPromise = promisify(exec);

/**
 * Create a ZIP file from a directory
 */
async function zipDirectory(dirPath: string): Promise<Buffer> {
  const zip = new AdmZip();
  zip.addLocalFolder(dirPath);
  return zip.toBuffer();
}

export async function POST(request: NextRequest) {
  try {
    // Authenticate user
    const user = await getAuthenticatedUser(request);
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const userId = user.id;
    const supabase = supabaseServiceRole();

    // Check if it's a file upload, GitHub URL, or user story
    const contentType = request.headers.get('content-type') || '';
    
    if (contentType.includes('multipart/form-data')) {
      // Handle ZIP file upload or user story
      const formData = await request.formData();
      const file = formData.get('file') as File | null;
      const userStory = formData.get('userStory') as string | null;
      const projectName = (formData.get('projectName') as string) || `Project ${new Date().toISOString()}`;

      // Create project in Supabase first to get UUID
      const { data: project, error: projectError } = await supabase
        .from('projects')
        .insert([
          {
            name: projectName,
            user_id: userId,
            repo_url: null,
          }
        ])
        .select()
        .single();

      if (projectError || !project) {
        console.error('Error creating project:', projectError);
        return NextResponse.json({ success: false, error: 'Failed to create project' }, { status: 500 });
      }

      const projectId = project.id;
      const storagePath = `projects/${projectId}/source.zip`;

      if (userStory) {
        // User story input - will be handled by code generation
        // Store user story in project metadata (we can extend schema later)
        // For now, store it in timeline
        await supabase
          .from('timeline_events')
          .insert([
            {
              project_id: projectId,
              event_type: 'user_story',
              event_message: `User story received: ${userStory.substring(0, 200)}...`
            }
          ]);

        return NextResponse.json({
          success: true,
          projectId: projectId,
          userStory: userStory,
          type: 'user_story'
        });
      } else if (file) {
        // Handle ZIP file upload
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Upload to Supabase Storage
        await uploadToStorage(storagePath, buffer, file.type || 'application/zip');

        // Log timeline event
        await supabase
          .from('timeline_events')
          .insert([
            {
              project_id: projectId,
              event_type: 'upload',
              event_message: 'Project uploaded via ZIP file'
            }
          ]);

        return NextResponse.json({
          success: true,
          projectId: projectId,
          storagePath: storagePath,
          type: 'zip_upload'
        });
      } else {
        return NextResponse.json({ success: false, error: 'No file or user story provided' }, { status: 400 });
      }
    } else {
      // Handle GitHub repository URL
      const body = await request.json();
      const { repoUrl, githubToken, projectName } = body;

      if (!repoUrl) {
        return NextResponse.json({ success: false, error: 'No repository URL provided' }, { status: 400 });
      }

      // Create project in Supabase first
      const { data: project, error: projectError } = await supabase
        .from('projects')
        .insert([
          {
            name: projectName || `GitHub Project ${new Date().toISOString()}`,
            user_id: userId,
            repo_url: repoUrl,
          }
        ])
        .select()
        .single();

      if (projectError || !project) {
        console.error('Error creating project:', projectError);
        return NextResponse.json({ success: false, error: 'Failed to create project' }, { status: 500 });
      }

      const projectId = project.id;

      // Clone repository to temporary location (using /tmp which works on Vercel)
      const tmpDir = '/tmp';
      const cloneDir = path.join(tmpDir, `devsentinel-${projectId}-${Date.now()}`);
      
      try {
        let cloneCmd = `git clone --depth 1 "${repoUrl}" "${cloneDir}"`;
        
        if (githubToken) {
          // Add token to URL for private repositories
          const urlObj = new URL(repoUrl);
          if (urlObj.hostname === 'github.com') {
            cloneCmd = `git clone --depth 1 "https://${githubToken}@${urlObj.hostname}${urlObj.pathname}" "${cloneDir}"`;
          }
        }

        await execPromise(cloneCmd, { timeout: 60000 }); // 60 second timeout

        // Create ZIP from cloned repository
        const zipBuffer = await zipDirectory(cloneDir);

        // Upload to Supabase Storage
        const storagePath = `projects/${projectId}/source.zip`;
        await uploadToStorage(storagePath, zipBuffer, 'application/zip');

        // Clean up cloned directory
        try {
          await fs.rm(cloneDir, { recursive: true, force: true });
        } catch (cleanupError) {
          console.warn('Failed to clean up clone directory:', cleanupError);
        }

        // Log timeline event
        await supabase
          .from('timeline_events')
          .insert([
            {
              project_id: projectId,
              event_type: 'upload',
              event_message: `Project cloned from ${repoUrl}`
            }
          ]);

        return NextResponse.json({
          success: true,
          projectId: projectId,
          storagePath: storagePath,
          type: 'github_repo'
        });
      } catch (cloneError: any) {
        console.error('Git clone error:', cloneError);
        
        // Clean up on error
        try {
          await fs.rm(cloneDir, { recursive: true, force: true });
        } catch {}

        return NextResponse.json({ 
          success: false, 
          error: `Failed to clone repository: ${cloneError.message}` 
        }, { status: 500 });
      }
    }
  } catch (error: any) {
    console.error('Upload error:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message || 'Internal server error' 
    }, { status: 500 });
  }
}
