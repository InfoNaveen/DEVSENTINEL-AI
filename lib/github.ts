import { Octokit } from '@octokit/rest';

export interface GitHubCommitOptions {
  token: string;
  owner: string;
  repo: string;
  branch: string;
  message: string;
  files: Array<{
    path: string;
    content: string;
  }>;
}

/**
 * Commit files to a GitHub repository
 * This is a stub implementation for the MVP
 */
export async function commitToGitHub(options: GitHubCommitOptions): Promise<{ prUrl?: string }> {
  try {
    const octokit = new Octokit({ auth: options.token });

    // Get the base branch SHA
    const { data: baseRef } = await octokit.git.getRef({
      owner: options.owner,
      repo: options.repo,
      ref: `heads/main`
    });

    // Create a new branch
    try {
      await octokit.git.createRef({
        owner: options.owner,
        repo: options.repo,
        ref: `refs/heads/${options.branch}`,
        sha: baseRef.object.sha
      });
    } catch (branchError) {
      console.warn('Branch may already exist:', branchError);
    }

    // In a full implementation, you would:
    // 1. Create blobs for each file
    // 2. Create a tree with the blobs
    // 3. Create a commit with the tree
    // 4. Update the branch reference
    // 5. Create a pull request

    // For MVP, we'll just return a mock PR URL
    return {
      prUrl: `https://github.com/${options.owner}/${options.repo}/compare/${options.branch}?expand=1`
    };
  } catch (error) {
    console.error('GitHub commit error:', error);
    throw new Error(`Failed to commit to GitHub: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * Extract repository info from a GitHub URL
 */
export function extractRepoInfo(repoUrl: string): { owner: string; repo: string } | null {
  try {
    const match = repoUrl.match(/github\.com\/([^\/]+)\/([^\/\.]+)/);
    if (match && match[1] && match[2]) {
      return {
        owner: match[1],
        repo: match[2]
      };
    }
    return null;
  } catch (error) {
    console.error('Error extracting repo info:', error);
    return null;
  }
}