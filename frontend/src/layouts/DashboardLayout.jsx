import { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, Users, Shield, Zap, LogOut, 
  Menu, X, Search, Bell, Settings, ChevronLeft,
  User, Layers, Star, Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../utils/cn';
import toast from 'react-hot-toast';

const NavItem = ({ to, icon: Icon, label, collapsed }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  
  return (
    <Link to={to} className="relative block group px-3 py-1">
      <div className={cn(
        "flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-500 ease-out-expo relative overflow-hidden group/item",
        isActive ? "bg-white/[0.04] text-white shadow-inner border border-white/[0.05]" : "text-slate-500 hover:text-slate-300"
      )}>
        <div className={cn(
          "transition-all duration-500",
          isActive ? "text-primary scale-110 blue-glow" : "group-hover:text-white"
        )}>
          <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
        </div>
        
        <AnimatePresence mode="wait">
          {!collapsed && (
            <motion.span 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="font-bold text-[13.5px] tracking-tight whitespace-nowrap"
            >
              {label}
            </motion.span>
          )}
        </AnimatePresence>

        {isActive && (
          <motion.div 
            layoutId="active-indicator"
            className="absolute left-0 w-1 h-6 bg-primary rounded-r-full shadow-[0_0_12px_rgba(41,82,255,0.8)]"
          />
        )}
      </div>
    </Link>
  );
};

export default function DashboardLayout() {
  const { user, logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Overview' },
    { to: '/users', icon: Users, label: 'Directory' },
    { to: '/audit-logs', icon: Shield, label: 'Audit Logs' },
    { to: '/cron-jobs', icon: Zap, label: 'Automations' },
  ];

  return (
    <div className="min-h-screen bg-[#030303] flex text-foreground selection:bg-primary/20 overflow-hidden">
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="mesh-gradient absolute inset-0 opacity-40" />
        <div className="noise-bg absolute inset-0" />
      </div>

      {/* Sidebar */}
      <motion.aside 
        initial={false}
        animate={{ width: collapsed ? 90 : 300 }}
        className={cn(
          "fixed inset-y-0 left-0 z-[100] hidden lg:flex flex-col transition-all duration-500 ease-out-expo p-4",
        )}
      >
        <div className="h-full glass-surface rounded-[2.5rem] flex flex-col relative overflow-hidden group/sidebar">
          {/* Top Logo */}
          <div className="h-24 flex items-center px-6 mb-4">
            <Link to="/dashboard" className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-primary flex items-center justify-center shadow-glow transition-all duration-500 hover:rotate-12 group-hover/sidebar:scale-110">
                <Shield size={24} className="text-white" />
              </div>
              <AnimatePresence>
                {!collapsed && (
                  <motion.span 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className="font-display text-xl tracking-tighter text-white"
                  >
                    AccessCore
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>
          </div>

          {/* Navigation */}
          <div className="flex-1 space-y-1 overflow-y-auto px-2 custom-scrollbar">
            <div className={cn("px-6 py-4", collapsed ? "opacity-0" : "opacity-100")}>
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-600">Platform</span>
            </div>
            {navItems.map((item) => (
              <NavItem key={item.to} {...item} collapsed={collapsed} />
            ))}
          </div>

          {/* Bottom Profile/Collapse */}
          <div className="mt-auto p-4 border-t border-white/[0.03] space-y-4">
             {!collapsed && (
               <div className="p-5 rounded-[2rem] bg-white/[0.02] border border-white/[0.05] relative overflow-hidden group/upgrade">
                 <div className="absolute top-0 right-0 p-2 opacity-50 group-hover/upgrade:scale-110 transition-transform">
                    <Star size={14} className="text-primary" />
                 </div>
                 <div className="text-[11px] font-black text-slate-500 uppercase tracking-widest mb-1">Upgrade To Pro</div>
                 <div className="text-xs font-bold text-white mb-3">Get advanced analytics</div>
                 <button onClick={() => toast.success('Redirecting to billing portal...')} className="w-full py-2 rounded-xl bg-white text-black text-[10px] font-black uppercase tracking-widest hover:scale-[1.02] transition-all">
                    Upgrade
                 </button>
               </div>
             )}
             
             <div className="flex items-center justify-between gap-3 px-2">
                <button 
                  onClick={() => setCollapsed(!collapsed)}
                  className="w-10 h-10 rounded-xl glass-surface flex items-center justify-center text-slate-500 hover:text-white transition-all"
                >
                  <ChevronLeft size={18} className={cn(collapsed && "rotate-180 transition-transform")} />
                </button>
                {!collapsed && (
                  <button 
                    onClick={handleLogout}
                    className="flex-1 flex items-center justify-center gap-2 h-10 rounded-xl bg-rose-500/10 text-rose-500 text-[11px] font-black uppercase tracking-widest hover:bg-rose-500 hover:text-white transition-all"
                  >
                    <LogOut size={16} /> Logout
                  </button>
                )}
             </div>
          </div>
        </div>
      </motion.aside>

      {/* Main Content Area */}
      <main className={cn(
        "flex-1 flex flex-col transition-all duration-500 ease-out-expo relative z-10",
        collapsed ? "lg:ml-[90px]" : "lg:ml-[300px]"
      )}>
        {/* Modern Header */}
        <header className="h-24 sticky top-0 z-[90] px-8 md:px-12 flex items-center justify-between">
          <div className="absolute inset-0 bg-background/60 backdrop-blur-2xl border-b border-white/[0.03]" />
          
          <div className="relative z-10 flex items-center gap-6 flex-1">
             <button className="lg:hidden w-11 h-11 rounded-xl glass-surface flex items-center justify-center text-white" onClick={() => setMobileOpen(true)}>
               <Menu size={22} />
             </button>
             
             <div className="relative max-w-lg w-full hidden md:block group">
               <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary transition-all" />
               <input 
                 type="text" 
                 placeholder="Search anything... (⌘K)"
                 className="w-full h-12 bg-white/[0.03] border border-white/[0.05] rounded-[1.25rem] pl-12 pr-4 text-[13px] text-white placeholder:text-slate-600 outline-none focus:border-primary/40 focus:bg-white/[0.05] transition-all"
               />
             </div>
          </div>

          <div className="relative z-10 flex items-center gap-4">
             <div className="hidden sm:flex items-center gap-2 pr-6 mr-2 border-r border-white/[0.05]">
                <button onClick={() => toast('Opening notification center...', { icon: '🔔' })} className="w-11 h-11 rounded-xl glass-surface flex items-center justify-center text-slate-400 hover:text-white transition-all relative group">
                  <Bell size={20} />
                  <span className="absolute top-3 right-3 w-2 h-2 bg-primary rounded-full blue-glow" />
                </button>
                <button onClick={() => toast('Loading platform settings...', { icon: '⚙️' })} className="w-11 h-11 rounded-xl glass-surface flex items-center justify-center text-slate-400 hover:text-white transition-all">
                  <Settings size={20} />
                </button>
             </div>

             <button className="flex items-center gap-3 p-1.5 rounded-2xl glass-surface hover:bg-white/[0.05] transition-all group">
                <div className="w-10 h-10 rounded-xl overflow-hidden border border-white/[0.1] bg-slate-900 shadow-xl group-hover:scale-105 transition-transform">
                   <img src={`https://api.dicebear.com/7.x/notionists/svg?seed=${user?.name}`} className="w-full h-full object-cover" alt="User" />
                </div>
                <div className="text-left hidden sm:block pr-3">
                  <div className="text-[13px] font-bold text-white tracking-tight leading-none mb-0.5">{user?.name}</div>
                  <div className="text-[10px] font-black uppercase tracking-[0.15em] text-primary">{user?.role}</div>
                </div>
             </button>
          </div>
        </header>

        {/* Dynamic Content Surface */}
        <div className="flex-1 p-8 md:p-12 overflow-y-auto overflow-x-hidden custom-scrollbar">
          <div className="max-w-[1500px] mx-auto w-full">
            <Outlet />
          </div>
        </div>
      </main>

      {/* Mobile Drawer Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[1000] lg:hidden"
          >
            <div className="absolute inset-0 bg-background/90 backdrop-blur-xl" onClick={() => setMobileOpen(false)} />
            <motion.aside 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="absolute inset-y-0 left-0 w-80 bg-black/50 border-r border-white/5 p-6 flex flex-col"
            >
               <div className="flex items-center justify-between mb-12">
                 <div className="flex items-center gap-3">
                   <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-glow">
                     <Shield size={22} className="text-white" />
                   </div>
                   <span className="font-display text-xl text-white">AccessCore</span>
                 </div>
                 <button onClick={() => setMobileOpen(false)} className="w-10 h-10 rounded-xl glass-surface flex items-center justify-center text-slate-500"><X size={20} /></button>
               </div>
               
               <div className="flex-1 space-y-2">
                 {navItems.map((item) => (
                   <div key={item.to} onClick={() => setMobileOpen(false)}>
                     <NavItem {...item} collapsed={false} />
                   </div>
                 ))}
               </div>
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
