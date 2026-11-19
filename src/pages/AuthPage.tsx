import React, { useState } from 'react';
import { Layers, Shield, Sparkles, User, UserCheck, Briefcase } from 'lucide-react';
import { Page, UserRole } from '../types';
import { useAuth } from '../context/AuthContext';

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
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-blue-600/15 blur-[120px] pointer-events-none rounded-full" />

      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl relative z-10">
        {/* Brand header */}
        <div 
          className="flex items-center gap-3 justify-center mb-8 cursor-pointer"
          onClick={() => setPage('landing')}
        >
          <div className="w-10 h-10 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-md shadow-blue-500/20">
            <Layers className="w-6 h-6 text-white" />
          </div>
          <span className="font-bold text-2xl text-white tracking-tight">NexusFlow</span>
        </div>

        <h2 className="text-2xl font-bold text-white text-center mb-1.5">
          {mode === 'login' ? 'Sign in to workspace' : 'Create Enterprise Account'}
        </h2>
        <p className="text-xs text-slate-400 text-center mb-6">
          {isSupabaseActive 
            ? 'Supabase Cloud Authentication Active' 
            : 'Running in Local Demo Mode (Instant Access)'}
        </p>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'signup' && (
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="e.g. Alex Morgan"
                className="w-full px-4 py-2.5 bg-slate-800/80 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 text-sm transition"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Corporate Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="alex@nexusflow.io"
              className="w-full px-4 py-2.5 bg-slate-800/80 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 text-sm transition"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              className="w-full px-4 py-2.5 bg-slate-800/80 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 text-sm transition"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-semibold rounded-lg shadow-lg shadow-blue-600/30 transition mt-6 text-sm"
          >
            {loading ? 'Authenticating...' : mode === 'login' ? 'Sign In to Dashboard' : 'Create Organization Workspace'}
          </button>
        </form>

        {/* 1-Click Persona Quick Logins for seamless evaluation */}
        <div className="mt-6 pt-6 border-t border-slate-800 space-y-2">
          <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 text-center mb-2">
            Instant Demo Sign-In Personas
          </span>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleDemoLogin('admin')}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700/80 border border-slate-700 text-center transition group"
            >
              <Shield className="w-4 h-4 mx-auto text-blue-400 mb-1 group-hover:scale-110 transition-transform" />
              <span className="block text-[11px] font-bold text-white">Admin</span>
              <span className="block text-[9px] text-slate-400">VP Ops</span>
            </button>

            <button
              type="button"
              onClick={() => handleDemoLogin('sales')}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700/80 border border-slate-700 text-center transition group"
            >
              <Briefcase className="w-4 h-4 mx-auto text-indigo-400 mb-1 group-hover:scale-110 transition-transform" />
              <span className="block text-[11px] font-bold text-white">Sales</span>
              <span className="block text-[9px] text-slate-400">Account Exec</span>
            </button>

            <button
              type="button"
              onClick={() => handleDemoLogin('hr')}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700/80 border border-slate-700 text-center transition group"
            >
              <UserCheck className="w-4 h-4 mx-auto text-purple-400 mb-1 group-hover:scale-110 transition-transform" />
              <span className="block text-[11px] font-bold text-white">HR Lead</span>
              <span className="block text-[9px] text-slate-400">VP Eng/HR</span>
            </button>
          </div>
        </div>

        <div className="mt-6 text-center text-xs text-slate-400">
          {mode === 'login' ? (
            <p>
              Don't have an enterprise account?{' '}
              <button onClick={() => setPage('signup')} className="text-blue-400 hover:underline font-semibold">
                Sign up
              </button>
            </p>
          ) : (
            <p>
              Already registered?{' '}
              <button onClick={() => setPage('login')} className="text-blue-400 hover:underline font-semibold">
                Log in
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
