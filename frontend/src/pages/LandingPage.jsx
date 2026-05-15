import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, Zap, Lock, ArrowRight, ChevronDown,
  Play, Menu, X
} from 'lucide-react';
import { cn } from '../utils/cn';

const NavItem = ({ label, children }) => (
  <div className="group relative">
    <button className="flex items-center gap-1.5 text-[13px] font-bold text-slate-400 transition-all duration-300 hover:text-white py-2">
      {label}
      {children && <ChevronDown size={12} className="transition-transform duration-300 group-hover:rotate-180" />}
    </button>
    {children && (
      <div className="absolute top-full left-0 mt-3 w-64 p-2 rounded-2xl glass-surface opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-500 transform origin-top translate-y-2 group-hover:translate-y-0 z-50">
        <div className="space-y-1">{children}</div>
      </div>
    )}
  </div>
);

const FeatureCard = ({ icon: Icon, title, desc, color, delay }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay, duration: 0.8 }}
    className="group p-8 rounded-[2.5rem] glass-card relative overflow-hidden h-full"
  >
    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" 
         style={{ background: `radial-gradient(circle at top right, ${color}10, transparent 70%)` }} />
    <div className="relative z-10">
      <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-all duration-500 group-hover:scale-110"
           style={{ background: `${color}05`, border: `1px solid ${color}20` }}>
        <Icon size={24} style={{ color }} />
      </div>
      <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
      <p className="text-slate-500 leading-relaxed text-sm font-medium">{desc}</p>
    </div>
  </motion.div>
);

export default function LandingPage() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="bg-[#030303] min-h-screen relative selection:bg-primary/30 selection:text-white overflow-x-hidden text-foreground">
      {/* Background System */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="mesh-gradient absolute inset-0 opacity-40" />
        <div className="noise-bg absolute inset-0" />
      </div>

      {/* Navbar */}
      <nav className={cn(
        "fixed top-0 inset-x-0 z-[100] transition-all duration-700 py-6",
        isScrolled ? "bg-black/60 backdrop-blur-2xl border-b border-white/[0.05] py-4" : "bg-transparent"
      )}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-16">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center blue-glow transition-all duration-500 group-hover:rotate-12 group-hover:scale-110">
                <Shield size={22} className="text-white" />
              </div>
              <span className="font-display text-xl tracking-tighter text-white">AccessCore</span>
            </Link>
            
            <div className="hidden lg:flex items-center gap-10">
              <NavItem label="Product">
                <div className="p-3 text-[13px] text-slate-300 font-bold">Identity Engine</div>
              </NavItem>
              <NavItem label="Solutions" />
              <Link to="#" className="text-[13px] font-bold text-slate-400 hover:text-white transition-colors">Pricing</Link>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Link to="/login" className="hidden sm:block text-[13px] font-bold text-slate-400 hover:text-white transition-colors px-4">
              Log In
            </Link>
            <Link to="/register" className="btn-enterprise">
              Start Building <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-64 pb-32 px-6 z-10">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full glass-surface border-white/[0.08] text-[11px] font-black tracking-[0.2em] text-primary uppercase mb-12"
          >
            <Zap size={14} className="fill-primary" />
            Empowering the next billion users
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.1 }}
            className="text-6xl md:text-[8rem] font-display text-white mb-10 tracking-tighter leading-[0.85]"
          >
            Security that <br /> 
            <span className="gradient-text italic">evolves</span> with you.
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto mb-16 leading-relaxed font-medium"
          >
            The universal standard for infrastructure security. Integrate enterprise-grade identity, RBAC, and audit logs into your stack in minutes.
          </motion.p>

          <div className="flex flex-wrap items-center justify-center gap-6">
            <Link to="/register" className="btn-enterprise h-14 px-10 text-base">
              Get Started for Free <Zap size={18} className="fill-black" />
            </Link>
            <button className="btn-secondary-glass h-14 px-10 text-base group">
              <Play size={18} className="mr-2 fill-white group-hover:scale-110 transition-transform" /> Watch Demo
            </button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-40 px-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={Shield} title="Identity Engine" color="#2952ff" delay={0.1}
              desc="Proprietary resolution system that handles millions of auth events per second." 
            />
            <FeatureCard 
              icon={Lock} title="Secret Orchestration" color="#10b981" delay={0.2}
              desc="Automated rotation and end-to-end encryption for every piece of metadata." 
            />
            <FeatureCard 
              icon={Shield} title="Audit Streams" color="#f59e0b" delay={0.3}
              desc="Immutable real-time audit trails with automated anomaly detection." 
            />
          </div>
        </div>
      </section>
    </div>
  );
}
