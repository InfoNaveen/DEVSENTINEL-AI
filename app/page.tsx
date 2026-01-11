'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  Shield,
  Zap,
  Lock,
  Globe,
  Settings,
  Database,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';
import { staggerContainer, staggerItem, fadeIn } from '@/lib/motion';

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Navigation Bar Placeholder */}
      <nav className="absolute top-0 w-full px-8 py-6 flex justify-between items-center z-50">
        <div className="text-xl font-bold tracking-wider text-white">
          DEVSENTINEL
        </div>
        <div className="hidden md:flex space-x-8 text-sm font-medium text-gray-300">
          <a href="#" className="hover:text-brand-secondary transition-colors">COMPANY</a>
          <a href="#" className="hover:text-brand-secondary transition-colors">PLATFORM</a>
          <a href="#" className="hover:text-brand-secondary transition-colors">SERVICES</a>
          <a href="#" className="hover:text-brand-secondary transition-colors">RESOURCES</a>
          <a href="#" className="hover:text-brand-secondary transition-colors">CONTACT</a>
        </div>
        <div className="flex items-center space-x-4">
          <button className="text-sm font-medium text-white hover:text-brand-secondary">PARTNER LOGIN</button>
          <Link href="/upload">
            <button className="bg-white text-black px-5 py-2 rounded-full text-sm font-bold hover:bg-gray-200 transition-colors">
              REQUEST A DEMO
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
              <span className="text-brand-secondary text-sm font-bold tracking-widest uppercase">Hosted by Enterprise</span>
            </div>

            <h1 className="text-6xl md:text-7xl font-bold leading-tight mb-6 text-white">
              SECURED BY<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">INNOVATION</span>
            </h1>

            <p className="text-gray-400 text-lg mb-10 max-w-xl leading-relaxed">
              Cerebra develops advanced cyber-security solutions designed to protect the digital infrastructure of tomorrow. Empower people and organizations to safely engage in their digital experience.
            </p>

            <Link href="/upload">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-gradient-to-r from-brand-secondary to-blue-500 rounded-full text-white font-bold shadow-[0_0_20px_rgba(0,194,255,0.3)] hover:shadow-[0_0_30px_rgba(0,194,255,0.5)] transition-all"
              >
                REQUEST A DEMO
              </motion.button>
            </Link>
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
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-80 glass-panel rounded-2xl flex flex-col items-center justify-center p-6 border-brand-secondary/30 z-20">
                <div className="w-16 h-16 bg-gradient-to-br from-brand-secondary to-brand-primary rounded-xl flex items-center justify-center mb-6 shadow-lg shadow-brand-secondary/20">
                  <Shield className="text-white h-8 w-8" />
                </div>
                <div className="w-full space-y-3">
                  <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full w-3/4 bg-brand-secondary shadow-[0_0_10px_#00C2FF]"></div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-400">
                    <span>Protection</span>
                    <span className="text-white">98%</span>
                  </div>
                  <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden mt-4">
                    <div className="h-full w-1/2 bg-brand-primary shadow-[0_0_10px_#7000FF]"></div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-400">
                    <span>Threats</span>
                    <span className="text-white">Blocked</span>
                  </div>
                </div>
              </div>

              {/* Floating Elements around */}
              <motion.div
                animate={{ y: [0, 15, 0], x: [0, 5, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                className="absolute -right-4 top-20 w-40 p-4 glass-card rounded-xl flex items-center space-x-3 z-30"
              >
                <div className="p-2 bg-brand-accent/20 rounded-lg">
                  <Database className="h-4 w-4 text-brand-accent" />
                </div>
                <div className="text-xs">
                  <div className="text-white font-bold">Data Safe</div>
                  <div className="text-gray-400">Encrypted</div>
                </div>
              </motion.div>

              <motion.div
                animate={{ y: [0, -15, 0], x: [0, -5, 0] }}
                transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
                className="absolute -left-12 bottom-32 w-48 p-4 glass-card rounded-xl flex items-center space-x-3 z-30"
              >
                <div className="p-2 bg-green-500/20 rounded-lg">
                  <CheckCircle2 className="h-4 w-4 text-green-400" />
                </div>
                <div className="text-xs">
                  <div className="text-white font-bold">System Active</div>
                  <div className="text-gray-400">Monitoring</div>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>

        {/* Trusted By Section */}
        <motion.div variants={staggerItem} className="text-center mb-32 border-y border-white/5 py-12 bg-white/0">
          <p className="text-gray-500 text-sm font-bold tracking-widest uppercase mb-8">Trusted by Leading Organizations</p>
          <div className="flex flex-wrap justify-center gap-12 md:gap-24 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
            {/* Placeholder Logos */}
            <div className="text-xl font-bold text-white flex items-center"><Globe className="mr-2" /> Gartner</div>
            <div className="text-xl font-bold text-white flex items-center"><Shield className="mr-2" /> Cyberark</div>
            <div className="text-xl font-bold text-white flex items-center"><Lock className="mr-2" /> Sentinel</div>
            <div className="text-xl font-bold text-white flex items-center"><Zap className="mr-2" /> Rapid7</div>
            <div className="text-xl font-bold text-white flex items-center"><Database className="mr-2" /> Oracle</div>
          </div>
        </motion.div>

        {/* Features Grid ("Trusted by Industry") */}
        <motion.div variants={staggerItem} className="mb-20">
          <div className="mb-12">
            <div className="flex items-center space-x-2 mb-4">
              <div className="h-0.5 w-8 bg-brand-secondary"></div>
              <span className="text-brand-secondary text-sm font-bold tracking-widest uppercase">Solutions</span>
            </div>
            <h2 className="text-4xl font-bold text-white">TRUSTED BY<br />INDUSTRY</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: 'Security Impact', icon: Shield, color: 'text-brand-secondary' },
              { title: 'Operational Efficiency', icon: Settings, color: 'text-brand-primary' },
              { title: 'Adoption & Reach', icon: Globe, color: 'text-brand-accent' },
              { title: 'Integrations', icon: Database, color: 'text-green-400' },
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
                  Comprehensive cyber-security solutions designed for the modern threat landscape.
                </p>
                <div className="flex items-center text-xs font-bold text-white/50 group-hover:text-white transition-colors">
                  LEARN MORE <ArrowRight className="ml-1 h-3 w-3" />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.main>
    </div>
  );
}
