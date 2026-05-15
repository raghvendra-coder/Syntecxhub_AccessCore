import { motion } from 'framer-motion';
import { 
  Shield, Search, Filter, ArrowDown, 
  MoreVertical, AlertTriangle, 
  Key, Layers, Clock, Download, RefreshCw, Activity, Zap, Settings
} from 'lucide-react';
import { cn } from '../utils/cn';
import toast from 'react-hot-toast';

const logs = [
  { id: '1', event: 'User Login Successful', user: 'ravi@accesscore.io', ip: '192.168.1.1', location: 'Mumbai, IN', time: '2 mins ago', status: 'verified', severity: 'low' },
  { id: '2', event: 'API Key Created', user: 'admin@accesscore.io', ip: '104.21.14.9', location: 'London, UK', time: '12 mins ago', status: 'authorized', severity: 'medium' },
  { id: '3', event: 'Invalid MFA Attempt', user: 'guest_921', ip: '210.14.88.2', location: 'Moscow, RU', time: '45 mins ago', status: 'blocked', severity: 'high' },
  { id: '4', event: 'Role Permission Updated', user: 'security_lead', ip: '172.16.0.1', location: 'San Francisco, US', time: '1 hour ago', status: 'verified', severity: 'low' },
  { id: '5', event: 'Suspicious IP Detected', user: 'system', ip: '45.12.8.23', location: 'Unknown', time: '3 hours ago', status: 'flagged', severity: 'high' },
];

const SeverityBadge = ({ severity }) => {
  const styles = {
    low: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    medium: "bg-amber-500/10 text-amber-500 border-amber-500/20",
    high: "bg-rose-500/10 text-rose-500 border-rose-500/20",
  };
  return (
    <span className={cn("px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border", styles[severity])}>
      {severity}
    </span>
  );
};

