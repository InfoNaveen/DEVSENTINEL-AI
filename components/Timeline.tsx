'use client';

import { motion } from 'framer-motion';
import { 
  Clock,
  ShieldCheck,
  Wrench,
  AlertTriangle,
  CheckCircle,
  Zap
} from 'lucide-react';
import { fadeIn, staggerContainer, staggerItem } from '@/lib/motion';

interface TimelineEvent {
  id: number;
  date: string;
  title: string;
  description: string;
  status: 'completed' | 'patched' | 'vulnerable' | 'clean';
  severity: 'high' | 'medium' | 'low' | 'clean';
  findings: number;
  patches: number;
}

interface TimelineProps {
  events: TimelineEvent[];
}

export function Timeline({ events }: TimelineProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <ShieldCheck className="h-5 w-5 text-green-400" />;
      case 'patched':
        return <Wrench className="h-5 w-5 text-cyan-400" />;
      case 'vulnerable':
        return <AlertTriangle className="h-5 w-5 text-red-400" />;
      case 'clean':
        return <CheckCircle className="h-5 w-5 text-green-400" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusStyles = (status: string) => {
    switch (status) {
      case 'completed':
        return {
          bg: 'bg-green-500/10',
          border: 'border-green-500/30',
          iconBg: 'bg-green-500/20',
          glow: 'glow-green'
        };
      case 'patched':
        return {
          bg: 'bg-cyan-500/10',
          border: 'border-cyan-500/30',
          iconBg: 'bg-cyan-500/20',
          glow: 'glow-cyan'
        };
      case 'vulnerable':
        return {
          bg: 'bg-red-500/10',
          border: 'border-red-500/30',
          iconBg: 'bg-red-500/20',
          glow: 'glow-red'
        };
      case 'clean':
        return {
          bg: 'bg-green-500/10',
          border: 'border-green-500/30',
          iconBg: 'bg-green-500/20',
          glow: 'glow-green'
        };
      default:
        return {
          bg: 'bg-gray-500/10',
          border: 'border-gray-500/30',
          iconBg: 'bg-gray-500/20',
          glow: ''
        };
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'bg-red-500/10 text-red-400 border-red-500/30';
      case 'medium':
        return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30';
      case 'low':
        return 'bg-green-500/10 text-green-400 border-green-500/30';
      case 'clean':
        return 'bg-green-500/10 text-green-400 border-green-500/30';
      default:
        return 'bg-gray-500/10 text-gray-400 border-gray-500/30';
    }
  };

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="flow-root"
    >
      <ul className="-mb-8">
        {events.map((event, eventIdx) => {
          const statusStyles = getStatusStyles(event.status);
          const isLast = eventIdx === events.length - 1;
          
          return (
            <motion.li
              key={event.id}
              variants={staggerItem}
            >
              <div className="relative pb-12">
                {!isLast && (
                  <span className="absolute top-8 left-4 -ml-px h-full w-0.5 bg-gradient-to-b from-cyan-500/50 to-transparent" aria-hidden="true" />
                )}
                <div className="relative flex space-x-4">
                  <div>
                    <motion.span
                      whileHover={{ scale: 1.1 }}
                      className={`h-10 w-10 rounded-full flex items-center justify-center ring-4 ring-[#0a0e1a] ${statusStyles.iconBg} ${statusStyles.border} border ${statusStyles.glow}`}
                    >
                      {getStatusIcon(event.status)}
                    </motion.span>
                  </div>
                  <div className="min-w-0 flex-1 pt-1">
                    <motion.div
                      whileHover={{ x: 4 }}
                      className={`glass rounded-lg border ${statusStyles.border} p-4 ${statusStyles.bg}`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <p className="text-sm font-semibold text-gray-200">
                          {event.title}
                        </p>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-800/50 text-gray-400 border border-gray-700">
                          {formatDate(event.date)}
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-gray-400 mb-3">
                        {event.description}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {event.findings > 0 && (
                          <motion.span
                            whileHover={{ scale: 1.05 }}
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getSeverityColor(event.severity)}`}
                          >
                            <AlertTriangle className="mr-1.5 h-3 w-3" />
                            {event.findings} findings
                          </motion.span>
                        )}
                        {event.patches > 0 && (
                          <motion.span
                            whileHover={{ scale: 1.05 }}
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30"
                          >
                            <Wrench className="mr-1.5 h-3 w-3" />
                            {event.patches} patches
                          </motion.span>
                        )}
                        {event.findings === 0 && event.patches === 0 && (
                          <motion.span
                            whileHover={{ scale: 1.05 }}
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-500/10 text-green-400 border border-green-500/30"
                          >
                            <CheckCircle className="mr-1.5 h-3 w-3" />
                            Clean scan
                          </motion.span>
                        )}
                        {event.patches > 0 && event.findings > 0 && (
                          <motion.span
                            whileHover={{ scale: 1.05 }}
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gradient-to-r from-green-500/10 to-cyan-500/10 text-green-400 border border-green-500/30"
                          >
                            <Zap className="mr-1.5 h-3 w-3" />
                            Security posture improved
                          </motion.span>
                        )}
                      </div>
                    </motion.div>
                  </div>
                </div>
              </div>
            </motion.li>
          );
        })}
      </ul>
    </motion.div>
  );
}
