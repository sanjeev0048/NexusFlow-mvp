import React, { useState } from 'react';
import { 
  Settings, Key, Database, Shield, RefreshCw, CheckCircle2, AlertTriangle, Eye, EyeOff, Save, Layers, Sparkles 
} from 'lucide-react';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';

export const SettingsPage: React.FC = () => {
  const { user, isSupabaseActive } = useAuth();
  const { geminiApiKey, setGeminiApiKey, resetAllDemoData } = useData();

  const [inputKey, setInputKey] = useState(geminiApiKey || '');
  const [showKey, setShowKey] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);

  const handleSaveKey = (e: React.FormEvent) => {
    e.preventDefault();
    setGeminiApiKey(inputKey.trim());
  };

  const handleResetData = () => {
    resetAllDemoData();
    setConfirmReset(false);
  };

  return (
    <div className="space-y-6 max-w-4xl pb-16 animate-fadeIn">
      {/* Page Header */}
      <div className="pb-4 border-b border-white/[0.08]">
        <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-[#818CF8]/10 text-[#818CF8] text-[11px] font-mono border border-[#818CF8]/25 mb-1.5">
          <Settings className="w-3 h-3 text-[#2DD4BF]" />
          <span>Platform Infrastructure</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          System & Tenant Settings
        </h1>
        <p className="text-xs text-[#94A3B8] mt-1">
          Manage enterprise tenant configuration, Google Gemini intelligence keys and multi-tenant PostgreSQL state.
        </p>
      </div>

      {/* 1. Organization & Tenant Profile */}
      <Card className="p-6 space-y-4 border-white/[0.08]" elevated glowTop>
        <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
          <div className="flex items-center gap-2.5">
            <Layers className="w-5 h-5 text-[#818CF8]" />
            <h3 className="text-sm font-bold text-white tracking-tight">Organization Profile & Tenant</h3>
          </div>
          <Badge variant="purple">Enterprise Node</Badge>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block text-xs font-semibold text-[#94A3B8] mb-1">Company / Organization</label>
            <input
              type="text"
              readOnly
              value={user?.organizationName || 'NexusFlow Enterprise'}
              className="w-full p-2.5 bg-[#151F32] border border-white/[0.08] rounded-xl text-xs sm:text-sm text-white font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#94A3B8] mb-1">Tenant ID</label>
            <input
              type="text"
              readOnly
              value={user?.organizationId || 'tenant_nexus_prod_01'}
              className="w-full p-2.5 bg-[#151F32] border border-white/[0.08] rounded-xl text-xs sm:text-sm text-[#94A3B8] font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#94A3B8] mb-1">Active User</label>
            <input
              type="text"
              readOnly
              value={`${user?.name || 'Alex Morgan'} (${user?.email || 'alex@nexusflow.io'})`}
              className="w-full p-2.5 bg-[#151F32] border border-white/[0.08] rounded-xl text-xs sm:text-sm text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#94A3B8] mb-1">Role & Permissions</label>
            <input
              type="text"
              readOnly
              value={`${user?.role?.toUpperCase() || 'ADMIN'} • Superuser Access`}
              className="w-full p-2.5 bg-[#151F32] border border-white/[0.08] rounded-xl text-xs sm:text-sm text-[#2DD4BF] font-mono"
            />
          </div>
        </div>
      </Card>

      {/* 2. FlowAI & Gemini API Key */}
      <Card className="p-6 space-y-4 border-white/[0.08]" elevated glowTop>
        <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-5 h-5 text-[#818CF8]" />
            <div>
              <h3 className="text-sm font-bold text-white tracking-tight">FlowAI Intelligence Engine</h3>
              <p className="text-xs text-[#94A3B8]">Configure your Google Gemini 1.5 Pro API credentials</p>
            </div>
          </div>
          <Badge variant={geminiApiKey ? 'success' : 'warning'}>
            {geminiApiKey ? 'Gemini 1.5 Pro Active' : 'Offline Engine Fallback'}
          </Badge>
        </div>

        <form onSubmit={handleSaveKey} className="space-y-4 text-xs">
          <div>
            <label className="block text-xs font-semibold text-[#94A3B8] mb-1">Google Gemini API Key</label>
            <div className="relative">
              <input
                type={showKey ? 'text' : 'password'}
                value={inputKey}
                onChange={e => setInputKey(e.target.value)}
                placeholder="AIzaSy..."
                className="w-full p-2.5 pr-10 bg-[#151F32] border border-white/[0.08] rounded-xl text-xs sm:text-sm text-white font-mono placeholder-slate-500 focus:outline-none focus:border-[#818CF8]/60 transition"
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-[11px] text-[#94A3B8] mt-1">
              Obtain your free Gemini API key from <a href="https://aistudio.google.com" target="_blank" rel="noreferrer" className="text-[#818CF8] hover:underline">Google AI Studio</a>. Saved locally in your browser storage.
            </p>
          </div>

          <div className="flex items-center justify-end">
            <button
              type="submit"
              className="px-5 py-2.5 bg-[#818CF8] hover:bg-[#6366F1] text-[#080B14] font-bold rounded-xl text-xs flex items-center gap-2 shadow-glow-primary transition active:scale-95"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Gemini API Key</span>
            </button>
          </div>
        </form>
      </Card>

      {/* 3. Database & Supabase Connectivity */}
      <Card className="p-6 space-y-4 border-white/[0.08]" elevated>
        <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
          <div className="flex items-center gap-2.5">
            <Database className="w-5 h-5 text-[#2DD4BF]" />
            <div>
              <h3 className="text-sm font-bold text-white tracking-tight">Database Connectivity & Storage Mode</h3>
              <p className="text-xs text-[#94A3B8]">Multi-tenant PostgreSQL with Row-Level Security</p>
            </div>
          </div>
          <Badge variant={isSupabaseActive ? 'success' : 'default'}>
            {isSupabaseActive ? 'Cloud PostgreSQL' : 'Local Persistence'}
          </Badge>
        </div>

        <div className="p-4 rounded-xl bg-[#080B14] border border-white/[0.06] space-y-2 text-xs">
          <div className="flex items-center gap-2 text-white font-medium">
            <Shield className="w-4 h-4 text-[#2DD4BF]" />
            <span>Row-Level Security (RLS) Multi-Tenant Enforced</span>
          </div>
          <p className="text-[#94A3B8] leading-relaxed">
            {isSupabaseActive
              ? 'Your workspace is actively connected to Supabase PostgreSQL. Tables are isolated by organization_id.'
              : 'Running in Local Persistence Mode. Full interactive functionality is simulated using local browser storage.'}
          </p>
        </div>
      </Card>

      {/* 4. Danger Zone / Reset Demo Data */}
      <Card className="p-6 space-y-4 border-rose-500/25 bg-rose-500/[0.02]" elevated>
        <div className="flex items-center gap-2.5 text-rose-400">
          <AlertTriangle className="w-5 h-5" />
          <h3 className="text-sm font-bold tracking-tight">Reset Workspace Data</h3>
        </div>

        <p className="text-xs text-[#94A3B8]">
          Reset all leads, inventory SKUs, invoices, orders and expenses back to their default factory state.
        </p>

        {!confirmReset ? (
          <button
            onClick={() => setConfirmReset(true)}
            className="px-4 py-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 rounded-xl text-xs font-semibold transition"
          >
            Reset All Sample Data
          </button>
        ) : (
          <div className="flex items-center gap-3">
            <button
              onClick={handleResetData}
              className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold transition"
            >
              Confirm Factory Reset
            </button>
            <button
              onClick={() => setConfirmReset(false)}
              className="px-4 py-2 bg-white/[0.06] text-[#94A3B8] hover:text-white rounded-xl text-xs"
            >
              Cancel
            </button>
          </div>
        )}
      </Card>
    </div>
  );
};
