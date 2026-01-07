import { createSupabaseServerClient } from '@/lib/supabase-server';
import { 
  Download,
  Wrench,
  AlertTriangle,
  CheckCircle,
  Shield,
  TrendingUp,
  FileCode
} from 'lucide-react';
import Link from 'next/link';
import { VulnerabilityTable } from '@/components/VulnerabilityTable';

// Server component - fetches data directly from Supabase
export default async function ScanResultsServerPage({ searchParams }: { searchParams: { scanId?: string } }) {
  const scanId = searchParams.scanId;
  
  if (!scanId) {
    return (
      <div className="max-w-7xl mx-auto py-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Scan Results Not Found</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Please select a scan to view results.
          </p>
          <Link href="/dashboard">
            <button className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
              Back to Dashboard
            </button>
          </Link>
        </div>
      </div>
    );
  }
  
  // Initialize Supabase client
  const supabase = await createSupabaseServerClient();
  
  // Fetch scan details
  const { data: scan, error: scanError } = await supabase
    .from('scans')
    .select(`
      *,
      projects(name)
    `)
    .eq('id', scanId)
    .single();
  
  if (scanError || !scan) {
    return (
      <div className="max-w-7xl mx-auto py-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Scan Not Found</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            The requested scan could not be found.
          </p>
          <Link href="/dashboard">
            <button className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
              Back to Dashboard
            </button>
          </Link>
        </div>
      </div>
    );
  }
  
  // Fetch vulnerabilities for this scan
  const { data: vulnerabilities, error: vulnError } = await supabase
    .from('vulnerabilities')
    .select('*')
    .eq('scan_id', scanId)
    .order('severity', { ascending: false });
  
  if (vulnError) {
    console.error('Error fetching vulnerabilities:', vulnError);
  }
  
  // Fetch patches for this scan
  const { data: patches, error: patchError } = await supabase
    .from('patches')
    .select('*')
    .eq('scan_id', scanId);
  
  if (patchError) {
    console.error('Error fetching patches:', patchError);
  }
  
  // Calculate statistics
  const criticalIssues = vulnerabilities?.filter(v => v.severity === 'high').length || 0;
  const mediumIssues = vulnerabilities?.filter(v => v.severity === 'medium').length || 0;
  const lowIssues = vulnerabilities?.filter(v => v.severity === 'low').length || 0;
  const totalPatches = patches?.length || 0;
  const totalIssues = criticalIssues + mediumIssues + lowIssues;
  
  const criticalPercent = totalIssues > 0 ? (criticalIssues / totalIssues) * 100 : 0;
  const mediumPercent = totalIssues > 0 ? (mediumIssues / totalIssues) * 100 : 0;
  const lowPercent = totalIssues > 0 ? (lowIssues / totalIssues) * 100 : 0;
  
  // Convert vulnerabilities to findings format for the table component
  const findings = vulnerabilities?.map(vuln => ({
    type: vuln.description,
    severity: vuln.severity as 'low' | 'medium' | 'high',
    file: vuln.file_path,
    line: vuln.line_number,
    snippet: vuln.code_snippet || ''
  })) || [];
  
  const handleExport = async () => {
    'use server';
    // This would be implemented in a real application
    console.log('Export functionality would be implemented here');
  };
  
  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Scan Results
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              Comprehensive security analysis and vulnerability assessment
            </p>
            {scan.projects && (
              <p className="text-gray-500 dark:text-gray-500 mt-1">
                Project: {scan.projects.name}
              </p>
            )}
          </div>
          <div className="flex space-x-3">
            <button
              onClick={handleExport}
              className="inline-flex items-center px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-medium rounded-lg shadow-lg shadow-cyan-500/30 hover:shadow-xl hover:shadow-cyan-500/40 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <Download className="mr-2 h-4 w-4" />
              Export ZIP
            </button>
            <Link href={`/patches?scanId=${scanId}`}>
              <button className="inline-flex items-center px-5 py-2.5 bg-white dark:bg-gray-800 border border-cyan-500/30 text-cyan-400 font-medium rounded-lg hover:bg-cyan-500/10 transition-all">
                <Wrench className="mr-2 h-4 w-4" />
                View Patches
              </button>
            </Link>
          </div>
        </div>
      </div>

      {findings && findings.length > 0 ? (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center">
                <div className="p-3 rounded-lg bg-red-100 dark:bg-red-900/20">
                  <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Critical Issues</p>
                  <p className="text-2xl font-semibold text-gray-900 dark:text-white">{criticalIssues}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center">
                <div className="p-3 rounded-lg bg-yellow-100 dark:bg-yellow-900/20">
                  <AlertTriangle className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Medium Issues</p>
                  <p className="text-2xl font-semibold text-gray-900 dark:text-white">{mediumIssues}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center">
                <div className="p-3 rounded-lg bg-blue-100 dark:bg-blue-900/20">
                  <AlertTriangle className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Low Issues</p>
                  <p className="text-2xl font-semibold text-gray-900 dark:text-white">{lowIssues}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center">
                <div className="p-3 rounded-lg bg-green-100 dark:bg-green-900/20">
                  <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Auto-Patches</p>
                  <p className="text-2xl font-semibold text-gray-900 dark:text-white">{totalPatches}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Severity Heatmap & Distribution */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Severity Distribution */}
            <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <TrendingUp className="mr-2 h-5 w-5 text-cyan-400" />
                Severity Distribution
              </h3>
              <div className="space-y-3">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Critical</span>
                    <span className="text-sm font-medium text-red-600 dark:text-red-400">{criticalIssues}</span>
                  </div>
                  <div className="relative h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="absolute inset-y-0 left-0 bg-gradient-to-r from-red-500 to-red-600 rounded-full"
                      style={{ width: `${criticalPercent}%` }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Medium</span>
                    <span className="text-sm font-medium text-yellow-600 dark:text-yellow-400">{mediumIssues}</span>
                  </div>
                  <div className="relative h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="absolute inset-y-0 left-0 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-full"
                      style={{ width: `${mediumPercent}%` }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Low</span>
                    <span className="text-sm font-medium text-blue-600 dark:text-blue-400">{lowIssues}</span>
                  </div>
                  <div className="relative h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="absolute inset-y-0 left-0 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full"
                      style={{ width: `${lowPercent}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Scan Details */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <FileCode className="mr-2 h-5 w-5 text-cyan-400" />
                Scan Details
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Scan ID</span>
                  <span className="text-sm font-mono text-gray-900 dark:text-white">{scan.id.substring(0, 8)}...</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Date</span>
                  <span className="text-sm text-gray-900 dark:text-white">
                    {new Date(scan.created_at).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Total Issues</span>
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">{totalIssues}</span>
                </div>
                <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                  <button className="w-full px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 text-sm font-medium">
                    View Timeline
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Vulnerabilities Table */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden border border-gray-200 dark:border-gray-700">
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Detected Vulnerabilities</h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Review and address the following security issues
              </p>
            </div>
            <div className="px-4 py-5 sm:p-6">
              <VulnerabilityTable findings={findings} patches={patches || []} />
            </div>
          </div>
        </>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-12 text-center border border-gray-200 dark:border-gray-700">
          <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
          <h3 className="mt-4 text-2xl font-bold text-gray-900 dark:text-white">No Vulnerabilities Found</h3>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Your codebase has passed all security checks. Great job!
          </p>
          <div className="mt-6">
            <Link href="/dashboard">
              <button className="px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 font-medium">
                Back to Dashboard
              </button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}