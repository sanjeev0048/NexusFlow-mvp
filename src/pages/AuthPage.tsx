import React, { useState } from 'react';
import { Shield, Sparkles, User, UserCheck, Briefcase, ArrowLeft } from 'lucide-react';
import { Page, UserRole } from '../types';
import { useAuth } from '../context/AuthContext';
import { NexusLogo } from '../components/common/NexusLogo';

interface AuthPageProps {
  mode: 'login' | 'signup';
  setPage: (p: Page) => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({ mode, setPage }) => {
  const { loginWithEmail, signUpWithEmail, loginAsDemoUser, isSupabaseActive } = useAuth();

  const [email, setEmail] = useState('demo@nexusflow.io');
  const [password, setPassword] = useState('password123');
  const [name, setName] = useState('Alex Morgan');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (mode === 'signup') {
        const res = await signUpWithEmail(name, email, password);
        if (res.error) {
          setError(res.error);
        } else {
          setPage('dashboard');
        }
      } else {
        const res = await loginWithEmail(email, password);
        if (res.error) {
          setError(res.error);
        } else {
          setPage('dashboard');
        }
      }
    } catch (err: any) {
      setError(err?.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = (role: UserRole) => {
    loginAsDemoUser(role);
    setPage('dashboard');
  };

  return (
    <div className="min-h-screen bg-[#080B14] flex items-center justify-center p-4 relative overflow-hidden font-sans selection:bg-[#818CF8]/30 selection:text-white">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-gradient-to-b from-[#818CF8]/18 to-[#2DD4BF]/10 blur-[130px] pointer-events-none rounded-full" />

      <div className="w-full max-w-md bg-[#101827] border border-white/10 rounded-3xl p-8 shadow-card-elevated relative z-10">
        {/* Top bar back button */}
        <button
          onClick={() => setPage('landing')}
          className="text-xs text-[#94A3B8] hover:text-white flex items-center gap-1.5 transition mb-6"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to overview</span>
        </button>

        {/* Brand header */}
        <div 
          className="flex items-center justify-center mb-6 cursor-pointer"
          onClick={() => setPage('landing')}
        >
          <NexusLogo size="lg" badge="Access Node" />
        </div>

        <h2 className="text-xl sm:text-2xl font-extrabold text-white text-center mb-1 tracking-tight">
          {mode === 'login' ? 'Sign in to workspace' : 'Create Enterprise Account'}
        </h2>
        <p className="text-xs text-[#94A3B8] text-center mb-6 font-mono">
          {isSupabaseActive 
            ? 'Supabase PostgreSQL Cloud RLS Active' 
            : 'Interactive Workspace Mode (Instant Access)'}
        </p>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-mono">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {mode === 'signup' && (
            <div>
              <label className="block text-xs font-semibold uppercase font-mono text-[#94A3B8] mb-1">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Alex Morgan"
                className="w-full px-4 py-2.5 bg-[#151F32] border border-white/[0.08] rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-[#818CF8]/60 text-xs sm:text-sm transition"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold uppercase font-mono text-[#94A3B8] mb-1">Corporate Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="alex@nexusflow.io"
              className="w-full px-4 py-2.5 bg-[#151F32] border border-white/[0.08] rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-[#818CF8]/60 text-xs sm:text-sm transition"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase font-mono text-[#94A3B8] mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              className="w-full px-4 py-2.5 bg-[#151F32] border border-white/[0.08] rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-[#818CF8]/60 text-xs sm:text-sm transition"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#818CF8] hover:bg-[#6366F1] disabled:opacity-50 text-[#080B14] font-bold rounded-xl shadow-glow-primary transition mt-6 text-xs sm:text-sm active:scale-95"
          >
            {loading ? 'Authenticating...' : mode === 'login' ? 'Sign In to Workspace' : 'Claim Enterprise Workspace'}
          </button>
        </form>

        {/* 1-Click Persona Quick Logins for seamless evaluation */}
        <div className="mt-6 pt-6 border-t border-white/[0.08] space-y-2">
          <span className="block text-[10px] font-bold uppercase tracking-wider text-[#94A3B8] text-center mb-2 font-mono">
            Instant Demo Sign-In Personas
          </span>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleDemoLogin('admin')}
              className="p-2.5 rounded-xl bg-[#151F32] hover:bg-white/[0.08] border border-white/[0.08] text-center transition group active:scale-95"
            >
              <Shield className="w-4 h-4 mx-auto text-[#818CF8] mb-1 group-hover:scale-110 transition-transform" />
              <span className="block text-[11px] font-bold text-white">Admin</span>
              <span className="block text-[9px] text-[#94A3B8] font-mono">Executive</span>
            </button>

            <button
              type="button"
              onClick={() => handleDemoLogin('sales')}
              className="p-2.5 rounded-xl bg-[#151F32] hover:bg-white/[0.08] border border-white/[0.08] text-center transition group active:scale-95"
            >
              <Briefcase className="w-4 h-4 mx-auto text-[#2DD4BF] mb-1 group-hover:scale-110 transition-transform" />
              <span className="block text-[11px] font-bold text-white">Sales</span>
              <span className="block text-[9px] text-[#94A3B8] font-mono">Pipeline Rep</span>
            </button>

            <button
              type="button"
              onClick={() => handleDemoLogin('hr')}
              className="p-2.5 rounded-xl bg-[#151F32] hover:bg-white/[0.08] border border-white/[0.08] text-center transition group active:scale-95"
            >
              <UserCheck className="w-4 h-4 mx-auto text-amber-400 mb-1 group-hover:scale-110 transition-transform" />
              <span className="block text-[11px] font-bold text-white">HR Lead</span>
              <span className="block text-[9px] text-[#94A3B8] font-mono">People Ops</span>
            </button>
          </div>
        </div>

        <div className="mt-6 text-center text-xs text-[#94A3B8]">
          {mode === 'login' ? (
            <p>
              Need a new organization?{' '}
              <button onClick={() => setPage('signup')} className="text-[#818CF8] hover:underline font-semibold">
                Sign up
              </button>
            </p>
          ) : (
            <p>
              Already registered?{' '}
              <button onClick={() => setPage('login')} className="text-[#818CF8] hover:underline font-semibold">
                Sign in
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
