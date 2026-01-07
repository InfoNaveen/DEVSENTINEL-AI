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
        <div className="mica-strong rounded-xl p-6 border border-gray-600/30">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-microsoft-blue/20">
              <FileText className="h-6 w-6 text-microsoft-blue" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-400">Total Projects</p>
              <p className="text-2xl font-semibold text-white">{totalProjects}</p>
            </div>
          </div>
        </div>
        
        <div className="mica-strong rounded-xl p-6 border border-gray-600/30">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-microsoft-blue/20">
              <Shield className="h-6 w-6 text-microsoft-blue" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-400">Total Scans</p>
              <p className="text-2xl font-semibold text-white">{totalScans}</p>
            </div>
          </div>
        </div>
        
        <div className="mica-strong rounded-xl p-6 border border-gray-600/30">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-microsoft-blue/20">
              <Clock className="h-6 w-6 text-microsoft-blue" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-400">Recent Events</p>
              <p className="text-2xl font-semibold text-white">{totalEvents}</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Recent Projects */}
      <div className="mica-strong rounded-xl overflow-hidden mb-8 border border-gray-600/30">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-600/30">
          <h3 className="text-lg font-medium text-white">Recent Projects</h3>
        </div>
        <div className="px-4 py-5 sm:p-6">
          {projects && projects.length > 0 ? (
            <div className="overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Project Name
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Created
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {projects.map((project) => (
                    <tr key={project.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">{project.name}</div>
                        {project.repo_url && (
                          <div className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-xs">{project.repo_url}</div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-white">
                          {new Date(project.created_at).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200">
                          Active
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <FileText className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No projects</h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Get started by uploading your first codebase.
              </p>
              <div className="mt-6">
                <Link href="/upload">
                  <button className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-microsoft-blue hover:bg-[#106ebe] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-microsoft-blue">
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
        <div className="mica-strong rounded-xl overflow-hidden border border-gray-600/30">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-600/30">
            <h3 className="text-lg font-medium text-white">Recent Scans</h3>
          </div>
          <div className="px-4 py-5 sm:p-6">
            {recentScans && recentScans.length > 0 ? (
              <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                {recentScans.map((scan) => (
                  <li key={scan.id} className="py-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <Shield className="h-6 w-6 text-cyan-500" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                          {scan.projects?.name || 'Unnamed Project'}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                          Scanned on {new Date(scan.created_at).toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200">
                          Completed
                        </span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-center py-8">
                <Shield className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No scans yet</h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Upload a project and run your first scan.
                </p>
              </div>
            )}
          </div>
        </div>
        
        {/* Recent Timeline Events */}
        <div className="mica-strong rounded-xl overflow-hidden border border-gray-600/30">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-600/30">
            <h3 className="text-lg font-medium text-white">Recent Activity</h3>
          </div>
          <div className="px-4 py-5 sm:p-6">
            {timelineEvents && timelineEvents.length > 0 ? (
              <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                {timelineEvents.map((event) => (
                  <li key={event.id} className="py-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        {event.event_type === 'upload' ? (
                          <FileText className="h-6 w-6 text-green-500" />
                        ) : event.event_type === 'scan_complete' ? (
                          <Shield className="h-6 w-6 text-cyan-500" />
                        ) : event.event_type === 'patch_apply' ? (
                          <Zap className="h-6 w-6 text-yellow-500" />
                        ) : (
                          <Clock className="h-6 w-6 text-gray-500" />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {event.event_message}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {new Date(event.created_at).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-center py-8">
                <Clock className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No activity yet</h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
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