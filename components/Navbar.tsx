'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Menu, 
  Bell, 
  User,
  ChevronDown,
  Shield,
  Activity,
  AlertCircle,
  CheckCircle2,
  X,
  LogOut
} from 'lucide-react';
import { useScan } from '@/components/ScanContext';
import { slideInRight, fadeIn } from '@/lib/motion';
import { supabaseBrowser } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export function Navbar({ 
  sidebarOpen, 
  setSidebarOpen
}: { 
  sidebarOpen: boolean; 
  setSidebarOpen: (open: boolean) => void;
}) {
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const { appState } = useScan();
  const [scanStatus, setScanStatus] = useState<'idle' | 'scanning' | 'complete'>('idle');
  const router = useRouter();

  useEffect(() => {
    if (appState === 'scanning') {
      setScanStatus('scanning');
    } else if (appState === 'showing-results') {
      setScanStatus('complete');
    } else {
      setScanStatus('idle');
    }
  }, [appState]);

  const handleLogout = async () => {
    try {
      const { error } = await supabaseBrowser().auth.signOut();
      if (error) throw error;
      router.push('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const notifications = [
    { id: 1, type: 'threat', message: '3 critical vulnerabilities detected', time: '2m ago' },
    { id: 2, type: 'patch', message: 'Auto-patch applied to main.js', time: '5m ago' },
    { id: 3, type: 'scan', message: 'Security scan completed', time: '10m ago' },
  ];

  return (
    <motion.nav
      initial="hidden"
      animate="visible"
      variants={slideInRight}
      className="sticky top-0 z-30 flex h-16 flex-shrink-0 mica-strong border-b border-gray-600/30"
    >
      <div className="flex flex-1 items-center justify-between px-4 md:px-6">
        {/* Left Section */}
        <div className="flex items-center space-x-4">
          <button
            type="button"
            className="rounded-lg p-2 text-gray-400 hover:text-cyan-400 hover:bg-cyan-500/10 focus:outline-none transition-all md:hidden"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <Menu className="h-5 w-5" />
          </button>
          
          {/* Live Scan Status */}
          <AnimatePresence mode="wait">
            {scanStatus === 'scanning' && (
              <motion.div
                key="scanning"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="hidden md:flex items-center space-x-2 px-4 py-2 rounded-lg bg-cyan-500/10 border border-cyan-500/30"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                >
                  <Activity className="h-4 w-4 text-cyan-400" />
                </motion.div>
                <span className="text-sm font-medium text-cyan-400">Scanning...</span>
              </motion.div>
            )}
            {scanStatus === 'complete' && (
              <motion.div
                key="complete"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="hidden md:flex items-center space-x-2 px-4 py-2 rounded-lg bg-green-500/10 border border-green-500/30"
              >
                <CheckCircle2 className="h-4 w-4 text-green-400" />
                <span className="text-sm font-medium text-green-400">Scan Complete</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        {/* Right Section */}
        <div className="flex items-center space-x-3">
          {/* Notifications */}
          <div className="relative">
            <button
              type="button"
              className="relative rounded-lg p-2 text-gray-400 hover:text-cyan-400 hover:bg-cyan-500/10 focus:outline-none transition-all"
              onClick={() => setNotificationsOpen(!notificationsOpen)}
            >
              <Bell className="h-5 w-5" />
              {notifications.length > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-1 right-1 flex h-2 w-2"
                >
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
                </motion.span>
              )}
            </button>

            <AnimatePresence>
              {notificationsOpen && (
                <>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-40 md:hidden"
                    onClick={() => setNotificationsOpen(false)}
                  />
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    className="absolute right-0 z-50 mt-2 w-80 origin-top-right rounded-xl glass-strong border border-cyan-500/20 shadow-xl overflow-hidden"
                  >
                    <div className="px-4 py-3 border-b border-cyan-500/20 flex items-center justify-between">
                      <h3 className="text-sm font-semibold text-gray-200">Notifications</h3>
                      <button
                        onClick={() => setNotificationsOpen(false)}
                        className="text-gray-400 hover:text-cyan-400"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {notifications.map((notification) => (
                        <motion.div
                          key={notification.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="px-4 py-3 border-b border-cyan-500/10 hover:bg-cyan-500/5 cursor-pointer transition-colors"
                        >
                          <div className="flex items-start space-x-3">
                            <div className={`flex-shrink-0 mt-0.5 ${
                              notification.type === 'threat' ? 'text-red-400' :
                              notification.type === 'patch' ? 'text-green-400' :
                              'text-cyan-400'
                            }`}>
                              {notification.type === 'threat' ? (
                                <AlertCircle className="h-4 w-4" />
                              ) : notification.type === 'patch' ? (
                                <CheckCircle2 className="h-4 w-4" />
                              ) : (
                                <Shield className="h-4 w-4" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm text-gray-300">{notification.message}</p>
                              <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
          
          {/* Profile dropdown */}
          <div className="relative">
            <button
              type="button"
              className="flex items-center space-x-2 rounded-lg px-3 py-2 text-sm focus:outline-none hover:bg-cyan-500/10 transition-colors border border-transparent hover:border-cyan-500/20"
              onClick={() => setUserMenuOpen(!userMenuOpen)}
            >
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/30">
                <User className="h-4 w-4 text-white" />
              </div>
              <span className="hidden md:block text-gray-300 font-medium">Admin</span>
              <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
            </button>
            
            <AnimatePresence>
              {userMenuOpen && (
                <>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-40 md:hidden"
                    onClick={() => setUserMenuOpen(false)}
                  />
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    className="absolute right-0 z-50 mt-2 w-56 origin-top-right rounded-xl glass-strong border border-cyan-500/20 shadow-xl overflow-hidden"
                  >
                    <div className="px-4 py-3 border-b border-cyan-500/20">
                      <p className="text-sm font-semibold text-gray-200">Admin User</p>
                      <p className="text-xs text-gray-400 mt-0.5">admin@devsentinel.ai</p>
                    </div>
                    <div className="py-1">
                      <a
                        href="#"
                        className="block px-4 py-2 text-sm text-gray-300 hover:bg-cyan-500/10 hover:text-cyan-400 transition-colors"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        Your Profile
                      </a>
                      <a
                        href="/settings"
                        className="block px-4 py-2 text-sm text-gray-300 hover:bg-cyan-500/10 hover:text-cyan-400 transition-colors"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        Settings
                      </a>
                      <button
                        onClick={() => {
                          handleLogout();
                          setUserMenuOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 transition-colors flex items-center"
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        Sign out
                      </button>
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.nav>
  );
}
