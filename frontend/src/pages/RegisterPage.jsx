import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { 
  Shield, ArrowRight, Mail, 
  Lock, User, Star, Settings,
  CheckCircle2, Layers, Zap, Cpu, Server
} from 'lucide-react';
import { cn } from '../utils/cn';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register({ name, email, password });
      navigate('/dashboard');
    } catch (error) {
      // Error handling
    }
  };

  return (
    <div className="min-h-screen bg-[#030303] flex overflow-hidden relative">
      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="mesh-gradient absolute inset-0 opacity-30" />
        <div className="noise-bg absolute inset-0" />
      </div>

      {/* Left Side: Cinematic Onboarding Visuals */}
      <div className="hidden lg:flex lg:w-1/2 relative p-16 flex-col justify-between overflow-hidden border-r border-white/5">
        <div className="absolute bottom-[-10%] right-[-10%] w-[80%] h-[80%] ambient-light opacity-10" />
        
        <Link to="/" className="flex items-center gap-3 relative z-10 group">
          <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center blue-glow group-hover:rotate-12 transition-all duration-500">
            <Shield size={28} className="text-white" />
          </div>
          <span className="font-display text-2xl tracking-tighter text-white">AccessCore</span>
        </Link>

        <div className="relative z-10 space-y-12">
          <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-6xl md:text-8xl font-display text-white tracking-tighter leading-[0.9]"
          >
            Start your <br /> 
            <span className="gradient-text italic">infrastructure.</span>
          </motion.h2>
          
          <div className="space-y-10">
             <div className="flex items-center gap-4 text-emerald-500 font-bold text-sm tracking-wide">
                <div className="flex -space-x-3">
                   {[1,2,3,4].map(i => <div key={i} className="w-10 h-10 rounded-full border-2 border-background bg-slate-900 flex items-center justify-center text-[10px] font-black text-white">{i}</div>)}
                </div>
                <span>Joined by 2,000+ engineers this month</span>
             </div>

             <div className="grid grid-cols-2 gap-8">
               {[
                 { icon: Cpu, label: 'Edge Nodes', val: '250+' },
                 { icon: Shield, label: 'Uptime SLA', val: '99.99%' },
                 { icon: Server, label: 'Data Centers', val: '45' },
                 { icon: Zap, label: 'Latency', val: '<12ms' },
               ].map((item, i) => (
                 <motion.div 
                   key={i}
                   initial={{ opacity: 0, y: 20 }}
                   animate={{ opacity: 1, y: 0 }}
                   transition={{ delay: 0.3 + (i * 0.1) }}
                   className="space-y-2"
                 >
                    <div className="flex items-center gap-2 text-slate-500">
                       <item.icon size={16} />
                       <span className="text-[11px] font-black uppercase tracking-widest">{item.label}</span>
                    </div>
                    <div className="text-3xl font-display text-white">{item.val}</div>
                 </motion.div>
               ))}
             </div>
          </div>
        </div>

        <div className="relative z-10 flex items-center gap-3 p-4 rounded-2xl glass-surface border-white/10 max-w-sm">
           <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              <Star size={20} />
           </div>
           <div className="text-xs font-bold text-slate-400">Join our private slack community upon successful registration.</div>
        </div>
      </div>

      {/* Right Side: Register Form */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-6 sm:p-12 md:p-20 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-md space-y-10"
        >
          <div className="text-center lg:text-left space-y-3">
             <h1 className="text-4xl md:text-5xl font-display text-white tracking-tighter">Create account</h1>
             <p className="text-slate-500 font-medium">Join the next generation of security platforms.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-5">
              <div className="space-y-2">
                <label className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Full Name</label>
                <div className="relative group">
                  <User className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-primary transition-colors" size={20} />
                  <input 
                    type="text" 
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full h-14 bg-white/[0.02] border border-white/[0.05] rounded-[1.25rem] pl-14 pr-6 text-white placeholder:text-slate-700 outline-none focus:border-primary/40 focus:bg-white/[0.04] transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Work Email</label>
                <div className="relative group">
                  <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-primary transition-colors" size={20} />
                  <input 
                    type="email" 
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@company.com"
                    className="w-full h-14 bg-white/[0.02] border border-white/[0.05] rounded-[1.25rem] pl-14 pr-6 text-white placeholder:text-slate-700 outline-none focus:border-primary/40 focus:bg-white/[0.04] transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Password</label>
                <div className="relative group">
                  <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-primary transition-colors" size={20} />
                  <input 
                    type="password" 
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create a password"
                    className="w-full h-14 bg-white/[0.02] border border-white/[0.05] rounded-[1.25rem] pl-14 pr-6 text-white placeholder:text-slate-700 outline-none focus:border-primary/40 focus:bg-white/[0.04] transition-all"
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 space-y-6">
              <button type="submit" className="w-full h-16 btn-enterprise text-lg blue-glow">
                Create Account <ArrowRight size={20} className="ml-2" />
              </button>
              
              <div className="flex gap-4">
                 <button type="button" className="flex-1 h-12 rounded-xl glass-surface border-white/[0.05] flex items-center justify-center gap-2 text-[12px] font-bold text-white hover:bg-white/5 transition-all">
                    <Zap size={16} /> GitHub
                 </button>
                 <button type="button" className="flex-1 h-12 rounded-xl glass-surface border-white/[0.05] flex items-center justify-center gap-2 text-[12px] font-bold text-white hover:bg-white/5 transition-all">
                    <Settings size={14} /> Google
                 </button>
              </div>
            </div>
          </form>

          <p className="text-center text-slate-500 font-medium text-sm">
            Already have an account? <Link to="/login" className="text-primary hover:text-white font-bold transition-colors">Sign in here</Link>
          </p>

          <div className="pt-10 flex justify-center items-center gap-8 opacity-40 grayscale pointer-events-none">
             {[1,2,3].map(i => <div key={i} className="h-6 w-20 bg-slate-800 rounded-lg" />)}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
