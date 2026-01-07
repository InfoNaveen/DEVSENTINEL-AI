import { NextRequest, NextResponse } from 'next/server';
import { runOrchestrator } from '@/lib/orchestrator';
import { supabaseServiceRole } from '@/lib/supabase';
import { getAuthenticatedUser } from '@/lib/auth-utils';
import { prepareProjectFromStorage, cleanupProjectDir } from '@/lib/project-utils';
import { generateCodeFromStory } from '@/lib/code-generator';
import { uploadToStorage } from '@/lib/storage-utils';
import { promises as fs } from 'fs';
import path from 'path';
import AdmZip from 'adm-zip';

async function zipDirectory(dirPath: string): Promise<Buffer> {
  const zip = new AdmZip();
  zip.addLocalFolder(dirPath);
  return zip.toBuffer();
}

export async function POST(request: NextRequest) {
  let projectDir: string | null = null;

  try {
    // Authenticate user
    const user = await getAuthenticatedUser(request);
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { projectId, userStory } = body;

    // Validate input
    if (!projectId) {
      return NextResponse.json({ success: false, error: 'Project ID is required' }, { status: 400 });
    }

    const supabase = supabaseServiceRole();

    // Get project details
    const { data: project, error: projectError } = await supabase
      .from('projects')
      .select('*')
      .eq('id', projectId)
      .eq('user_id', user.id) // Ensure user owns the project
      .single();

    if (projectError || !project) {
      return NextResponse.json({ success: false, error: 'Project not found or access denied' }, { status: 404 });
    }

    // Log start event
    await supabase
      .from('timeline_events')
      .insert([
        {
          project_id: projectId,
          event_type: 'orchestrate_start',
          event_message: 'Starting multi-agent orchestration pipeline'
        }
      ]);

    // Prepare project directory
    const tmpDir = '/tmp';
    projectDir = path.join(tmpDir, `devsentinel-${projectId}-${Date.now()}`);
    await fs.mkdir(projectDir, { recursive: true });

    // Handle user story code generation
    if (userStory) {
      try {
        // Generate code from user story
        const { architecture, generatedFiles, feedback } = await generateCodeFromStory(userStory, projectDir);

        // Log generation event
        await supabase
          .from('timeline_events')
          .insert([
            {
              project_id: projectId,
              event_type: 'code_generated',
              event_message: `Generated ${generatedFiles.length} files from user story`
            }
          ]);

        // Upload generated code to storage
        const zipBuffer = await zipDirectory(projectDir);
        const storagePath = `projects/${projectId}/generated.zip`;
        await uploadToStorage(storagePath, zipBuffer, 'application/zip');

        // Store architecture JSON in storage
        const architecturePath = `projects/${projectId}/architecture.json`;
        await uploadToStorage(architecturePath, Buffer.from(JSON.stringify(architecture, null, 2)), 'application/json');
      } catch (error: any) {
        console.error('Code generation error:', error);
        await supabase
          .from('timeline_events')
          .insert([
            {
              project_id: projectId,
              event_type: 'code_generation_error',
              event_message: `Code generation failed: ${error.message}`
            }
          ]);
        // Continue with scanning even if generation had issues
      }
    } else if (project.repo_url) {
      // Project has source in storage - download it
      const storagePath = `projects/${projectId}/source.zip`;
      try {
        const extractedDir = await prepareProjectFromStorage(projectId, storagePath);
        // Move contents to projectDir
        const entries = await fs.readdir(extractedDir, { withFileTypes: true });
        for (const entry of entries) {
          const srcPath = path.join(extractedDir, entry.name);
          const destPath = path.join(projectDir, entry.name);
          if (entry.isDirectory()) {
            await fs.cp(srcPath, destPath, { recursive: true });
          } else {
            await fs.copyFile(srcPath, destPath);
          }
        }
        await fs.rm(extractedDir, { recursive: true, force: true });
      } catch (error: any) {
        console.error('Failed to load project from storage:', error);
        return NextResponse.json({ 
          success: false, 
          error: `Failed to load project: ${error.message}` 
        }, { status: 500 });
      }
    }

    // Run the orchestrator (scans the code)
    const result = await runOrchestrator(projectDir);

    // Validate orchestrator result
    if (!result || !result.findings || !result.patches) {
      return NextResponse.json({ success: false, error: 'Invalid orchestrator result' }, { status: 500 });
    }

    // Count severities
    const severityCounts = {
      high: result.findings.filter(f => f.severity === 'high').length,
      medium: result.findings.filter(f => f.severity === 'medium').length,
      low: result.findings.filter(f => f.severity === 'low').length
    };

    // Create scan record
    const { data: scan, error: scanError } = await supabase
      .from('scans')
      .insert([
        {
          project_id: projectId,
          severity_counts: severityCounts
        }
      ])
      .select()
      .single();

    if (scanError) {
      console.error('Error creating scan:', scanError);
      return NextResponse.json({ success: false, error: 'Failed to create scan record' }, { status: 500 });
    }

    // Store vulnerabilities
    let vulnerabilityIds: Record<string, string> = {};
    if (scan && result.findings.length > 0) {
      const vulnerabilities = result.findings.map(finding => ({
        scan_id: scan.id,
        severity: finding.severity,
        file_path: finding.file,
        line_number: finding.line,
        description: finding.type,
        code_snippet: finding.snippet
      }));

      const { data: insertedVulns, error: vulnError } = await supabase
        .from('vulnerabilities')
        .insert(vulnerabilities)
        .select('id, file_path, line_number');

      if (vulnError) {
        console.error('Error storing vulnerabilities:', vulnError);
        return NextResponse.json({ success: false, error: 'Failed to store vulnerabilities' }, { status: 500 });
      }

      // Create a map for patch association
      if (insertedVulns) {
        insertedVulns.forEach(vuln => {
          const key = `${vuln.file_path}:${vuln.line_number}`;
          vulnerabilityIds[key] = vuln.id;
        });
      }
    }

    // Store patches with proper vulnerability associations
    if (scan && result.patches.length > 0) {
      const patches = result.patches.map(patch => {
        // Try to find matching vulnerability by file and approximate line
        const matchingKey = Object.keys(vulnerabilityIds).find(key => 
          key.startsWith(patch.file + ':')
        );
        
        return {
          scan_id: scan.id,
          vulnerability_id: matchingKey ? vulnerabilityIds[matchingKey] : null,
          before_code: patch.before || null,
          after_code: patch.after || null
        };
      }).filter(p => p.vulnerability_id); // Only include patches with associated vulnerabilities

      if (patches.length > 0) {
        const { error: patchError } = await supabase
          .from('patches')
          .insert(patches);

        if (patchError) {
          console.error('Error storing patches:', patchError);
          // Don't fail the request if patch storage fails
        }
      }
    }

    // Log completion event
    await supabase
      .from('timeline_events')
      .insert([
        {
          project_id: projectId,
          event_type: 'orchestrate_complete',
          event_message: `Orchestration completed with ${result.findings.length} findings and ${result.patches.length} patches`
        }
      ]);

    return NextResponse.json({
      success: true,
      findings: result.findings,
      patches: result.patches,
      patchStats: result.patchStats,
      scanId: scan?.id
    });
  } catch (error: any) {
    console.error('Orchestration error:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message || 'Internal server error' 
    }, { status: 500 });
  } finally {
    // Clean up project directory
    if (projectDir) {
      await cleanupProjectDir(projectDir);
    }
  }
}
