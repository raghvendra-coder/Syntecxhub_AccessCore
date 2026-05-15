import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { 
  Shield, ArrowRight, Mail, 
  Lock, Eye, EyeOff, Star, Settings,
  CheckCircle2, Layers, Zap
} from 'lucide-react';
import { cn } from '../utils/cn';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (error) {
      // toast is already handled in api interceptor or service
    }
  };

  return (
    <div className="min-h-screen bg-[#030303] flex overflow-hidden relative">
      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="mesh-gradient absolute inset-0 opacity-30" />
        <div className="noise-bg absolute inset-0" />
      </div>

      {/* Left Side: Cinematic Visuals */}
      <div className="hidden lg:flex lg:w-1/2 relative p-16 flex-col justify-between overflow-hidden">
        <div className="absolute top-[-20%] left-[-20%] w-[80%] h-[80%] ambient-light opacity-20" />
        
        <Link to="/" className="flex items-center gap-3 relative z-10 group">
          <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center blue-glow group-hover:rotate-12 transition-all duration-500">
            <Shield size={28} className="text-white" />
          </div>
          <span className="font-display text-2xl tracking-tighter text-white">AccessCore</span>
        </Link>

        <div className="relative z-10 space-y-10">
          <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
            className="text-6xl md:text-8xl font-display text-white tracking-tighter leading-[0.9]"
          >
            Security for the <br /> 
            <span className="gradient-text italic">next generation.</span>
          </motion.h2>
          
          <div className="space-y-6">
             {[
               { icon: Zap, label: 'Zero Trust Architecture', desc: 'Enforced globally within milliseconds.' },
               { icon: Layers, label: 'Global Distribution', desc: 'Edge-native persistence and security.' },
               { icon: Settings, label: 'Programmable Identity', desc: 'Powerful SDKs for modern engineers.' },
             ].map((item, i) => (
               <motion.div 
                 key={i}
                 initial={{ opacity: 0, x: -20 }}
                 animate={{ opacity: 1, x: 0 }}
                 transition={{ delay: 0.2 + (i * 0.1), duration: 0.8 }}
                 className="flex items-start gap-5"
               >
                  <div className="w-10 h-10 rounded-xl glass-surface flex items-center justify-center flex-shrink-0 text-primary">
                    <item.icon size={20} />
                  </div>
                  <div>
                    <div className="text-white font-bold text-[15px] mb-1">{item.label}</div>
                    <div className="text-slate-500 text-sm font-medium">{item.desc}</div>
                  </div>
               </motion.div>
             ))}
          </div>
        </div>

        <div className="relative z-10">
           <div className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-600 mb-4">Backed by the best</div>
           <div className="flex gap-10 opacity-30 grayscale brightness-150">
              {['Vercel', 'Linear', 'Stripe'].map(name => (
                <span key={name} className="font-display text-xl text-white">{name}</span>
              ))}
           </div>
        </div>
      </div>

      {/* Right Side: Auth Form */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-6 sm:p-12 md:p-20 relative z-10">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
          className="w-full max-w-md space-y-12"
        >
          <div className="text-center lg:text-left space-y-4">
             <h1 className="text-4xl md:text-5xl font-display text-white tracking-tighter">Welcome back</h1>
             <p className="text-slate-500 font-medium">Please enter your details to sign in.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Email Address</label>
                <div className="relative group">
                  <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-primary transition-colors" size={20} />
                  <input 
                    type="email" 
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@company.com"
                    className="w-full h-16 bg-white/[0.02] border border-white/[0.05] rounded-[1.5rem] pl-14 pr-6 text-white placeholder:text-slate-700 outline-none focus:border-primary/40 focus:bg-white/[0.04] transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between ml-1">
                   <label className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-500">Password</label>
                   <Link to="#" className="text-[11px] font-black uppercase tracking-widest text-primary hover:text-white transition-colors">Forgot Password?</Link>
                </div>
                <div className="relative group">
                  <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-primary transition-colors" size={20} />
                  <input 
                    type={showPassword ? 'text' : 'password'} 
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full h-16 bg-white/[0.02] border border-white/[0.05] rounded-[1.5rem] pl-14 pr-14 text-white placeholder:text-slate-700 outline-none focus:border-primary/40 focus:bg-white/[0.04] transition-all"
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-600 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <button type="submit" className="w-full h-16 btn-enterprise text-lg blue-glow">
                Sign In to Platform <ArrowRight size={20} className="ml-2" />
              </button>
              
              <div className="relative py-4">
                 <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/5" /></div>
                 <div className="relative flex justify-center text-[11px] font-black uppercase tracking-widest text-slate-600">
                    <span className="bg-[#030303] px-4">Or continue with</span>
                 </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                 <button type="button" className="h-14 rounded-2xl glass-surface border-white/[0.05] flex items-center justify-center gap-3 text-white font-bold hover:bg-white/5 transition-all">
                    <Zap size={20} /> GitHub
                 </button>
                 <button type="button" className="h-14 rounded-2xl glass-surface border-white/[0.05] flex items-center justify-center gap-3 text-white font-bold hover:bg-white/5 transition-all">
                    <Settings size={18} /> Google
                 </button>
              </div>
            </div>
          </form>

          <p className="text-center text-slate-500 font-medium">
            Don't have an account? <Link to="/register" className="text-primary hover:text-white font-bold transition-colors">Create account</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
