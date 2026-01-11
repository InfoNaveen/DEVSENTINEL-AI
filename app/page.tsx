'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  Shield,
  Lock,
  Globe,
  Settings,
  Database,
  CheckCircle2,
  ArrowRight,
  Landmark,
  FileCheck,
  TrendingDown,
  Building2
} from 'lucide-react';
import { staggerContainer, staggerItem, fadeIn } from '@/lib/motion';

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Navigation Bar Placeholder */}
      <nav className="absolute top-0 w-full px-8 py-6 flex justify-between items-center z-50">
        <div className="text-xl font-bold tracking-wider text-white flex items-center">
          <Shield className="mr-2 h-6 w-6 text-brand-primary" />
          DEVSENTINEL
        </div>
        <div className="hidden md:flex space-x-8 text-sm font-medium text-gray-300">
          <a href="#" className="hover:text-brand-secondary transition-colors">SOLUTIONS</a>
          <a href="#" className="hover:text-brand-secondary transition-colors">COMPLIANCE</a>
          <a href="#" className="hover:text-brand-secondary transition-colors">FINANCIAL API</a>
          <a href="#" className="hover:text-brand-secondary transition-colors">ENTERPRISE</a>
        </div>
        <div className="flex items-center space-x-4">
          <button className="text-sm font-medium text-white hover:text-brand-secondary">INSTITUTIONAL LOGIN</button>
          <Link href="/upload">
            <button className="bg-white text-black px-5 py-2 rounded-full text-sm font-bold hover:bg-gray-200 transition-colors">
              REQUEST AUDIT
            </button>
          </Link>
        </div>
      </nav>

      <motion.main
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
        className="pt-32 pb-16 px-6 max-w-7xl mx-auto"
      >
        {/* Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-32">
          {/* Left Column: Text */}
          <motion.div variants={staggerItem} className="text-left z-10">
            <div className="flex items-center space-x-2 mb-6">
              <div className="h-0.5 w-8 bg-brand-secondary"></div>
              <span className="text-brand-secondary text-sm font-bold tracking-widest uppercase">Financial Infrastructure Protection</span>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-6 text-white">
              ENSURING TRUST IN<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">DIGITAL FINANCE</span>
            </h1>

            <p className="text-gray-400 text-lg mb-10 max-w-xl leading-relaxed">
              DevSentinel provides the autonomous risk-prevention layer for fintech systems. We secure payment gateways, protect transaction APIs, and ensure regulatory compliance before code ever reaches production.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/upload">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-gradient-to-r from-brand-secondary to-blue-500 rounded-full text-white font-bold shadow-[0_0_20px_rgba(0,194,255,0.3)] hover:shadow-[0_0_30px_rgba(0,194,255,0.5)] transition-all flex items-center justify-center"
                >
                  SECURE YOUR PLATFORM
                </motion.button>
              </Link>
              <Link href="/demo">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 glass-panel rounded-full text-white font-bold border border-white/10 hover:bg-white/5 transition-all flex items-center justify-center"
                >
                  VIEW RISK REPORT
                </motion.button>
              </Link>
            </div>
          </motion.div>

          {/* Right Column: 3D/Glass Visuals */}
          <motion.div variants={fadeIn} className="relative h-[500px] w-full perspective-1000">
            <div className="absolute inset-0 bg-brand-primary/20 blur-[100px] rounded-full opacity-50"></div>

            {/* Main Floating Platform */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute top-1/4 left-1/4 right-0 bottom-0"
            >
              {/* Central Shield Card */}
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-80 glass-panel rounded-2xl flex flex-col items-center justify-center p-6 border-brand-secondary/30 z-20">
                <div className="w-16 h-16 bg-gradient-to-br from-brand-secondary to-brand-primary rounded-xl flex items-center justify-center mb-6 shadow-lg shadow-brand-secondary/20">
                  <Landmark className="text-white h-8 w-8" />
                </div>
                <div className="w-full space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-400 uppercase tracking-wider">Transaction Security</span>
                    <CheckCircle2 className="h-4 w-4 text-green-400" />
                  </div>
                  <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full w-full bg-green-500 shadow-[0_0_10px_#22c55e]"></div>
                  </div>

                  <div className="flex justify-between items-center mt-4">
                    <span className="text-xs text-gray-400 uppercase tracking-wider">Compliance Check</span>
                    <span className="text-xs text-brand-secondary font-bold">PASSED</span>
                  </div>
                  <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full w-full bg-brand-secondary shadow-[0_0_10px_#00C2FF]"></div>
                  </div>

                  <div className="pt-4 border-t border-white/5 mt-4">
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Risk Score</span>
                      <span className="text-green-400 font-mono">0.01%</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Elements around */}
              <motion.div
                animate={{ y: [0, 15, 0], x: [0, 5, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                className="absolute -right-4 top-10 w-40 p-3 glass-card rounded-xl flex items-center space-x-3 z-30"
              >
                <div className="p-2 bg-brand-accent/20 rounded-lg">
                  <FileCheck className="h-4 w-4 text-brand-accent" />
                </div>
                <div className="text-xs">
                  <div className="text-white font-bold">PCI-DSS</div>
                  <div className="text-gray-400">Compliant</div>
                </div>
              </motion.div>

              <motion.div
                animate={{ y: [0, -15, 0], x: [0, -5, 0] }}
                transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
                className="absolute -left-12 bottom-32 w-52 p-3 glass-card rounded-xl flex items-center space-x-3 z-30"
              >
                <div className="p-2 bg-green-500/20 rounded-lg">
                  <Shield className="h-4 w-4 text-green-400" />
                </div>
                <div className="text-xs">
                  <div className="text-white font-bold">Fraud Prevention</div>
                  <div className="text-gray-400">Active Shield</div>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>

        {/* Financial Impact Section */}
        <motion.div variants={staggerItem} className="mb-32">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Financial Impact & Risk Reduction</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Secure your bottom line by eliminating vulnerabilities that lead to fraud, data theft, and regulatory fines.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                title: 'Prevent Financial Loss',
                desc: 'Stop exploitation of payment logic and transaction vulnerabilities before deployment.',
                icon: TrendingDown,
                color: 'text-green-400'
              },
              {
                title: 'Regulatory Exposure',
                desc: 'Automated auditing ensures code meets compliance standards (GDPR, SOC2, PCI) continuously.',
                icon: FileCheck,
                color: 'text-brand-secondary'
              },
              {
                title: 'Safer Launches',
                desc: 'Deploy new fintech features with confidence, knowing the risk profile is validated.',
                icon: check_circle_icon, // Placeholder variable, fixing below
                color: 'text-brand-primary'
              },
              {
                title: 'Customer Trust',
                desc: 'Demonstrate bank-grade security to partners and investors with verified audit trails.',
                icon: Building2,
                color: 'text-brand-accent'
              }
            ].map((item, idx) => (
              <div key={idx} className="glass-card p-8 rounded-2xl border-t border-white/10 relative overflow-hidden group">
                <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-${item.color.replace('text-', '')} to-transparent opacity-50 group-hover:opacity-100 transition-opacity`}></div>
                <item.icon className={`h-10 w-10 ${item.color} mb-6`} />
                <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Trusted By Section */}
        <motion.div variants={staggerItem} className="text-center mb-32 border-y border-white/5 py-12 bg-white/0">
          <p className="text-gray-500 text-sm font-bold tracking-widest uppercase mb-8">Securing the World's Financial Infrastructure</p>
          <div className="flex flex-wrap justify-center gap-12 md:gap-24 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
            <div className="text-xl font-bold text-white flex items-center font-serif"><Landmark className="mr-2" /> CHASE</div>
            <div className="text-xl font-bold text-white flex items-center font-mono"><Globe className="mr-2" /> VISA</div>
            <div className="text-xl font-bold text-white flex items-center font-sans tracking-tighter"><Shield className="mr-2" /> STRIPE</div>
            <div className="text-xl font-bold text-white flex items-center"><Building2 className="mr-2" /> GS</div>
            <div className="text-xl font-bold text-white flex items-center font-serif"><Database className="mr-2" /> ORACLE</div>
          </div>
        </motion.div>

        {/* Solutions Grid */}
        <motion.div variants={staggerItem} className="mb-20">
          <div className="mb-12">
            <div className="flex items-center space-x-2 mb-4">
              <div className="h-0.5 w-8 bg-brand-secondary"></div>
              <span className="text-brand-secondary text-sm font-bold tracking-widest uppercase">Enterprise Solutions</span>
            </div>
            <h2 className="text-4xl font-bold text-white">BANK-GRADE<br />SECURITY ARCHITECTURE</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: 'Fintech API Security', icon: Globe, color: 'text-brand-secondary', desc: 'Deep inspection of API endpoints for authorized financial data access.' },
              { title: 'Payment Checksums', icon: Settings, color: 'text-brand-primary', desc: 'Verification of transaction logic integrity and logic locking.' },
              { title: 'User Data Vault', icon: Lock, color: 'text-brand-accent', desc: 'Ensuring PII encryption and handling meets strict banking regulations.' },
              { title: 'Audit Compliance', icon: FileCheck, color: 'text-green-400', desc: 'Generates automated reports for internal risk assessments.' },
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -5 }}
                className="glass-card p-6 rounded-2xl group cursor-pointer"
              >
                <div className={`mb-4 ${feature.color} opacity-80 group-hover:opacity-100 transition-opacity`}>
                  <feature.icon className="h-8 w-8" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed mb-4">
                  {feature.desc}
                </p>
                <div className="flex items-center text-xs font-bold text-white/50 group-hover:text-white transition-colors">
                  VIEW SPECS <ArrowRight className="ml-1 h-3 w-3" />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.main>
    </div>
  );
}

// Helper to fix the icon variable issue in map
const check_circle_icon = CheckCircle2;