export default function AuditLogsPage() {
  const exportToCSV = () => {
    toast.loading('Generating CSV report...', { id: 'export-csv' });
    
    setTimeout(() => {
      const headers = ['ID', 'Event', 'User', 'IP Address', 'Location', 'Time', 'Status', 'Severity'];
      const rows = logs.map(log => [
        log.id,
        `"${log.event}"`,
        `"${log.user}"`,
        log.ip,
        `"${log.location}"`,
        `"${log.time}"`,
        log.status,
        log.severity
      ]);
      
      const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `security_audit_logs_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success('Security logs exported successfully!', { id: 'export-csv' });
    }, 1200); // Simulated delay for premium feel
  };

  return (
    <div className="space-y-10 pb-20">
      {/* Header & Controls */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
        <div className="space-y-4">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest"
          >
            <Shield size={14} /> Security Compliance: Level 4
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-6xl font-display text-white tracking-tighter"
          >
            Audit Logs
          </motion.h1>
          <p className="text-slate-500 font-medium">Immutable real-time audit trails for your global infrastructure.</p>
        </div>

        <div className="flex flex-wrap items-center gap-4">
           <div className="relative group">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary transition-colors" />
              <input 
                type="text" 
                placeholder="Search logs..."
                className="h-12 w-64 bg-white/[0.03] border border-white/[0.05] rounded-xl pl-12 pr-4 text-[13px] text-white placeholder:text-slate-600 outline-none focus:border-primary/30 focus:bg-white/[0.05] transition-all"
              />
           </div>
           <button onClick={exportToCSV} className="btn-secondary-glass h-12 px-6 text-[11px] font-black uppercase tracking-widest">
              <Download size={16} className="mr-2" /> Export
           </button>
           <button onClick={() => toast('Opening Log Settings...', { icon: '⚙️' })} className="btn-enterprise h-12 px-6 text-[11px] font-black uppercase tracking-widest">
              <Settings size={18} className="mr-2" /> Settings
           </button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
         {[
           { label: 'Total Events', val: '1.2M', icon: Activity, color: '#2952ff' },
           { label: 'Threats Blocked', val: '452', icon: AlertTriangle, color: '#ef4444' },
           { label: 'Identity Auth', val: '98.4%', icon: Shield, color: '#10b981' },
           { label: 'Avg Latency', val: '12ms', icon: Zap, color: '#f59e0b' },
         ].map((stat, i) => (
           <motion.div
             key={i}
             initial={{ opacity: 0, y: 10 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.1 * i }}
             className="glass-card p-6 rounded-[2rem] flex items-center gap-5"
           >
              <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: `${stat.color}05`, border: `1px solid ${stat.color}15` }}>
                 <stat.icon size={20} style={{ color: stat.color }} />
              </div>
              <div>
                 <div className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-600 mb-0.5">{stat.label}</div>
                 <div className="text-2xl font-display text-white tracking-tighter">{stat.val}</div>
              </div>
           </motion.div>
         ))}
      </div>

      {/* Logs Table */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4 }}
        className="glass-card rounded-[3rem] overflow-hidden"
      >
        <div className="p-10 border-b border-white/[0.03] flex items-center justify-between">
           <div className="flex items-center gap-6">
              <button className="text-[13px] font-bold text-white border-b-2 border-primary pb-2">All Events</button>
              <button onClick={() => toast.error('No previous pages available.')} className="text-[13px] font-bold text-slate-500 hover:text-white transition-colors pb-2">Previous</button>
              <button onClick={() => toast.success('Loading next page...')} className="text-[13px] font-bold text-primary hover:text-white transition-colors pb-2">Next Page</button>
           </div>
           <button className="text-slate-500 hover:text-white transition-colors">
              <RefreshCw size={18} />
           </button>
        </div>

        <div className="p-4 overflow-x-auto">
          <table className="w-full text-left border-separate border-spacing-y-3">
            <thead>
              <tr className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-600">
                <th className="py-4 px-8">Security Event</th>
                <th className="py-4 px-8">Identity</th>
                <th className="py-4 px-8">Network Info</th>
                <th className="py-4 px-8">Severity</th>
                <th className="py-4 px-8">Timestamp</th>
                <th className="py-4 px-8"></th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log, i) => (
                <motion.tr 
                  key={log.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + (i * 0.1) }}
                  className="group cursor-default"
                >
                  <td className="py-6 px-8 bg-white/[0.015] group-hover:bg-white/[0.04] transition-all rounded-l-[2rem] border-y border-l border-white/[0.05]">
                    <div className="flex items-center gap-4">
                      <div className={cn(
                        "w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110",
                        log.status === 'blocked' ? "bg-rose-500/10 text-rose-500" : "bg-primary/10 text-primary"
                      )}>
                        {log.status === 'blocked' ? <AlertTriangle size={18} /> : <Shield size={18} />}
                      </div>
                      <div>
                         <div className="text-[13px] font-bold text-white group-hover:text-primary transition-colors">{log.event}</div>
                         <div className="text-[11px] font-bold text-slate-600 tracking-tight">{log.status}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-6 px-8 bg-white/[0.015] group-hover:bg-white/[0.04] transition-all border-y border-white/[0.05]">
                    <div className="text-[13px] font-bold text-slate-300">{log.user}</div>
                  </td>
                  <td className="py-6 px-8 bg-white/[0.015] group-hover:bg-white/[0.04] transition-all border-y border-white/[0.05]">
                    <div className="flex items-center gap-2 mb-1">
                       <Layers size={14} className="text-slate-500" />
                       <span className="text-[13px] font-bold text-white">{log.ip}</span>
                    </div>
                    <div className="text-[11px] font-bold text-slate-600 uppercase tracking-widest">{log.location}</div>
                  </td>
                  <td className="py-6 px-8 bg-white/[0.015] group-hover:bg-white/[0.04] transition-all border-y border-white/[0.05]">
                    <SeverityBadge severity={log.severity} />
                  </td>
                  <td className="py-6 px-8 bg-white/[0.015] group-hover:bg-white/[0.04] transition-all border-y border-white/[0.05]">
                    <div className="flex items-center gap-2 text-slate-400">
                       <Clock size={14} />
                       <span className="text-[12px] font-bold">{log.time}</span>
                    </div>
                  </td>
                  <td className="py-6 px-8 bg-white/[0.015] group-hover:bg-white/[0.04] transition-all rounded-r-[2rem] border-y border-r border-white/[0.05] text-right">
                     <button className="w-10 h-10 rounded-xl hover:bg-white/10 flex items-center justify-center text-slate-500 hover:text-white transition-all">
                        <MoreVertical size={18} />
                     </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-10 border-t border-white/[0.03] flex items-center justify-between">
           <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Showing 5 of 124,892 security events</p>
           <div className="flex gap-4">
              <button className="btn-secondary-glass px-6 h-10 text-[10px] font-black uppercase tracking-widest opacity-50">Previous</button>
              <button className="btn-secondary-glass px-6 h-10 text-[10px] font-black uppercase tracking-widest">Next Page</button>
           </div>
        </div>
      </motion.div>
    </div>
  );
}
