import { motion } from 'framer-motion';
import { 
  Users, Search, Filter, MoreHorizontal, 
  UserPlus, Mail, Shield, Layers, 
  Settings, CheckCircle2, AlertCircle, XCircle
} from 'lucide-react';
import { cn } from '../utils/cn';
import toast from 'react-hot-toast';

const users = [
  { id: '1', name: 'Ravi Sharma', email: 'ravi@accesscore.io', role: 'Administrator', status: 'active', avatar: 'ravi', location: 'Mumbai, IN' },
  { id: '2', name: 'Sarah Wilson', email: 'sarah.w@company.com', role: 'Security Manager', status: 'active', avatar: 'sarah', location: 'London, UK' },
  { id: '3', name: 'Alex Chen', email: 'alex.c@tech.co', role: 'Developer', status: 'pending', avatar: 'alex', location: 'Singapore, SG' },
  { id: '4', name: 'Michael Brown', email: 'm.brown@corp.net', role: 'Administrator', status: 'active', avatar: 'michael', location: 'San Francisco, US' },
  { id: '5', name: 'Elena Petrova', email: 'elena@cyber.io', role: 'Security Analyst', status: 'suspended', avatar: 'elena', location: 'Berlin, DE' },
];

const RoleBadge = ({ role }) => {
  const isDoc = role.includes('Administrator');
  return (
    <span className={cn(
      "px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border",
      isDoc ? "bg-primary/10 text-primary border-primary/20" : "bg-white/[0.04] text-slate-400 border-white/5"
    )}>
      {role}
    </span>
  );
};

const StatusIcon = ({ status }) => {
  if (status === 'active') return <CheckCircle2 size={16} className="text-emerald-500" />;
  if (status === 'pending') return <AlertCircle size={16} className="text-amber-500" />;
  return <XCircle size={16} className="text-rose-500" />;
};

