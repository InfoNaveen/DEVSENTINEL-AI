import { NextRequest, NextResponse } from 'next/server';
import { RedTeamValidationGate } from '@/services/offensive_engine/neurosploit-integration';
import { getAuthenticatedUser } from '@/lib/auth-utils';

export async function POST(request: NextRequest) {
  try {
    // Authenticate user
    const user = await getAuthenticatedUser(request);
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { projectPath } = body;

    // Validate input
    if (!projectPath) {
      return NextResponse.json({ success: false, error: 'Project path is required' }, { status: 400 });
    }

    // Validate project path (basic security check)
    if (projectPath.includes('..') || projectPath.includes('../')) {
      return NextResponse.json({ success: false, error: 'Invalid project path' }, { status: 400 });
    }

    // Initialize Red Team Validation Gate
    const redTeamGate = new RedTeamValidationGate(projectPath);
    
    // Run red team validation
    const results = await redTeamGate.runValidation();

    return NextResponse.json({
      success: true,
      ...results
    });
  } catch (error) {
    console.error('Red team scan error:', error);
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Internal server error' 
    }, { status: 500 });
  }
}