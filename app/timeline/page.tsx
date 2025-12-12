'use client';

import { motion } from 'framer-motion';
import { Timeline } from '@/components/Timeline';
import { 
  Clock,
  ShieldAlert,
  TrendingDown,
  TrendingUp,
  Activity
} from 'lucide-react';
import { staggerContainer, staggerItem, fadeIn } from '@/lib/motion';

// Mock data for timeline
const timelineEvents = [
  {
    id: 1,
    date: '2024-01-15T10:30:00Z',
    title: 'Security Scan Completed',
    description: 'Scanned repository github.com/example/project',
    status: 'completed' as const,
    severity: 'high' as const,
    findings: 12,
    patches: 8
  },
  {
    id: 2,
    date: '2024-01-14T14:45:00Z',
    title: 'Auto-Patch Applied',
    description: 'Applied patches to fix XSS vulnerabilities',
    status: 'patched' as const,
    severity: 'medium' as const,
    findings: 0,
    patches: 3
  },
  {
    id: 3,
    date: '2024-01-12T09:15:00Z',
    title: 'Security Scan Completed',
    description: 'Scanned repository github.com/example/another-project',
    status: 'completed' as const,
    severity: 'clean' as const,
    findings: 0,
    patches: 0
  },
  {
    id: 4,
    date: '2024-01-10T16:20:00Z',
    title: 'Vulnerabilities Detected',
    description: 'Found critical SQL injection vulnerabilities',
    status: 'vulnerable' as const,
    severity: 'high' as const,
    findings: 5,
    patches: 0
  }
];

export default function TimelinePage() {
  // Calculate threat spike data
  const threatData = timelineEvents.map(event => ({
    date: new Date(event.date),
    threats: event.findings,
    patches: event.patches
  }));

  const totalThreats = timelineEvents.reduce((sum, event) => sum + event.findings, 0);
  const totalPatches = timelineEvents.reduce((sum, event) => sum + event.patches, 0);
  const improvementRate = totalThreats > 0 ? ((totalPatches / totalThreats) * 100).toFixed(1) : '100';

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
      className="max-w-6xl mx-auto"
    >
      <motion.div variants={staggerItem} className="mb-8">
        <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
          Security Timeline
        </h1>
        <p className="text-gray-400 text-lg">
          Track security scans, threats, and patch history
        </p>
      </motion.div>

      {/* Stats Cards */}
      <motion.div variants={staggerItem} className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="glass-strong rounded-xl border border-cyan-500/20 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">Total Threats</span>
            <ShieldAlert className="h-5 w-5 text-red-400" />
          </div>
          <div className="text-3xl font-bold text-red-400">{totalThreats}</div>
        </div>
        <div className="glass-strong rounded-xl border border-cyan-500/20 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">Patches Applied</span>
            <Activity className="h-5 w-5 text-green-400" />
          </div>
          <div className="text-3xl font-bold text-green-400">{totalPatches}</div>
        </div>
        <div className="glass-strong rounded-xl border border-cyan-500/20 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">Improvement Rate</span>
            <TrendingUp className="h-5 w-5 text-cyan-400" />
          </div>
          <div className="text-3xl font-bold text-cyan-400">{improvementRate}%</div>
        </div>
      </motion.div>

      {/* Threat Spike Visualization */}
      <motion.div variants={staggerItem} className="glass-strong rounded-xl border border-cyan-500/20 p-6 mb-8">
        <h3 className="text-lg font-semibold text-gray-200 mb-4 flex items-center">
          <TrendingDown className="mr-2 h-5 w-5 text-cyan-400" />
          Threat Trend Analysis
        </h3>
        <div className="h-48 flex items-end justify-between space-x-2">
          {threatData.map((data, index) => {
            const maxThreats = Math.max(...threatData.map(d => d.threats), 1);
            const height = (data.threats / maxThreats) * 100;
            
            return (
              <motion.div
                key={index}
                initial={{ height: 0 }}
                animate={{ height: `${height}%` }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="flex-1 flex flex-col items-center"
              >
                <motion.div
                  className={`w-full rounded-t-lg ${
                    data.threats > 0 
                      ? 'bg-gradient-to-t from-red-500 to-red-600 glow-red' 
                      : 'bg-gradient-to-t from-green-500 to-green-600 glow-green'
                  }`}
                  whileHover={{ scale: 1.05 }}
                />
                <div className="mt-2 text-xs text-gray-500 text-center">
                  {data.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </div>
                <div className="mt-1 text-xs font-semibold text-gray-400">
                  {data.threats}
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Timeline */}
      <motion.div variants={staggerItem} className="glass-strong rounded-xl border border-cyan-500/20 overflow-hidden">
        <div className="px-6 py-4 border-b border-cyan-500/20 bg-gray-800/50">
          <h3 className="text-lg font-semibold text-gray-200 flex items-center">
            <Clock className="mr-2 h-5 w-5 text-cyan-400" />
            Scan History
          </h3>
          <p className="mt-1 text-sm text-gray-400">
            Timeline of all security scans and patches
          </p>
        </div>
        <div className="p-6">
          <Timeline events={timelineEvents} />
        </div>
      </motion.div>
    </motion.div>
  );
}
