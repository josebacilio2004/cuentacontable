import React, { useState } from 'react';
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight,
  Fingerprint,
  Users,
  Wallet
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Card } from '../components/UI';
import { cn } from '../lib/utils';

import { supabase } from '../lib/supabase';

interface LoginProps {
  onLogin: () => void;
}

const users = [
  { id: 'jose', name: 'Jose', email: 'baciliodelacruz.2004@gmail.com', pass: 'josebac2004A$', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex' },
  { id: 'samira', name: 'Samira', email: 'sxchecya-es@udabol.edu.bo', pass: '60621566ssam', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah' },
];

export function LoginPage({ onLogin }: LoginProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSelectUser = (user: typeof users[0]) => {
    setEmail(user.email);
    setPassword(user.pass);
    setError(null);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setIsLoading(false);
    } else {
      onLogin();
    }
  };

  return (
    <div className="fixed inset-0 z-[1000] bg-[#050811] flex flex-col lg:flex-row overflow-hidden font-sans">
      
      {/* Left Panel: Branding & Concept */}
      <div className="hidden lg:flex lg:w-7/12 relative flex-col justify-end p-20 overflow-hidden bg-[#02040a]">
        {/* Abstract Dynamic Background (Crystallized Wave Effect) */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[140%] bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.08)_0%,transparent_70%)] opacity-50"></div>
          
          {/* SVG Wave Pattern to simulate the "crystallized" look from the image */}
          <svg className="absolute bottom-0 left-0 w-full h-2/3 text-indigo-500/10" viewBox="0 0 1000 1000" preserveAspectRatio="none">
             <path d="M0,1000 C300,800 400,950 700,700 C900,550 1000,650 1000,500 L1000,1000 L0,1000 Z" fill="currentColor" />
             <path d="M0,1000 C200,850 500,800 800,600 C950,450 1000,550 1000,1000 L0,1000 Z" fill="currentColor" opacity="0.5" />
          </svg>
          
          {/* Animated Particles/Sparks */}
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10"></div>
        </div>

        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="relative z-10 max-w-xl"
        >
          <h2 className="text-6xl font-bold text-white leading-[1.1] tracking-tighter mb-8">
            The future of personal finance, <span className="text-indigo-400">crystallized.</span>
          </h2>
          <p className="text-xl text-slate-400/80 leading-relaxed font-medium">
            Experience institutional-grade analytics with the clarity of a modern consumer tool.
          </p>
        </motion.div>
      </div>

      {/* Right Panel: Login Form */}
      <div className="flex-1 flex flex-col bg-[#050811] relative border-l border-white/5">
        
        {/* Top Bar Navigation */}
        <div className="p-8 flex justify-between items-center relative z-20">
          <div className="flex items-center gap-4 group cursor-pointer">
             <span className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] group-hover:text-slate-300 transition-colors">Select Account</span>
             <div className="flex -space-x-2">
                {users.map(u => (
                  <button 
                    key={u.id} 
                    onClick={() => handleSelectUser(u)}
                    className="relative hover:z-20 hover:scale-110 transition-all"
                  >
                    <img src={u.avatar} title={u.name} className="w-8 h-8 rounded-full border-2 border-[#050811] ring-1 ring-white/10" alt={u.name} />
                  </button>
                ))}
             </div>
          </div>
          
          <div className="flex items-center gap-3">
             <span className="text-sm font-bold text-white tracking-widest uppercase">CuentaContable</span>
             <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-indigo-600/30">
                <Wallet className="w-5 h-5" />
             </div>
          </div>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center p-8 lg:p-16">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="w-full max-w-sm"
          >
            <div className="mb-10 text-center lg:text-left">
              <h1 className="text-3xl font-bold text-white mb-3">Welcome back</h1>
              <p className="text-sm text-slate-500 font-medium leading-relaxed">
                Enter your credentials to access your treasury.
              </p>
            </div>

            {error && (
              <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-bold animate-in fade-in slide-in-from-top-2">
                {error}
              </div>
            )}

            <Card className="p-0 border-none bg-transparent shadow-none">
              <form onSubmit={handleLogin} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Email Address</label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-indigo-400 transition-colors" size={16} />
                    <input 
                      required
                      type="email" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@cuentacontable.com"
                      className="w-full bg-[#0d121f] border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-sm text-white focus:ring-1 focus:ring-indigo-500/50 outline-none transition-all hover:bg-[#131929]"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center px-1">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Password</label>
                    <button type="button" className="text-[10px] font-bold text-indigo-400 hover:text-indigo-300 transition-colors uppercase tracking-widest">Forgot?</button>
                  </div>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-indigo-400 transition-colors" size={16} />
                    <input 
                      required
                      type={showPassword ? "text" : "password"} 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-[#0d121f] border border-white/5 rounded-2xl py-4 pl-12 pr-12 text-sm text-white focus:ring-1 focus:ring-indigo-500/50 outline-none transition-all hover:bg-[#131929]"
                    />
                    <button 
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-400 transition-colors"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <button 
                  type="submit"
                  disabled={isLoading}
                  className={cn(
                    "w-full bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-3 hover:opacity-90 active:scale-[0.98] transition-all shadow-xl shadow-indigo-600/20 disabled:opacity-50",
                    isLoading && "animate-pulse"
                  )}
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <span>Authorize Access</span>
                      <ArrowRight size={20} />
                    </>
                  )}
                </button>
              </form>

              <div className="mt-12 space-y-6">
                <div className="relative text-center">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-white/5"></div>
                  </div>
                  <span className="relative px-4 text-[10px] font-bold text-slate-600 uppercase tracking-widest bg-[#050811]">Or authenticate with</span>
                </div>

                <div className="flex justify-center gap-4">
                  <AuthOption icon={<Users size={16} />} />
                  <AuthOption icon={<Fingerprint size={16} />} />
                  <AuthOption icon={<div className="w-4 h-4 bg-white/10 rounded-full" />} />
                </div>
              </div>
            </Card>
          </motion.div>
          
          <div className="mt-16 text-center">
             <p className="text-xs text-slate-500 font-medium">
                Don't have an account? <button className="text-indigo-400 font-bold hover:underline">Request Invitation</button>
             </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function AuthOption({ icon }: { icon: React.ReactNode }) {
  return (
    <button className="w-16 h-12 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center text-slate-400 hover:bg-white/10 hover:text-white hover:border-white/20 transition-all">
       {icon}
    </button>
  );
}
