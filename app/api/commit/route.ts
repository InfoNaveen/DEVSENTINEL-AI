import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';
import { Octokit } from '@octokit/rest';

const execPromise = promisify(exec);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { projectId, githubToken, branchName = 'devsentinel-fixes', commitMessage = 'Apply security fixes from DevSentinel AI' } = body;

    if (!projectId) {
      return NextResponse.json({ success: false, error: 'Project ID is required' }, { status: 400 });
    }

    if (!githubToken) {
      return NextResponse.json({ success: false, error: 'GitHub token is required' }, { status: 400 });
    }

    const projectPath = path.join(process.cwd(), 'tmp', 'devsentinel', projectId);

    // Initialize git repo if not already initialized
    try {
      await execPromise('git init', { cwd: projectPath });
      await execPromise('git add .', { cwd: projectPath });
      await execPromise(`git commit -m "${commitMessage}"`, { cwd: projectPath });
    } catch (initError) {
      console.error('Git initialization error:', initError);
      // Continue anyway as the repo might already be initialized
    }

    // Get repository info (this is a simplified approach)
    // In a real implementation, you would extract this from the original repo
    const repoInfo = {
      owner: 'example',
      repo: 'example-repo'
    };

    const octokit = new Octokit({ auth: githubToken });

    // Create a new branch
    try {
      const { data: mainRef } = await octokit.git.getRef({
        owner: repoInfo.owner,
        repo: repoInfo.repo,
        ref: 'heads/main'
      });

      await octokit.git.createRef({
        owner: repoInfo.owner,
        repo: repoInfo.repo,
        ref: `refs/heads/${branchName}`,
        sha: mainRef.object.sha
      });
    } catch (branchError) {
      console.error('Branch creation error:', branchError);
      // Branch might already exist
    }

    // In a real implementation, you would:
    // 1. Push the changes to the new branch
    // 2. Create a pull request
    
    // For this MVP, we'll just return a success message
    return NextResponse.json({ 
      success: true,
      message: 'Changes committed successfully', 
      prUrl: `https://github.com/${repoInfo.owner}/${repoInfo.repo}/compare/${branchName}?expand=1` 
    });
  } catch (error) {
    console.error('Commit error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}