export default function UsersPage() {
  return (
    <div className="space-y-10 pb-20">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
        <div className="space-y-4">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-emerald-500/10 text-emerald-500 text-[10px] font-black uppercase tracking-widest"
          >
            <Users size={14} /> Total Identities: 2,482
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-6xl font-display text-white tracking-tighter"
          >
            Directory
          </motion.h1>
          <p className="text-slate-500 font-medium">Manage and audit global identities across your ecosystem.</p>
        </div>

        <div className="flex flex-wrap items-center gap-4">
           <div className="relative group">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary transition-colors" />
              <input 
                type="text" 
                placeholder="Search directory..."
                className="h-12 w-64 bg-white/[0.03] border border-white/[0.05] rounded-xl pl-12 pr-4 text-[13px] text-white placeholder:text-slate-600 outline-none focus:border-primary/30 focus:bg-white/[0.05] transition-all"
              />
           </div>
           <button onClick={() => toast('Opening advanced filters...', { icon: '🎛️' })} className="btn-secondary-glass h-12 px-6 text-[11px] font-black uppercase tracking-widest">
              <Filter size={16} className="mr-2" /> Filter
           </button>
           <button onClick={() => toast.success('Identity Provisioning flow opened.')} className="btn-enterprise h-12 px-6 text-[11px] font-black uppercase tracking-widest">
              <UserPlus size={18} className="mr-2" /> Add Identity
           </button>
        </div>
      </div>

      {/* Users Grid/Table */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="glass-card rounded-[3rem] overflow-hidden"
      >
        <div className="p-10 border-b border-white/[0.03] flex items-center justify-between">
           <div className="flex items-center gap-6">
              <button className="text-[13px] font-bold text-white border-b-2 border-primary pb-2">Active Users</button>
              <button className="text-[13px] font-bold text-slate-500 hover:text-white transition-colors pb-2">Administrators</button>
              <button className="text-[13px] font-bold text-slate-500 hover:text-white transition-colors pb-2">Suspended</button>
           </div>
           <div className="text-slate-500 font-bold text-sm">24 Active Sessions</div>
        </div>

        <div className="p-4 overflow-x-auto">
          <table className="w-full text-left border-separate border-spacing-y-3">
            <thead>
              <tr className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-600">
                <th className="py-4 px-8">Identity</th>
                <th className="py-4 px-8">Role & Access</th>
                <th className="py-4 px-8">Origin</th>
                <th className="py-4 px-8">Status</th>
                <th className="py-4 px-8 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, i) => (
                <motion.tr 
                  key={user.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + (i * 0.1) }}
                  className="group cursor-default"
                >
                  <td className="py-6 px-8 bg-white/[0.015] group-hover:bg-white/[0.04] transition-all rounded-l-[2.5rem] border-y border-l border-white/[0.05]">
                    <div className="flex items-center gap-5">
                       <div className="w-12 h-12 rounded-2xl overflow-hidden border border-white/10 group-hover:scale-110 transition-transform">
                          <img src={`https://api.dicebear.com/7.x/notionists/svg?seed=${user.name}`} className="w-full h-full object-cover" alt={user.name} />
                       </div>
                       <div>
                          <div className="text-[14px] font-bold text-white group-hover:text-primary transition-colors">{user.name}</div>
                          <div className="text-[11px] font-bold text-slate-500">{user.email}</div>
                       </div>
                    </div>
                  </td>
                  <td className="py-6 px-8 bg-white/[0.015] group-hover:bg-white/[0.04] transition-all border-y border-white/[0.05]">
                    <RoleBadge role={user.role} />
                  </td>
                  <td className="py-6 px-8 bg-white/[0.015] group-hover:bg-white/[0.04] transition-all border-y border-white/[0.05]">
                    <div className="flex items-center gap-2 text-slate-400">
                       <Layers size={14} />
                       <span className="text-[13px] font-bold">{user.location}</span>
                    </div>
                  </td>
                  <td className="py-6 px-8 bg-white/[0.015] group-hover:bg-white/[0.04] transition-all border-y border-white/[0.05]">
                    <div className="flex items-center gap-2">
                       <StatusIcon status={user.status} />
                       <span className="text-[11px] font-black uppercase tracking-widest text-white/70">{user.status}</span>
                    </div>
                  </td>
                  <td className="py-6 px-8 bg-white/[0.015] group-hover:bg-white/[0.04] transition-all rounded-r-[2.5rem] border-y border-r border-white/[0.05] text-right">
                     <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => toast('Opening user settings...', { icon: '⚙️' })} className="w-10 h-10 rounded-xl glass-surface flex items-center justify-center text-slate-400 hover:text-white transition-all">
                           <Settings size={18} />
                        </button>
                        <button onClick={() => toast.success('Options menu opened')} className="w-10 h-10 rounded-xl glass-surface flex items-center justify-center text-slate-400 hover:text-rose-500 transition-all">
                           <MoreHorizontal size={18} />
                        </button>
                     </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-10 border-t border-white/[0.03] flex items-center justify-between">
           <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Page 1 of 42</p>
           <div className="flex gap-4 text-[13px] font-bold">
              <button onClick={() => toast.error('No previous pages available.')} className="text-slate-500 hover:text-white transition-colors">Previous</button>
              <button onClick={() => toast.success('Loading next page...')} className="text-primary hover:text-white transition-colors">Next Page</button>
           </div>
        </div>
      </motion.div>

      {/* Floating Insight Card */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="glass-card p-10 rounded-[3rem] border-primary/20 bg-primary/[0.01] relative overflow-hidden group"
      >
        <div className="absolute top-0 right-0 p-12 opacity-10 group-hover:scale-125 transition-transform duration-[2s]">
           <Shield size={160} className="text-primary" />
        </div>
        <div className="relative z-10 space-y-6">
           <h4 className="text-3xl font-display text-white tracking-tighter">Security Posture Insight</h4>
           <p className="text-slate-400 max-w-xl font-medium leading-relaxed">
             We detected that 12% of your users haven't rotated their security keys in over 90 days. We recommend enforcing a global rotation policy to maintain compliance.
           </p>
           <button onClick={() => toast.success('Rotation policy applied to 24 users.')} className="btn-enterprise">Enforce Rotation Policy</button>
        </div>
      </motion.div>
    </div>
  );
}
