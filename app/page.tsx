'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { 
  Shield, 
  Zap, 
  Lock, 
  TrendingUp,
  ArrowRight,
  CheckCircle2
} from 'lucide-react';
import { staggerContainer, staggerItem, fadeIn } from '@/lib/motion';

export default function HomePage() {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
      className="max-w-7xl mx-auto"
    >
      <motion.div variants={staggerItem} className="text-center mb-16">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          className="inline-flex items-center justify-center mb-6"
        >
          <div className="relative">
            <div className="absolute inset-0 bg-cyan-500/20 blur-2xl rounded-full" />
            <Shield className="relative h-16 w-16 text-cyan-400" />
          </div>
        </motion.div>
        <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-cyan-400 via-blue-500 to-cyan-400 bg-clip-text text-transparent animate-pulse">
          DevSentinel <span className="text-cyan-400">AI</span>
        </h1>
        <p className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto mb-10">
          Autonomous security scanning and auto-patching platform for modern development teams
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link href="/upload">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-lg shadow-lg shadow-cyan-500/30 hover:shadow-xl hover:shadow-cyan-500/40 transition-all flex items-center"
            >
              Get Started
              <ArrowRight className="ml-2 h-5 w-5" />
            </motion.button>
          </Link>
          <Link href="/scan-results">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 glass-strong border border-cyan-500/30 text-cyan-400 font-semibold rounded-lg hover:bg-cyan-500/10 transition-all"
            >
              View Demo
            </motion.button>
          </Link>
        </div>
      </motion.div>

      <motion.div variants={staggerItem} className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-20">
        <motion.div
          whileHover={{ y: -5, scale: 1.02 }}
          className="glass-strong rounded-xl border border-cyan-500/20 p-8 hover:border-cyan-500/40 transition-all"
        >
          <div className="w-14 h-14 rounded-xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center mb-6">
            <Shield className="h-7 w-7 text-cyan-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-200 mb-3">Automated Scanning</h3>
          <p className="text-gray-400 leading-relaxed">
            Upload your codebase and let DevSentinel AI automatically detect security vulnerabilities with advanced pattern recognition.
          </p>
        </motion.div>

        <motion.div
          whileHover={{ y: -5, scale: 1.02 }}
          className="glass-strong rounded-xl border border-cyan-500/20 p-8 hover:border-cyan-500/40 transition-all"
        >
          <div className="w-14 h-14 rounded-xl bg-green-500/20 border border-green-500/30 flex items-center justify-center mb-6">
            <Zap className="h-7 w-7 text-green-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-200 mb-3">Smart Auto-Patching</h3>
          <p className="text-gray-400 leading-relaxed">
            Automatically apply security patches with our intelligent patching engine that understands code context.
          </p>
        </motion.div>

        <motion.div
          whileHover={{ y: -5, scale: 1.02 }}
          className="glass-strong rounded-xl border border-cyan-500/20 p-8 hover:border-cyan-500/40 transition-all"
        >
          <div className="w-14 h-14 rounded-xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center mb-6">
            <TrendingUp className="h-7 w-7 text-blue-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-200 mb-3">Lightning Fast</h3>
          <p className="text-gray-400 leading-relaxed">
            Scan and patch your entire codebase in seconds, not hours. Built for speed and scale.
          </p>
        </motion.div>
      </motion.div>

      <motion.div variants={staggerItem} className="mt-20 text-center">
        <h2 className="text-3xl font-bold text-gray-200 mb-6">Ready to secure your code?</h2>
        <Link href="/upload">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-lg shadow-lg shadow-cyan-500/30 hover:shadow-xl hover:shadow-cyan-500/40 transition-all"
          >
            <Lock className="mr-2 h-5 w-5" />
            Start Scanning Now
          </motion.button>
        </Link>
      </motion.div>
    </motion.div>
  );
}
