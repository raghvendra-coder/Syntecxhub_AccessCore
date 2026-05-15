import { motion } from 'framer-motion';
import { 
  Zap, Clock, Play, Pause, Trash2, 
  Settings, CheckCircle2, AlertTriangle, 
  Activity, RefreshCw, Plus
} from 'lucide-react';
import { cn } from '../utils/cn';
import toast from 'react-hot-toast';

const jobs = [
  { id: '1', name: 'Identity Sync', schedule: '*/15 * * * *', lastRun: '12m ago', successRate: '99.9%', status: 'running', type: 'system' },
  { id: '2', name: 'Audit Log Rotation', schedule: '0 0 * * *', lastRun: '14h ago', successRate: '100%', status: 'idle', type: 'security' },
  { id: '3', name: 'Suspicious IP Sweep', schedule: '*/5 * * * *', lastRun: '2m ago', successRate: '94.2%', status: 'running', type: 'security' },
  { id: '4', name: 'Monthly Compliance Report', schedule: '0 0 1 * *', lastRun: '12d ago', successRate: '100%', status: 'idle', type: 'compliance' },
];

const StatusBadge = ({ status }) => {
  const isRunning = status === 'running';
  return (
    <div className="flex items-center gap-2">
       <div className={cn(
         "w-2 h-2 rounded-full",
         isRunning ? "bg-emerald-500 animate-pulse blue-glow" : "bg-slate-600"
       )} />
       <span className={cn(
         "text-[10px] font-black uppercase tracking-widest",
         isRunning ? "text-emerald-500" : "text-slate-500"
       )}>
         {status}
       </span>
    </div>
  );
};

export default function CronJobsPage() {
  return (
    <div className="space-y-10 pb-20">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
        <div className="space-y-4">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-amber-500/10 text-amber-500 text-[10px] font-black uppercase tracking-widest"
          >
            <Zap size={14} /> Automation Engine: v2.4 Active
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-6xl font-display text-white tracking-tighter"
          >
            Automations
          </motion.h1>
          <p className="text-slate-500 font-medium">Schedule and manage identity orchestration workflows.</p>
        </div>

        <div className="flex gap-4">
           <button onClick={() => toast.success('Syncing latest job statuses...')} className="btn-secondary-glass px-6 h-12 text-[12px] font-black uppercase tracking-widest">
             <RefreshCw size={16} className="mr-2" /> Refresh
           </button>
           <button onClick={() => toast('Opening automation builder...', { icon: '🤖' })} className="btn-enterprise px-6 h-12 text-[12px] font-black uppercase tracking-widest">
             <Plus size={18} className="mr-2" /> Create Job
           </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
         {[
           { label: 'Active Workflows', val: '12', trend: '+2', color: '#2952ff' },
           { label: 'Avg Execution Time', val: '450ms', trend: '-24ms', color: '#10b981' },
           { label: 'Success Rate', val: '99.98%', trend: '+0.01%', color: '#06b6d4' },
         ].map((stat, i) => (
           <motion.div
             key={i}
             initial={{ opacity: 0, scale: 0.95 }}
             animate={{ opacity: 1, scale: 1 }}
             transition={{ delay: i * 0.1 }}
             className="glass-card p-8 rounded-[2.5rem] flex items-center justify-between"
           >
              <div>
                 <div className="text-[11px] font-black uppercase tracking-widest text-slate-500 mb-2">{stat.label}</div>
                 <div className="text-4xl font-display text-white tracking-tighter">{stat.val}</div>
              </div>
              <div className="text-emerald-500 flex items-center gap-1 font-bold text-sm">
                 <Zap size={16} /> {stat.trend}
              </div>
           </motion.div>
         ))}
      </div>

      {/* Jobs Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         {jobs.map((job, i) => (
           <motion.div
             key={job.id}
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.3 + (i * 0.1) }}
             className="group glass-card p-10 rounded-[3rem] relative overflow-hidden"
           >
              <div className="absolute top-0 right-0 p-8 opacity-5 transition-opacity group-hover:opacity-10">
                 <Zap size={80} className="text-primary" />
              </div>
              
              <div className="relative z-10 space-y-8">
                 <div className="flex items-start justify-between">
                    <div className="space-y-2">
                       <StatusBadge status={job.status} />
                       <h3 className="text-2xl font-bold text-white group-hover:text-primary transition-colors">{job.name}</h3>
                       <div className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">{job.type} orchestration</div>
                    </div>
                    <div className="flex gap-2">
                       <button onClick={() => toast.success('Job state toggled')} className="w-11 h-11 rounded-xl glass-surface flex items-center justify-center text-slate-400 hover:text-white transition-all">
                          {job.status === 'running' ? <Pause size={18} /> : <Play size={18} />}
                       </button>
                       <button onClick={() => toast('Opening job configuration...', { icon: '⚙️' })} className="w-11 h-11 rounded-xl glass-surface flex items-center justify-center text-slate-400 hover:text-primary transition-all">
                          <Settings size={18} />
                       </button>
                    </div>
                 </div>

                 <div className="grid grid-cols-2 gap-6 pt-4 border-t border-white/[0.03]">
                    <div className="space-y-1">
                       <div className="flex items-center gap-2 text-slate-600">
                          <Clock size={14} />
                          <span className="text-[10px] font-black uppercase tracking-widest">Schedule</span>
                       </div>
                       <div className="text-sm font-bold text-white font-mono">{job.schedule}</div>
                    </div>
                    <div className="space-y-1">
                       <div className="flex items-center gap-2 text-slate-600">
                          <Activity size={14} />
                          <span className="text-[10px] font-black uppercase tracking-widest">Success Rate</span>
                       </div>
                       <div className="text-sm font-bold text-emerald-500">{job.successRate}</div>
                    </div>
                 </div>

                 <div className="flex items-center justify-between pt-4">
                    <div className="text-[11px] font-bold text-slate-600">Last ran: <span className="text-slate-400">{job.lastRun}</span></div>
                    <button onClick={() => toast.error(`Terminated job: ${job.name}`)} className="text-[10px] font-black uppercase tracking-widest text-rose-500/50 hover:text-rose-500 transition-colors">
                       Terminate Job
                    </button>
                 </div>
              </div>
           </motion.div>
         ))}

         {/* Create New Card */}
         <motion.button
            onClick={() => toast('Opening automation builder...', { icon: '🤖' })}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="group p-10 rounded-[3rem] border-2 border-dashed border-white/[0.05] hover:border-primary/20 hover:bg-primary/[0.01] transition-all flex flex-col items-center justify-center gap-6"
         >
            <div className="w-16 h-16 rounded-full glass-surface flex items-center justify-center text-slate-500 group-hover:text-primary group-hover:scale-110 transition-all">
               <Plus size={32} />
            </div>
            <div className="text-center">
               <div className="text-xl font-bold text-white mb-1">Create Automation</div>
               <div className="text-sm text-slate-500 font-medium">Design custom security workflows</div>
            </div>
         </motion.button>
      </div>
    </div>
  );
}
