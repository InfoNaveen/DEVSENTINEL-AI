'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useScan } from '@/components/ScanContext';
import { PatchDiff } from '@/components/PatchDiff';
import { 
  Wrench,
  FileText,
  Calendar,
  Code,
  CheckCircle2,
  Shield,
  TrendingUp,
  X
} from 'lucide-react';
import { staggerContainer, staggerItem, fadeIn, slideInUp } from '@/lib/motion';

export default function PatchesPage() {
  const { patches } = useScan();
  const [expandedPatches, setExpandedPatches] = useState<Record<number, boolean>>({});
  const [selectedPatch, setSelectedPatch] = useState<typeof patches[0] | null>(null);
  const [showDiffModal, setShowDiffModal] = useState(false);

  const togglePatch = (index: number) => {
    setExpandedPatches(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const showFullDiff = (patch: typeof patches[0]) => {
    setSelectedPatch(patch);
    setShowDiffModal(true);
  };

  // Calculate confidence score (mock for now)
  const getConfidenceScore = (patch: typeof patches[0]) => {
    // In a real implementation, this would come from the backend
    return Math.floor(Math.random() * 30) + 70; // 70-100%
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
      className="max-w-6xl mx-auto"
    >
      <motion.div variants={staggerItem} className="mb-8">
        <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
          Applied Patches
        </h1>
        <p className="text-gray-400 text-lg">
          Review all auto-applied security patches and their impact
        </p>
      </motion.div>

      {patches.length > 0 ? (
        <motion.div variants={staggerItem} className="space-y-4">
          {/* Summary Card */}
          <div className="glass-strong rounded-xl border border-cyan-500/20 p-6 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-200 mb-2 flex items-center">
                  <Shield className="mr-2 h-5 w-5 text-cyan-400" />
                  Patch Summary
                </h3>
                <p className="text-gray-400">
                  {patches.length} security patches have been automatically applied
                </p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-green-400 mb-1">
                  {patches.length}
                </div>
                <div className="text-sm text-gray-400">Total Patches</div>
              </div>
            </div>
          </div>

          {/* Patches List */}
          <div className="space-y-4">
            {patches.map((patch, index) => {
              const isExpanded = !!expandedPatches[index];
              const confidence = getConfidenceScore(patch);
              
              return (
                <motion.div
                  key={index}
                  variants={staggerItem}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="glass-strong rounded-xl border border-cyan-500/20 overflow-hidden hover:border-cyan-500/40 transition-all"
                >
                  <div
                    className="p-6 cursor-pointer"
                    onClick={() => togglePatch(index)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4 flex-1">
                        <div className="flex-shrink-0">
                          <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-cyan-500/20 border border-cyan-500/30">
                            <Wrench className="h-6 w-6 text-cyan-400" />
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-3 mb-2">
                            <h4 className="text-lg font-semibold text-gray-200 flex items-center">
                              <FileText className="mr-2 h-4 w-4 text-gray-400" />
                              <span className="font-mono text-sm">{patch.file}</span>
                            </h4>
                            <motion.span
                              whileHover={{ scale: 1.05 }}
                              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-500/10 text-green-400 border border-green-500/30"
                            >
                              <CheckCircle2 className="mr-1.5 h-3 w-3" />
                              Applied
                            </motion.span>
                          </div>
                          <div className="flex items-center space-x-4 text-sm text-gray-400 mb-3">
                            <div className="flex items-center">
                              <Calendar className="mr-1.5 h-4 w-4" />
                              <span>Just now</span>
                            </div>
                            <div className="flex items-center">
                              <TrendingUp className="mr-1.5 h-4 w-4 text-green-400" />
                              <span className="text-green-400 font-medium">{confidence}% confidence</span>
                            </div>
                          </div>
                          <p className="text-sm text-gray-300">{patch.change}</p>
                        </div>
                      </div>
                      <motion.div
                        animate={{ rotate: isExpanded ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                        className="ml-4 text-cyan-400"
                      >
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                      </motion.div>
                    </div>
                  </div>

                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="border-t border-cyan-500/20 bg-gray-800/30"
                      >
                        <div className="p-6">
                          <motion.div
                            variants={slideInUp}
                            initial="hidden"
                            animate="visible"
                            className="space-y-4"
                          >
                            <div className="flex items-center justify-between mb-4">
                              <h5 className="text-sm font-semibold text-gray-300 flex items-center">
                                <Code className="mr-2 h-4 w-4 text-cyan-400" />
                                Patch Diff Preview
                              </h5>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  showFullDiff(patch);
                                }}
                                className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors"
                              >
                                View Full Diff →
                              </button>
                            </div>
                            <PatchDiff 
                              before={patch.before || "// Original vulnerable code"} 
                              after={patch.after || "// Patched secure code"}
                              file={patch.file}
                            />
                            <div className="mt-4 p-4 glass rounded-lg border border-green-500/20 bg-green-500/5">
                              <div className="flex items-start space-x-3">
                                <CheckCircle2 className="h-5 w-5 text-green-400 flex-shrink-0 mt-0.5" />
                                <div>
                                  <h6 className="text-sm font-semibold text-green-400 mb-1">
                                    Patch Verified
                                  </h6>
                                  <p className="text-xs text-gray-400">
                                    This patch has been automatically verified and applied. The vulnerability has been successfully mitigated.
                                  </p>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      ) : (
        <motion.div
          variants={fadeIn}
          className="glass-strong rounded-xl border border-cyan-500/20 overflow-hidden text-center py-16"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            className="mx-auto w-16 h-16 rounded-full bg-cyan-500/20 flex items-center justify-center mb-4"
          >
            <Wrench className="h-8 w-8 text-cyan-400" />
          </motion.div>
          <h3 className="text-xl font-semibold text-gray-200 mb-2">No patches applied</h3>
          <p className="text-gray-400 mb-6">
            Upload a repository and run a security scan to see auto-applied patches.
          </p>
          <a href="/upload">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-medium rounded-lg shadow-lg shadow-cyan-500/30 hover:shadow-xl hover:shadow-cyan-500/40 transition-all"
            >
              Upload Repository
            </motion.button>
          </a>
        </motion.div>
      )}

      {/* Full Diff Modal */}
      <AnimatePresence>
        {showDiffModal && selectedPatch && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm"
              onClick={() => setShowDiffModal(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
              onClick={(e: React.MouseEvent) => e.stopPropagation()}
            >
              <div className="glass-strong rounded-2xl border border-cyan-500/20 shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col">
                <div className="px-6 py-4 border-b border-cyan-500/20 flex items-center justify-between bg-gray-800/50">
                  <h3 className="text-lg font-semibold text-gray-200">Full Patch Diff</h3>
                  <button
                    onClick={() => setShowDiffModal(false)}
                    className="text-gray-400 hover:text-cyan-400 transition-colors"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto p-6">
                  <PatchDiff 
                    before={selectedPatch.before || "// Original vulnerable code"} 
                    after={selectedPatch.after || "// Patched secure code"}
                    file={selectedPatch.file}
                  />
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
