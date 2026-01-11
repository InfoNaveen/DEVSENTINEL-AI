'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
// Context is optional now, but we keep it if needed for other global state.
// We primarily use props for data display.
import { useScan } from '@/components/ScanContext';
import { VulnerabilityCard } from '@/components/VulnerabilityCard';
import { VulnerabilityTable } from '@/components/VulnerabilityTable';
import RedTeamTerminal from '@/components/RedTeamTerminal';
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
import { staggerContainer, staggerItem, fadeIn } from '@/lib/motion';

interface ScanResultsClientProps {
  initialScanResults: any[];
  initialPatches: any[];
  projectId: string;
}

export default function ScanResultsClient({ initialScanResults, initialPatches, projectId }: ScanResultsClientProps) {
  // Use props as initial source of truth, fall back to context if needed or keeping sync
  const { scanResults: contextScans } = useScan();

  // Prefer props data if available (Server Side Fetched), otherwise context
  const scanResults = initialScanResults.length > 0 ? initialScanResults : contextScans;
  const patches = initialPatches;

  const [animatedCounts, setAnimatedCounts] = useState({
    critical: 0,
    medium: 0,
    low: 0,
    patches: 0
  });

  // Calculate statistics
  const criticalIssues = scanResults.filter(f => f.severity === 'high').length;
  const mediumIssues = scanResults.filter(f => f.severity === 'medium').length;
  const lowIssues = scanResults.filter(f => f.severity === 'low').length;
  const totalPatches = patches.length;

  // Animate counters
  useEffect(() => {
    const duration = 1000;
    const steps = 30;
    const interval = duration / steps;

    const animateValue = (start: number, end: number, callback: (val: number) => void) => {
      let current = start;
      const increment = (end - start) / steps;
      const timer = setInterval(() => {
        current += increment;
        if ((increment > 0 && current >= end) || (increment < 0 && current <= end)) {
          current = end;
          clearInterval(timer);
        }
        callback(Math.floor(current));
      }, interval);
    };

    animateValue(0, criticalIssues, (val) => setAnimatedCounts(prev => ({ ...prev, critical: val })));
    animateValue(0, mediumIssues, (val) => setAnimatedCounts(prev => ({ ...prev, medium: val })));
    animateValue(0, lowIssues, (val) => setAnimatedCounts(prev => ({ ...prev, low: val })));
    animateValue(0, totalPatches, (val) => setAnimatedCounts(prev => ({ ...prev, patches: val })));
  }, [criticalIssues, mediumIssues, lowIssues, totalPatches]);

  // Calculate threat distribution for donut chart
  const totalIssues = criticalIssues + mediumIssues + lowIssues;
  const criticalPercent = totalIssues > 0 ? (criticalIssues / totalIssues) * 100 : 0;
  const mediumPercent = totalIssues > 0 ? (mediumIssues / totalIssues) * 100 : 0;
  const lowPercent = totalIssues > 0 ? (lowIssues / totalIssues) * 100 : 0;

  const handleExport = async () => {
    if (!projectId) return;

    try {
      const response = await fetch('/api/patch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ projectId, export: true }),
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'patched-code.zip';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        const error = await response.json();
        alert(`Export failed: ${error.error}`);
      }
    } catch (error) {
      console.error('Export error:', error);
      alert('Export failed. Please try again.');
    }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
      className="max-w-7xl mx-auto"
    >
      {/* Header */}
      <motion.div variants={staggerItem} className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Scan Results
            </h1>
            <p className="text-gray-400 text-lg">
              Comprehensive security analysis and vulnerability assessment
            </p>
          </div>
          <div className="flex space-x-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleExport}
              disabled={!projectId}
              className="inline-flex items-center px-5 py-2.5 bg-brand-primary text-white font-medium rounded-lg shadow-lg shadow-brand-primary/30 hover:bg-brand-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <Download className="mr-2 h-4 w-4" />
              Export ZIP
            </motion.button>
            <Link href={`/patches?scanId=${projectId}`}>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center px-5 py-2.5 mica-strong border border-gray-600/30 text-white font-medium rounded-lg hover:bg-gray-700/50 transition-all"
              >
                <Wrench className="mr-2 h-4 w-4" />
                View Patches
              </motion.button>
            </Link>
          </div>
        </div>
      </motion.div>

      {scanResults.length > 0 ? (
        <>
          {/* Summary Cards */}
          <motion.div variants={staggerItem} className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
            <VulnerabilityCard
              title="Critical Issues"
              count={animatedCounts.critical}
              severity="high"
              icon={<AlertTriangle className="h-6 w-6" />}
              index={0}
            />
            <VulnerabilityCard
              title="Medium Issues"
              count={animatedCounts.medium}
              severity="medium"
              icon={<AlertTriangle className="h-6 w-6" />}
              index={1}
            />
            <VulnerabilityCard
              title="Low Issues"
              count={animatedCounts.low}
              severity="low"
              icon={<AlertTriangle className="h-6 w-6" />}
              index={2}
            />
            <VulnerabilityCard
              title="Auto-Patches"
              count={animatedCounts.patches}
              severity="patch"
              icon={<CheckCircle className="h-6 w-6" />}
              index={3}
            />
          </motion.div>

          {/* Severity Heatmap & Distribution */}
          <motion.div variants={staggerItem} className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Severity Heatmap */}
            <div className="lg:col-span-2 mica-strong rounded-xl border border-gray-600/30 p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <TrendingUp className="mr-2 h-5 w-5 text-brand-secondary" />
                Severity Distribution
              </h3>
              <div className="space-y-3">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-400">Critical</span>
                    <span className="text-sm font-medium text-red-400">{criticalIssues}</span>
                  </div>
                  <div className="relative h-3 bg-gray-800 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${criticalPercent}%` }}
                      transition={{ duration: 1, delay: 0.2 }}
                      className="absolute inset-y-0 left-0 bg-gradient-to-r from-red-500 to-red-600 rounded-full glow-red"
                    />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-400">Medium</span>
                    <span className="text-sm font-medium text-yellow-400">{mediumIssues}</span>
                  </div>
                  <div className="relative h-3 bg-gray-800 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${mediumPercent}%` }}
                      transition={{ duration: 1, delay: 0.4 }}
                      className="absolute inset-y-0 left-0 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-full glow-yellow"
                    />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-400">Low</span>
                    <span className="text-sm font-medium text-green-400">{lowIssues}</span>
                  </div>
                  <div className="relative h-3 bg-gray-800 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${lowPercent}%` }}
                      transition={{ duration: 1, delay: 0.6 }}
                      className="absolute inset-y-0 left-0 bg-gradient-to-r from-green-500 to-green-600 rounded-full glow-green"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Donut Chart */}
            <div className="mica-strong rounded-xl border border-gray-600/30 p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <Shield className="mr-2 h-5 w-5 text-brand-secondary" />
                Threat Distribution
              </h3>
              <div className="relative w-full aspect-square flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="#1e293b"
                    strokeWidth="8"
                  />
                  {totalIssues > 0 && (
                    <>
                      <motion.circle
                        cx="50"
                        cy="50"
                        r="40"
                        fill="none"
                        stroke="#ef4444"
                        strokeWidth="8"
                        strokeDasharray={`${2 * Math.PI * 40}`}
                        strokeDashoffset={`${2 * Math.PI * 40 * (1 - criticalPercent / 100)}`}
                        strokeLinecap="round"
                        initial={{ strokeDashoffset: 2 * Math.PI * 40 }}
                        animate={{ strokeDashoffset: 2 * Math.PI * 40 * (1 - criticalPercent / 100) }}
                        transition={{ duration: 1, delay: 0.2 }}
                      />
                      <motion.circle
                        cx="50"
                        cy="50"
                        r="40"
                        fill="none"
                        stroke="#eab308"
                        strokeWidth="8"
                        strokeDasharray={`${2 * Math.PI * 40}`}
                        strokeDashoffset={`${2 * Math.PI * 40 * (1 - (criticalPercent + mediumPercent) / 100)}`}
                        strokeLinecap="round"
                        initial={{ strokeDashoffset: 2 * Math.PI * 40 }}
                        animate={{ strokeDashoffset: 2 * Math.PI * 40 * (1 - (criticalPercent + mediumPercent) / 100) }}
                        transition={{ duration: 1, delay: 0.4 }}
                      />
                      <motion.circle
                        cx="50"
                        cy="50"
                        r="40"
                        fill="none"
                        stroke="#22c55e"
                        strokeWidth="8"
                        strokeDasharray={`${2 * Math.PI * 40}`}
                        strokeDashoffset={`${2 * Math.PI * 40 * (1 - (criticalPercent + mediumPercent + lowPercent) / 100)}`}
                        strokeLinecap="round"
                        initial={{ strokeDashoffset: 2 * Math.PI * 40 }}
                        animate={{ strokeDashoffset: 2 * Math.PI * 40 * (1 - (criticalPercent + mediumPercent + lowPercent) / 100) }}
                        transition={{ duration: 1, delay: 0.6 }}
                      />
                    </>
                  )}
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="text-3xl font-bold text-gray-200">{totalIssues}</div>
                  <div className="text-sm text-gray-400">Total Issues</div>
                </div>
              </div>
              <div className="mt-4 space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <span className="text-gray-400">Critical</span>
                  </div>
                  <span className="text-gray-300 font-medium">{criticalIssues}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                    <span className="text-gray-400">Medium</span>
                  </div>
                  <span className="text-gray-300 font-medium">{mediumIssues}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                    <span className="text-gray-400">Low</span>
                  </div>
                  <span className="text-gray-300 font-medium">{lowIssues}</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Vulnerability Table */}
          <motion.div variants={staggerItem} className="mica-strong rounded-xl border border-gray-600/30 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-600/30 bg-gray-800/30">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-white flex items-center">
                    <FileCode className="mr-2 h-5 w-5 text-brand-secondary" />
                    Detected Vulnerabilities
                  </h3>
                  <p className="mt-1 text-sm text-gray-400">
                    {scanResults.length} issues found across your codebase
                  </p>
                </div>
              </div>
            </div>
            <div className="p-6">
              <VulnerabilityTable findings={scanResults} patches={patches} />
            </div>
          </motion.div>

          {/* Red Team Terminal */}
          <motion.div variants={staggerItem} className="mt-8">
            <RedTeamTerminal />
          </motion.div>
        </>
      ) : (
        <motion.div
          variants={fadeIn}
          className="mica-strong rounded-xl border border-gray-600/30 overflow-hidden text-center py-16"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            className="mx-auto w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mb-4"
          >
            <CheckCircle className="h-8 w-8 text-green-400" />
          </motion.div>
          <h3 className="text-xl font-semibold text-gray-200 mb-2">No vulnerabilities found</h3>
          <p className="text-gray-400 mb-6">
            Your codebase passed all security checks.
          </p>
          <Link href="/upload">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center px-6 py-3 bg-brand-primary text-white font-medium rounded-lg shadow-lg shadow-brand-primary/30 hover:bg-brand-primary/80 transition-all"
            >
              Scan Another Repository
            </motion.button>
          </Link>
        </motion.div>
      )}
    </motion.div>
  );
}
