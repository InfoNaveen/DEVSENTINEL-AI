import { createSupabaseServerClient, getCurrentUserServer } from '@/lib/supabase-server';
import { redirect } from 'next/navigation';
import {
  Shield,
  Zap,
  Lock,
  TrendingUp,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Clock
} from 'lucide-react';
import Link from 'next/link';

// Server component - fetches data directly from Supabase
export default async function DashboardPage() {
  // Get authenticated user
  const user = await getCurrentUserServer();

  // Redirect to login if not authenticated
  if (!user) {
    redirect('/login');
  }

  const userId = user.id;

  // Initialize Supabase client
  const supabase = await createSupabaseServerClient();

  // Fetch user's projects
  const { data: projects, error: projectsError } = await supabase
    .from('projects')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(5);

  // Fetch recent scans
  let recentScans = [];
  if (projects && projects.length > 0) {
    const projectIds = projects.map(p => p.id);

    const { data: scans, error: scansError } = await supabase
      .from('scans')
      .select(`
        *,
        projects(name)
      `)
      .in('project_id', projectIds)
      .order('created_at', { ascending: false })
      .limit(5);

    recentScans = scans || [];
  }

  // Fetch recent timeline events
  let timelineEvents = [];
  if (projects && projects.length > 0) {
    const projectIds = projects.map(p => p.id);

    const { data: events, error: eventsError } = await supabase
      .from('timeline_events')
      .select('*')
      .in('project_id', projectIds)
      .order('created_at', { ascending: false })
      .limit(5);

    timelineEvents = events || [];
  }

  // Calculate stats
  const totalProjects = projects ? projects.length : 0;
  const totalScans = recentScans ? recentScans.length : 0;
  const totalEvents = timelineEvents ? timelineEvents.length : 0;

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Welcome to your DevSentinel AI dashboard
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="mica-strong rounded-xl p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <FileText className="h-24 w-24 text-brand-primary" />
          </div>
          <div className="flex items-center relative z-10">
            <div className="p-3 rounded-lg bg-brand-primary/20 border border-brand-primary/30">
              <FileText className="h-6 w-6 text-brand-primary" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-400">Total Projects</p>
              <p className="text-3xl font-bold text-white mt-1">{totalProjects}</p>
            </div>
          </div>
        </div>

        <div className="mica-strong rounded-xl p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Shield className="h-24 w-24 text-brand-secondary" />
          </div>
          <div className="flex items-center relative z-10">
            <div className="p-3 rounded-lg bg-brand-secondary/20 border border-brand-secondary/30">
              <Shield className="h-6 w-6 text-brand-secondary" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-400">Total Scans</p>
              <p className="text-3xl font-bold text-white mt-1">{totalScans}</p>
            </div>
          </div>
        </div>

        <div className="mica-strong rounded-xl p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Clock className="h-24 w-24 text-brand-accent" />
          </div>
          <div className="flex items-center relative z-10">
            <div className="p-3 rounded-lg bg-brand-accent/20 border border-brand-accent/30">
              <Clock className="h-6 w-6 text-brand-accent" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-400">Recent Events</p>
              <p className="text-3xl font-bold text-white mt-1">{totalEvents}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Projects */}
      <div className="mica-strong rounded-xl overflow-hidden mb-8">
        <div className="px-6 py-5 border-b border-gray-700/50 flex justify-between items-center">
          <h3 className="text-lg font-medium text-white">Recent Projects</h3>
          <Link href="/projects" className="text-sm text-brand-secondary hover:text-brand-secondary/80 transition-colors">
            View All
          </Link>
        </div>
        <div className="overflow-x-auto">
          {projects && projects.length > 0 ? (
            <table className="min-w-full">
              <thead>
                <tr>
                  <th scope="col" className="dashboard-table-header">
                    Project Name
                  </th>
                  <th scope="col" className="dashboard-table-header">
                    Created
                  </th>
                  <th scope="col" className="dashboard-table-header">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700/30">
                {projects.map((project) => (
                  <tr key={project.id} className="dashboard-table-row">
                    <td className="dashboard-table-cell">
                      <div className="text-sm font-medium text-white">{project.name}</div>
                      {project.repo_url && (
                        <div className="text-xs text-gray-500 truncate max-w-xs font-mono mt-1">{project.repo_url}</div>
                      )}
                    </td>
                    <td className="dashboard-table-cell">
                      <div className="text-sm text-gray-400">
                        {new Date(project.created_at).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="dashboard-table-cell">
                      <span className="px-2.5 py-0.5 inline-flex text-xs leading-4 font-semibold rounded-full bg-green-500/10 text-green-400 border border-green-500/20">
                        Active
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="text-center py-12">
              <div className="mx-auto h-16 w-16 rounded-full bg-gray-800/50 flex items-center justify-center mb-4 border border-gray-700">
                <FileText className="h-8 w-8 text-gray-500" />
              </div>
              <h3 className="text-lg font-medium text-white">No projects yet</h3>
              <p className="mt-2 text-sm text-gray-400 max-w-sm mx-auto">
                Upload your first codebase to start scanning for vulnerabilities.
              </p>
              <div className="mt-6">
                <Link href="/upload">
                  <button className="inline-flex items-center px-6 py-3 border border-transparent text-sm font-medium rounded-lg text-black bg-brand-secondary hover:bg-brand-secondary/90 transition-all shadow-lg shadow-brand-secondary/20">
                    <FileText className="-ml-1 mr-2 h-5 w-5" />
                    Upload Project
                  </button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Recent Scans */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="mica-strong rounded-xl overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-700/50">
            <h3 className="text-lg font-medium text-white">Recent Scans</h3>
          </div>
          <div className="px-6 py-5">
            {recentScans && recentScans.length > 0 ? (
              <ul className="divide-y divide-gray-700/30">
                {recentScans.map((scan) => (
                  <li key={scan.id} className="py-4 hover:bg-white/5 transition-colors -mx-6 px-6">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <div className="p-2 rounded bg-brand-secondary/10 border border-brand-secondary/20">
                          <Shield className="h-5 w-5 text-brand-secondary" />
                        </div>
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-white truncate">
                          {scan.projects?.name || 'Unnamed Project'}
                        </p>
                        <p className="text-xs text-gray-500 truncate mt-0.5">
                          {new Date(scan.created_at).toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20">
                          Completed
                        </span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-center py-8">
                <Shield className="mx-auto h-12 w-12 text-gray-600" />
                <h3 className="mt-2 text-sm font-medium text-gray-300">No scans yet</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Upload a project and run your first scan.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Recent Timeline Events */}
        <div className="mica-strong rounded-xl overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-700/50">
            <h3 className="text-lg font-medium text-white">Recent Activity</h3>
          </div>
          <div className="px-6 py-5">
            {timelineEvents && timelineEvents.length > 0 ? (
              <ul className="divide-y divide-gray-700/30">
                {timelineEvents.map((event) => (
                  <li key={event.id} className="py-4 hover:bg-white/5 transition-colors -mx-6 px-6">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        {event.event_type === 'upload' ? (
                          <div className="p-2 rounded bg-green-500/10 border border-green-500/20">
                            <FileText className="h-5 w-5 text-green-400" />
                          </div>
                        ) : event.event_type === 'scan_complete' ? (
                          <div className="p-2 rounded bg-brand-secondary/10 border border-brand-secondary/20">
                            <Shield className="h-5 w-5 text-brand-secondary" />
                          </div>
                        ) : event.event_type === 'patch_apply' ? (
                          <div className="p-2 rounded bg-yellow-500/10 border border-yellow-500/20">
                            <Zap className="h-5 w-5 text-yellow-400" />
                          </div>
                        ) : (
                          <div className="p-2 rounded bg-gray-600/10 border border-gray-600/20">
                            <Clock className="h-5 w-5 text-gray-400" />
                          </div>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-gray-200">
                          {event.event_message}
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {new Date(event.created_at).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-center py-8">
                <Clock className="mx-auto h-12 w-12 text-gray-600" />
                <h3 className="mt-2 text-sm font-medium text-gray-300">No activity yet</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Your activity will appear here.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}