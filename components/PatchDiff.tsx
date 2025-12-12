'use client';

import { motion } from 'framer-motion';
import { CheckCircle2, XCircle, Code } from 'lucide-react';
import { fadeIn } from '@/lib/motion';

interface PatchDiffProps {
  before: string;
  after: string;
  file?: string;
}

export function PatchDiff({ before, after, file }: PatchDiffProps) {
  const beforeLines = before.split('\n');
  const afterLines = after.split('\n');
  const maxLines = Math.max(beforeLines.length, afterLines.length);
  
  // Simple diff algorithm - highlight changed lines
  const getLineType = (beforeLine: string | undefined, afterLine: string | undefined, index: number) => {
    if (!beforeLine && afterLine) return 'added';
    if (beforeLine && !afterLine) return 'removed';
    if (beforeLine !== afterLine) return 'modified';
    return 'neutral';
  };

  return (
    <motion.div
      variants={fadeIn}
      className="border border-cyan-500/20 rounded-xl overflow-hidden bg-gray-900/50"
    >
      {file && (
        <div className="px-4 py-3 bg-gray-800/50 border-b border-cyan-500/20 flex items-center space-x-2">
          <Code className="h-4 w-4 text-cyan-400" />
          <span className="text-sm font-mono text-gray-300">{file}</span>
        </div>
      )}
      
      <div className="grid grid-cols-2 divide-x divide-cyan-500/20">
        {/* Before Section */}
        <div className="bg-red-500/5 border-r border-red-500/20">
          <div className="px-4 py-3 bg-red-500/10 border-b border-red-500/20 flex items-center space-x-2">
            <XCircle className="h-4 w-4 text-red-400" />
            <h4 className="text-sm font-semibold text-red-400">Before (Vulnerable)</h4>
          </div>
          <div className="p-4 max-h-96 overflow-y-auto">
            <pre className="text-xs font-mono">
              <code>
                {beforeLines.map((line, index) => {
                  const lineType = getLineType(line, afterLines[index], index);
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.02 }}
                      className={`flex items-start ${
                        lineType === 'removed' || lineType === 'modified'
                          ? 'bg-red-500/10 border-l-2 border-red-500 pl-2'
                          : ''
                      }`}
                    >
                      <span className="inline-block w-8 text-right mr-3 text-gray-500 select-none flex-shrink-0">
                        {index + 1}
                      </span>
                      <span className={`flex-1 ${
                        lineType === 'removed' || lineType === 'modified'
                          ? 'text-red-300'
                          : 'text-gray-400'
                      }`}>
                        {line || '\u00A0'}
                      </span>
                    </motion.div>
                  );
                })}
              </code>
            </pre>
          </div>
        </div>
        
        {/* After Section */}
        <div className="bg-green-500/5">
          <div className="px-4 py-3 bg-green-500/10 border-b border-green-500/20 flex items-center space-x-2">
            <CheckCircle2 className="h-4 w-4 text-green-400" />
            <h4 className="text-sm font-semibold text-green-400">After (Patched)</h4>
          </div>
          <div className="p-4 max-h-96 overflow-y-auto">
            <pre className="text-xs font-mono">
              <code>
                {afterLines.map((line, index) => {
                  const lineType = getLineType(beforeLines[index], line, index);
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.02 }}
                      className={`flex items-start ${
                        lineType === 'added' || lineType === 'modified'
                          ? 'bg-green-500/10 border-l-2 border-green-500 pl-2'
                          : ''
                      }`}
                    >
                      <span className="inline-block w-8 text-right mr-3 text-gray-500 select-none flex-shrink-0">
                        {index + 1}
                      </span>
                      <span className={`flex-1 ${
                        lineType === 'added' || lineType === 'modified'
                          ? 'text-green-300'
                          : 'text-gray-400'
                      }`}>
                        {line || '\u00A0'}
                      </span>
                    </motion.div>
                  );
                })}
              </code>
            </pre>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
