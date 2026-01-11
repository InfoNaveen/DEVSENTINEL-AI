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
import ScanResultsClient from './ScanResultsClient';

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
    id: vuln.id,
    type: vuln.description,
    severity: vuln.severity as 'low' | 'medium' | 'high',
    file: vuln.file_path,
    line: vuln.line_number,
    snippet: vuln.code_snippet || '',
    description: vuln.description
  })) || [];

  return (
    <ScanResultsClient
      initialScanResults={findings}
      initialPatches={patches || []}
      projectId={scan.project_id}
    />
  );
}