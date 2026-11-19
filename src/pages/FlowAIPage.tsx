import React from 'react';
import { Sparkles, Database, ShieldCheck, Cpu } from 'lucide-react';
import { FlowAIChat } from '../components/ai/FlowAIChat';
import { useData } from '../context/DataContext';

export const FlowAIPage: React.FC = () => {
  const { leads, products, orders, invoices, geminiApiKey } = useData();

  return (
    <div className="space-y-4 flex flex-col h-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            <span>FlowAI Enterprise Copilot</span>
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Natural language enterprise intelligence, real-time query parsing & forecast generation.
          </p>
        </div>

        {/* Real-time Context Snapshot Badges */}
        <div className="flex items-center gap-2 text-xs">
          <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 flex items-center gap-1.5 font-medium">
            <Database className="w-3.5 h-3.5 text-blue-500" />
            <span>{leads.length} Leads • {products.length} Products • {orders.length} Orders</span>
          </span>
          <span className="px-3 py-1 rounded-full bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 flex items-center gap-1.5 font-bold">
            <Cpu className="w-3.5 h-3.5" />
            <span>{geminiApiKey ? 'Gemini 1.5 Active' : 'Offline Rule Engine'}</span>
          </span>
        </div>
      </div>

      {/* Main Interactive Chat Console */}
      <FlowAIChat />
    </div>
  );
};
