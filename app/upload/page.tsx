'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useScan } from '@/components/ScanContext';
import { useRouter } from 'next/navigation';
import { 
  Upload as UploadIcon, 
  Github, 
  FileText,
  Loader2,
  Shield,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Zap
} from 'lucide-react';
import { fadeIn, slideInUp, staggerContainer, staggerItem } from '@/lib/motion';

type ScanPhase = 'idle' | 'fetching' | 'analyzing' | 'patching' | 'reporting' | 'complete';

export default function UploadPage() {
  const router = useRouter();
  const { 
    appState, 
    setAppState, 
    setProjectId, 
    setScanResults, 
    setPatches,
    setErrorMessage,
    errorMessage
  } = useScan();
  
  const [file, setFile] = useState<File | null>(null);
  const [repoUrl, setRepoUrl] = useState('');
  const [uploadMethod, setUploadMethod] = useState<'zip' | 'github'>('zip');
  const [isDragging, setIsDragging] = useState(false);
  const [scanPhase, setScanPhase] = useState<ScanPhase>('idle');
  const [progress, setProgress] = useState(0);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.name.endsWith('.zip')) {
        setFile(droppedFile);
      }
    }
  };

  const simulateProgress = () => {
    const phases: ScanPhase[] = ['fetching', 'analyzing', 'patching', 'reporting', 'complete'];
    let currentPhaseIndex = 0;
    
    const interval = setInterval(() => {
      if (currentPhaseIndex < phases.length) {
        setScanPhase(phases[currentPhaseIndex]);
        setProgress((currentPhaseIndex + 1) * 25);
        currentPhaseIndex++;
      } else {
        clearInterval(interval);
        setTimeout(() => {
          router.push('/scan-results');
        }, 1000);
      }
    }, 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAppState('uploading');
    setErrorMessage(null);
    setProgress(0);

    try {
      if (uploadMethod === 'zip' && file) {
        const formData = new FormData();
        formData.append('file', file);

        const uploadResponse = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        const uploadData = await uploadResponse.json();
        if (!uploadResponse.ok || !uploadData.success) {
          throw new Error(uploadData.error || 'Upload failed');
        }

        setProjectId(uploadData.projectId);
        setAppState('scanning');
        setScanPhase('fetching');
        simulateProgress();

        // Trigger scan
        const scanResponse = await fetch('/api/scan', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ projectId: uploadData.projectId }),
        });

        const scanData = await scanResponse.json();
        if (!scanResponse.ok || !scanData.success) {
          throw new Error(scanData.error || 'Scan failed');
        }

        setScanResults(scanData.findings);
        setPatches(scanData.patches);
        setAppState('showing-results');
      } else if (uploadMethod === 'github' && repoUrl) {
        const response = await fetch('/api/upload', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ repoUrl }),
        });

        const data = await response.json();
        if (!response.ok || !data.success) {
          throw new Error(data.error || 'Repository clone failed');
        }

        setProjectId(data.projectId);
        setAppState('scanning');
        setScanPhase('fetching');
        simulateProgress();

        // Trigger scan
        const scanResponse = await fetch('/api/scan', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ projectId: data.projectId }),
        });

        const scanData = await scanResponse.json();
        if (!scanResponse.ok || !scanData.success) {
          throw new Error(scanData.error || 'Scan failed');
        }

        setScanResults(scanData.findings);
        setPatches(scanData.patches);
        setAppState('showing-results');
      }
    } catch (error) {
      console.error('Upload error:', error);
      setErrorMessage((error as Error).message);
      setAppState('error');
      setScanPhase('idle');
      setProgress(0);
    }
  };

  const phaseLabels: Record<ScanPhase, string> = {
    idle: 'Ready to Scan',
    fetching: 'Fetching Repository',
    analyzing: 'Analyzing Code',
    patching: 'Applying Patches',
    reporting: 'Generating Report',
    complete: 'Scan Complete'
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
      className="max-w-5xl mx-auto"
    >
      <motion.div variants={staggerItem} className="mb-8">
        <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
          Upload & Scan
        </h1>
        <p className="text-gray-400 text-lg">
          Secure your codebase with AI-powered vulnerability detection
        </p>
      </motion.div>

      <motion.div variants={staggerItem} className="glass-strong rounded-2xl border border-cyan-500/20 p-8">
        {/* Method Toggle */}
        <div className="flex space-x-3 mb-8 p-1 glass rounded-lg border border-cyan-500/10">
          <button
            type="button"
            onClick={() => setUploadMethod('zip')}
            className={`flex-1 px-6 py-3 rounded-lg text-sm font-medium transition-all ${
              uploadMethod === 'zip' 
                ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-400 border border-cyan-500/30 shadow-lg shadow-cyan-500/10' 
                : 'text-gray-400 hover:text-cyan-400'
            }`}
          >
            <UploadIcon className="inline-block mr-2 h-4 w-4" />
            Upload ZIP
          </button>
          <button
            type="button"
            onClick={() => setUploadMethod('github')}
            className={`flex-1 px-6 py-3 rounded-lg text-sm font-medium transition-all ${
              uploadMethod === 'github' 
                ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-400 border border-cyan-500/30 shadow-lg shadow-cyan-500/10' 
                : 'text-gray-400 hover:text-cyan-400'
            }`}
          >
            <Github className="inline-block mr-2 h-4 w-4" />
            GitHub Repo
          </button>
        </div>

        {/* Progress Indicator */}
        <AnimatePresence>
          {(appState === 'uploading' || appState === 'scanning') && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-8"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">{phaseLabels[scanPhase]}</span>
                  <span className="text-cyan-400 font-medium">{progress}%</span>
                </div>
                <div className="relative h-2 bg-gray-800 rounded-full overflow-hidden">
                  <motion.div
                    className="absolute inset-y-0 left-0 bg-gradient-to-r from-cyan-500 to-blue-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                  />
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                    animate={{ x: ['-100%', '200%'] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                  />
                </div>
                <div className="flex items-center space-x-2 text-xs text-gray-500">
                  <Loader2 className="h-3 w-3 animate-spin" />
                  <span>Scanning in progress...</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error Message */}
        <AnimatePresence>
          {appState === 'error' && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-6 rounded-lg bg-red-500/10 border border-red-500/30 p-4"
            >
              <div className="flex items-start space-x-3">
                <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-sm font-medium text-red-400 mb-1">Upload Error</h3>
                  <p className="text-sm text-red-300">{errorMessage}</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleSubmit}>
          {uploadMethod === 'zip' ? (
            <motion.div
              variants={fadeIn}
              className={`relative border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all duration-300 ${
                isDragging 
                  ? 'border-cyan-500 bg-cyan-500/10 scale-[1.02] shadow-2xl shadow-cyan-500/20' 
                  : 'border-cyan-500/30 hover:border-cyan-500/50 hover:bg-cyan-500/5'
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <motion.div
                animate={isDragging ? { scale: 1.1, rotate: 5 } : { scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className="flex flex-col items-center"
              >
                <div className="relative mb-6">
                  <div className="absolute inset-0 bg-cyan-500/20 blur-2xl rounded-full" />
                  <UploadIcon className="relative h-16 w-16 text-cyan-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-200 mb-2">
                  {isDragging ? 'Drop your file here' : 'Drag and drop your ZIP file'}
                </h3>
                <p className="text-gray-400 mb-6">
                  or click to browse files
                </p>
                <input
                  type="file"
                  accept=".zip"
                  onChange={handleFileChange}
                  className="hidden"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-medium rounded-lg shadow-lg shadow-cyan-500/30 hover:shadow-xl hover:shadow-cyan-500/40 transition-all cursor-pointer"
                >
                  <Shield className="mr-2 h-4 w-4" />
                  Select Secure File
                </label>
                {file && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-6 flex items-center justify-center space-x-2 text-sm text-cyan-400 bg-cyan-500/10 px-4 py-2 rounded-lg border border-cyan-500/20"
                  >
                    <FileText className="h-4 w-4" />
                    <span className="font-mono">{file.name}</span>
                    <CheckCircle2 className="h-4 w-4 text-green-400" />
                  </motion.div>
                )}
              </motion.div>
            </motion.div>
          ) : (
            <motion.div variants={fadeIn} className="space-y-6">
              <div>
                <label htmlFor="repo-url" className="block text-sm font-medium text-gray-300 mb-2">
                  GitHub Repository URL
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Github className="h-5 w-5 text-gray-500" />
                  </div>
                  <input
                    type="text"
                    id="repo-url"
                    value={repoUrl}
                    onChange={(e) => setRepoUrl(e.target.value)}
                    placeholder="https://github.com/user/repo"
                    className="block w-full pl-12 pr-4 py-3 bg-gray-900/50 border border-cyan-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 text-gray-200 placeholder-gray-500 transition-all"
                    required
                  />
                  {repoUrl && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute right-3 top-1/2 -translate-y-1/2"
                    >
                      <div className="h-2 w-2 bg-green-400 rounded-full glow-green" />
                    </motion.div>
                  )}
                </div>
              </div>
              <div className="glass rounded-lg border border-blue-500/20 p-4">
                <div className="flex items-start space-x-3">
                  <AlertCircle className="h-5 w-5 text-blue-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-sm font-medium text-blue-400 mb-1">
                      Public Repositories Only
                    </h3>
                    <p className="text-sm text-gray-400">
                      For private repositories, configure your personal access token in settings.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          <motion.div
            variants={slideInUp}
            className="mt-8"
          >
            <button
              type="submit"
              disabled={appState === 'uploading' || appState === 'scanning' || (uploadMethod === 'zip' && !file) || (uploadMethod === 'github' && !repoUrl)}
              className="w-full flex items-center justify-center py-4 px-6 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-lg shadow-lg shadow-cyan-500/30 hover:shadow-xl hover:shadow-cyan-500/40 disabled:opacity-50 disabled:cursor-not-allowed transition-all group"
            >
              {appState === 'uploading' || appState === 'scanning' ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  {appState === 'uploading' ? 'Uploading...' : 'Scanning...'}
                </>
              ) : (
                <>
                  <Zap className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                  Run Security Scan
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </motion.div>
        </form>
      </motion.div>
    </motion.div>
  );
}
