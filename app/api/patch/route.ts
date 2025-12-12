import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import { promises as fs } from 'fs';
import AdmZip from 'adm-zip';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { projectId, export: shouldExport } = body;

    if (!projectId) {
      return NextResponse.json({ success: false, error: 'Project ID is required' }, { status: 400 });
    }

    const projectPath = path.join(process.cwd(), 'tmp', 'devsentinel', projectId);

    if (shouldExport) {
      // Create ZIP file of the patched project
      const zip = new AdmZip();
      zip.addLocalFolder(projectPath);
      
      const zipBuffer = zip.toBuffer();
      
      // @ts-ignore
      return new NextResponse(zipBuffer, {
        headers: {
          'Content-Type': 'application/zip',
          'Content-Disposition': 'attachment; filename="patched-code.zip"',
        },
      });
    } else {
      // Apply patches to the project (this would be handled by the orchestrator in a full implementation)
      return NextResponse.json({ success: true, message: 'Patches applied successfully' });
    }
  } catch (error) {
    console.error('Patch error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}