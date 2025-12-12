import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import { runOrchestrator } from '@/lib/orchestrator';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { projectId } = body;

    if (!projectId) {
      return NextResponse.json({ success: false, error: 'Project ID is required' }, { status: 400 });
    }

    const projectPath = path.join(process.cwd(), 'tmp', 'devsentinel', projectId);

    // Run the orchestrator
    const result = await runOrchestrator(projectPath);

    return NextResponse.json({
      success: true,
      findings: result.findings,
      patches: result.patches
    });
  } catch (error) {
    console.error('Scan error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}