import React, { useState } from 'react';
import { 
  Settings, Key, Database, Shield, RefreshCw, CheckCircle2, AlertTriangle, Eye, EyeOff, Save, Layers 
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
    <div className="space-y-6 max-w-4xl pb-12">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Settings className="w-6 h-6 text-blue-600" />
          <span>System & Workspace Settings</span>
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Manage organization profile, FlowAI API keys, and multi-tenant database connectivity.
        </p>
      </div>

      {/* 1. Organization & Tenant Profile */}
      <Card className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-blue-600" />
            <h3 className="text-base font-semibold text-slate-900 dark:text-white">Organization Tenant Profile</h3>
          </div>
          <Badge variant="purple">Enterprise Tier</Badge>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Company / Organization Name</label>
            <input
              type="text"
              readOnly
              value={user?.organizationName || 'NexusFlow Technologies Inc.'}
              className="w-full p-2.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Tenant ID (Row Level Security)</label>
            <input
              type="text"
              readOnly
              value={user?.organizationId || 'org-demo-001'}
              className="w-full p-2.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-mono text-slate-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Current User</label>
            <input
              type="text"
              readOnly
              value={`${user?.name} (${user?.email})`}
              className="w-full p-2.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Active Role</label>
            <input
              type="text"
              readOnly
              value={user?.role?.toUpperCase()}
              className="w-full p-2.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-bold text-blue-600 dark:text-blue-400"
            />
          </div>
        </div>
      </Card>

      {/* 2. Google Gemini API Configuration */}
      <Card className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Key className="w-5 h-5 text-purple-600" />
            <h3 className="text-base font-semibold text-slate-900 dark:text-white">Google Gemini API Configuration</h3>
          </div>
          <Badge variant={geminiApiKey ? 'success' : 'default'}>
            {geminiApiKey ? 'API Configured' : 'Using Local Fallback Engine'}
          </Badge>
        </div>

        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
          FlowAI integrates with Google Gemini (<code>gemini-1.5-flash</code>) to provide natural language querying across CRM leads, inventory stock, invoices, and attendance logs. If no key is set, NexusFlow seamlessly uses its built-in enterprise contextual rule engine.
        </p>

        <form onSubmit={handleSaveKey} className="space-y-3">
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
              Gemini API Key (stored locally in browser storage)
            </label>
            <div className="relative">
              <input
                type={showKey ? 'text' : 'password'}
                value={inputKey}
                onChange={e => setInputKey(e.target.value)}
                placeholder="AIzaSy..."
                className="w-full pr-10 pl-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white font-mono focus:outline-none focus:border-blue-500"
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <span className="text-[11px] text-slate-400">
              Can also be provided via <code>VITE_GEMINI_API_KEY</code> in <code>.env</code>
            </span>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-sm transition"
            >
              <Save className="w-3.5 h-3.5" /> Save Gemini Key
            </button>
          </div>
        </form>
      </Card>

      {/* 3. Supabase Cloud Connection & RLS Status */}
      <Card className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Database className="w-5 h-5 text-emerald-600" />
            <h3 className="text-base font-semibold text-slate-900 dark:text-white">Supabase Multi-Tenant Database</h3>
          </div>
          <Badge variant={isSupabaseActive ? 'success' : 'warning'}>
            {isSupabaseActive ? 'Supabase Connected' : 'Demo Mode (Offline Storage)'}
          </Badge>
        </div>

        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80 space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-slate-500 font-medium">Database Status:</span>
            <span className="font-bold text-slate-800 dark:text-slate-200">
              {isSupabaseActive ? 'Online (Supabase Cloud)' : 'Local Storage Engine (Active Demo Mode)'}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-500 font-medium">Tenant Isolation:</span>
            <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              <Shield className="w-3.5 h-3.5" /> PostgreSQL RLS Active
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-500 font-medium">Migration Script:</span>
            <span className="font-mono text-slate-600 dark:text-slate-400">
              supabase/migrations/20250101_init_schema.sql
            </span>
          </div>
        </div>

        <p className="text-xs text-slate-500 dark:text-slate-400">
          To connect your own live Supabase project, populate <code>VITE_SUPABASE_URL</code> and <code>VITE_SUPABASE_ANON_KEY</code> in your <code>.env</code> file and execute the included SQL migration.
        </p>
      </Card>

      {/* 4. Reset Demo Workspace Data */}
      <Card className="p-6 space-y-4 border-rose-200 dark:border-rose-950/60">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <RefreshCw className="w-5 h-5 text-rose-500" />
            <h3 className="text-base font-semibold text-slate-900 dark:text-white">Demo Workspace Management</h3>
          </div>
        </div>

        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
          Need a clean slate? Reset all CRM leads, inventory stock quantities, sales orders, billing invoices, corporate expenses, and employee attendance logs back to the initial sample seed data.
        </p>

        {!confirmReset ? (
          <button
            type="button"
            onClick={() => setConfirmReset(true)}
            className="px-4 py-2 border border-rose-300 dark:border-rose-800 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg text-xs font-semibold transition"
          >
            Reset Workspace to Default Demo Data
          </button>
        ) : (
          <div className="flex items-center gap-3">
            <span className="text-xs text-rose-600 font-bold">Are you sure?</span>
            <button
              onClick={handleResetData}
              className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-semibold shadow-sm transition"
            >
              Yes, Reset Now
            </button>
            <button
              onClick={() => setConfirmReset(false)}
              className="px-3 py-1.5 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-medium"
            >
              Cancel
            </button>
          </div>
        )}
      </Card>
    </div>
  );
};
