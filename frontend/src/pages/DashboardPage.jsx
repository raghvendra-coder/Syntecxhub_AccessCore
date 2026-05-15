import { motion } from 'framer-motion';
import { 
  Users, Shield, Zap, Lock, AlertTriangle, 
  ArrowUpRight, ArrowDownRight, Layers, Activity,
  Key, UserPlus, Clock
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, BarChart, Bar,
  Cell, PieChart, Pie
} from 'recharts';
import { cn } from '../utils/cn';
import toast from 'react-hot-toast';

const data = [
  { name: 'May 12', val: 4000 },
  { name: 'May 13', val: 3000 },
  { name: 'May 14', val: 5000 },
  { name: 'May 15', val: 4500 },
  { name: 'May 16', val: 6000 },
  { name: 'May 17', val: 5500 },
  { name: 'May 18', val: 7000 },
];

const StatCard = ({ icon: Icon, label, value, trend, trendType, color, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
    className="group glass-card p-8 rounded-[2.5rem] relative overflow-hidden"
  >
    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" 
         style={{ background: `radial-gradient(circle at top right, ${color}10, transparent 70%)` }} />
    
    <div className="flex items-center justify-between mb-8">
      <div className="w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 group-hover:scale-110"
           style={{ background: `${color}05`, border: `1px solid ${color}20` }}>
        <Icon size={24} style={{ color }} />
      </div>
      <div className={cn(
        "flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest",
        trendType === 'up' ? "bg-emerald-500/10 text-emerald-500" : "bg-rose-500/10 text-rose-500"
      )}>
        {trendType === 'up' ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
        {trend}
      </div>
    </div>

    <div>
      <div className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-500 mb-2">{label}</div>
      <div className="text-4xl font-display text-white tracking-tighter">{value}</div>
    </div>
  </motion.div>
);

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-surface p-4 rounded-2xl border border-white/10 shadow-2xl">
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">{payload[0].payload.name}</p>
        <p className="text-xl font-display text-white">{payload[0].value.toLocaleString()}</p>
      </div>
    );
  }
  return null;
};

export default function DashboardPage() {
  const exportDashboardReport = () => {
    toast.loading('Compiling analytics report...', { id: 'export-dash' });
    
    setTimeout(() => {
      const headers = ['Metric', 'Value', 'Trend', 'Status'];
      const rows = [
        ['Total Users', '24892', '+12.5%', 'Optimal'],
        ['Active Sessions', '1248', '+8.2%', 'Optimal'],
        ['Request Rate', '98.2k', '-2.4%', 'Warning'],
        ['Security Health', '99.9%', '+0.5%', 'Optimal'],
        ['', '', '', ''],
        ['Authentication Activity (Last 7 Days)', '', '', ''],
        ['Date', 'Logins', '', ''],
        ...data.map(d => [d.name, d.val, '', ''])
      ];
      
      const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `dashboard_analytics_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success('Analytics report exported successfully!', { id: 'export-dash' });
    }, 1500);
  };

  return (
    <div className="space-y-12 pb-20">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-4">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest"
          >
            <Activity size={14} /> System Status: Optimal
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-6xl font-display text-white tracking-tighter"
          >
            Overview
          </motion.h1>
          <p className="text-slate-500 font-medium">Monitoring your identity infrastructure in real-time.</p>
        </div>

        <div className="flex gap-4">
           <button onClick={() => toast.success('7 days range selected')} className="btn-secondary-glass px-6 h-12 text-[12px] font-black uppercase tracking-widest">
             <Clock size={16} className="mr-2" /> 7 Days
           </button>
           <button onClick={exportDashboardReport} className="btn-enterprise px-6 h-12 text-[12px] font-black uppercase tracking-widest">
             Export Report
           </button>
        </div>
      </div>

      {/* Hero Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <StatCard icon={Users} label="Total Users" value="24,892" trend="+12.5%" trendType="up" color="#2952ff" delay={0.1} />
        <StatCard icon={Shield} label="Active Sessions" value="1,248" trend="+8.2%" trendType="up" color="#10b981" delay={0.2} />
        <StatCard icon={Zap} label="Request Rate" value="98.2k" trend="-2.4%" trendType="down" color="#f59e0b" delay={0.3} />
        <StatCard icon={Lock} label="Security Health" value="99.9%" trend="+0.5%" trendType="up" color="#06b6d4" delay={0.4} />
      </div>

      {/* Charts Section */}
      <div className="grid lg:grid-cols-3 gap-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className="lg:col-span-2 glass-card p-10 rounded-[3rem] relative overflow-hidden"
        >
          <div className="flex items-center justify-between mb-10">
            <div>
              <h3 className="text-2xl font-bold text-white mb-2">Authentication Activity</h3>
              <p className="text-sm text-slate-500 font-medium">Monitor global login trends across all applications.</p>
            </div>
            <div className="flex gap-2">
               <div className="w-3 h-3 rounded-full bg-primary" />
               <div className="w-3 h-3 rounded-full bg-white/10" />
            </div>
          </div>
          
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.03)" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#475569', fontSize: 11, fontWeight: 700 }}
                  dy={15}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#475569', fontSize: 11, fontWeight: 700 }}
                  dx={-15}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 1 }} />
                <Area 
                  type="monotone" 
                  dataKey="val" 
                  stroke="var(--primary)" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorVal)" 
                  animationDuration={2000}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6 }}
          className="glass-card p-10 rounded-[3rem] flex flex-col"
        >
          <h3 className="text-2xl font-bold text-white mb-2">Regional Traffic</h3>
          <p className="text-sm text-slate-500 font-medium mb-10">Live traffic distribution by region.</p>
          
          <div className="space-y-8 flex-1">
             {[
               { region: 'North America', val: '45%', color: 'var(--primary)' },
               { region: 'Europe', val: '28%', color: '#10b981' },
               { region: 'Asia Pacific', val: '18%', color: '#f59e0b' },
               { region: 'Other', val: '9%', color: '#64748b' },
             ].map((item, i) => (
               <div key={i} className="group cursor-default">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[13px] font-bold text-white transition-colors group-hover:text-primary">{item.region}</span>
                    <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">{item.val}</span>
                  </div>
                  <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      whileInView={{ width: item.val }}
                      transition={{ duration: 1.5, delay: 0.8 + (i * 0.1) }}
                      className="h-full rounded-full"
                      style={{ background: item.color }}
                    />
                  </div>
               </div>
             ))}
          </div>

          <button onClick={() => toast('Compiling full regional report...', { icon: '📊' })} className="mt-10 w-full py-4 rounded-[1.5rem] bg-white/[0.03] border border-white/[0.05] text-[11px] font-black uppercase tracking-widest text-white hover:bg-white/[0.06] transition-all">
             View Full Report
          </button>
        </motion.div>
      </div>

      {/* Recent Activity Mini-Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="glass-card rounded-[3rem] overflow-hidden"
      >
        <div className="p-10 border-b border-white/[0.03] flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-bold text-white mb-1">Recent Audit Logs</h3>
            <p className="text-sm text-slate-500 font-medium">Real-time security events across your network.</p>
          </div>
          <button onClick={() => toast('Navigating to Security Center...', { icon: '🛡️' })} className="text-[11px] font-black uppercase tracking-widest text-primary border-b border-primary/20 pb-1 hover:border-primary transition-all">
            View Security Center
          </button>
        </div>
        <div className="p-4 overflow-x-auto">
          <table className="w-full text-left border-separate border-spacing-y-2">
            <thead>
              <tr className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-600 px-6">
                <th className="py-4 px-6">Event</th>
                <th className="py-4 px-6">User</th>
                <th className="py-4 px-6">Timestamp</th>
                <th className="py-4 px-6">Status</th>
              </tr>
            </thead>
            <tbody>
              {[
                { event: 'User Login Successful', user: 'Ravi Sharma', time: '2m ago', status: 'verified', icon: Shield, color: '#10b981' },
                { event: 'Permission Granted', user: 'Admin User', time: '15m ago', status: 'authorized', icon: Key, color: '#2952ff' },
                { event: 'Threat Blocked', user: 'External IP', time: '1h ago', status: 'blocked', icon: AlertTriangle, color: '#ef4444' },
              ].map((log, i) => (
                <tr key={i} className="group hover:bg-white/[0.02] transition-colors rounded-[2rem]">
                  <td className="py-6 px-6">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center transition-all group-hover:scale-110" style={{ background: `${log.color}10` }}>
                        <log.icon size={18} style={{ color: log.color }} />
                      </div>
                      <span className="text-[13px] font-bold text-white">{log.event}</span>
                    </div>
                  </td>
                  <td className="py-6 px-6 text-[13px] font-medium text-slate-400">{log.user}</td>
                  <td className="py-6 px-6 text-[11px] font-black text-slate-600 uppercase tracking-widest">{log.time}</td>
                  <td className="py-6 px-6">
                    <span className="badge px-4 py-1.5 rounded-full" style={{ background: `${log.color}10`, color: log.color, border: `1px solid ${log.color}20` }}>
                      {log.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
