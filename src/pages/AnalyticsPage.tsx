import React, { useState } from 'react';
import { BarChart3, TrendingUp, TrendingDown, DollarSign, Calendar, Filter, Download } from 'lucide-react';
import { 
  BarChart, Bar, LineChart, Line, AreaChart, Area, XAxis, YAxis, 
  CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell 
} from 'recharts';
import { Card } from '../components/common/Card';
import { MetricCard } from '../components/common/MetricCard';
import { useData } from '../context/DataContext';
import { formatCurrency, exportToCSV } from '../lib/utils';

const financialAnalyticsData = [
  { month: 'Jan', revenue: 45000, expenses: 32000, profit: 13000, margin: 28.8 },
  { month: 'Feb', revenue: 52000, expenses: 34000, profit: 18000, margin: 34.6 },
  { month: 'Mar', revenue: 61000, expenses: 38000, profit: 23000, margin: 37.7 },
  { month: 'Apr', revenue: 58000, expenses: 35000, profit: 23000, margin: 39.6 },
  { month: 'May', revenue: 74000, expenses: 41000, profit: 33000, margin: 44.5 },
  { month: 'Jun', revenue: 89000, expenses: 45000, profit: 44000, margin: 49.4 }
];

const categoryData = [
  { name: 'Software', value: 45, color: '#3B82F6' },
  { name: 'Hardware', value: 30, color: '#10B981' },
  { name: 'Services', value: 15, color: '#F59E0B' },
  { name: 'Consulting', value: 10, color: '#8B5CF6' }
];

export const AnalyticsPage: React.FC = () => {
  const { leads, orders, expenses } = useData();
  const [timeRange, setTimeRange] = useState('H1');

  const totalRev = orders.reduce((s, o) => s + o.total, 0);
  const totalExp = expenses.reduce((s, e) => s + e.amount, 0);
  const netIncome = totalRev - totalExp;
  const avgDealSize = leads.length > 0 
    ? Math.round(leads.reduce((s, l) => s + l.value, 0) / leads.length) 
    : 0;

  const handleExport = () => {
    exportToCSV('NexusFlow_Financial_Analytics', financialAnalyticsData);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-blue-600" />
            <span>Advanced Enterprise Analytics</span>
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Multi-dimensional revenue forecasting, profit margins & deal conversion funnels.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-3.5 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 rounded-lg text-sm font-medium focus:outline-none shadow-sm"
          >
            <option value="Q1">Quarter 1 (Jan - Mar)</option>
            <option value="Q2">Quarter 2 (Apr - Jun)</option>
            <option value="H1">First Half (H1 2025)</option>
            <option value="Full">Full Fiscal Year</option>
          </select>
          <button
            onClick={handleExport}
            className="px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-semibold flex items-center gap-1.5 shadow-sm transition"
          >
            <Download className="w-4 h-4" /> Export Analytics
          </button>
        </div>
      </div>

      {/* Analytics KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <MetricCard
          title="Recorded Revenue Run-Rate"
          value={formatCurrency(totalRev)}
          change="+18.4% YoY"
          isPositive={true}
          icon={TrendingUp}
          colorClass="bg-emerald-500 text-emerald-600"
        />
        <MetricCard
          title="Operating Burn Rate"
          value={formatCurrency(totalExp)}
          change="-3.2% vs target"
          isPositive={true}
          icon={TrendingDown}
          colorClass="bg-rose-500 text-rose-600"
        />
        <MetricCard
          title="Net Operating Margin"
          value={formatCurrency(netIncome)}
          change="+41.2% ratio"
          isPositive={true}
          icon={DollarSign}
          colorClass="bg-blue-500 text-blue-600"
        />
        <MetricCard
          title="Average Deal Size"
          value={formatCurrency(avgDealSize)}
          change="+9.5% QoQ"
          isPositive={true}
          icon={BarChart3}
          colorClass="bg-purple-500 text-purple-600"
        />
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue vs Expenses BarChart */}
        <Card className="p-6">
          <div className="mb-4">
            <h3 className="text-base font-semibold text-slate-900 dark:text-white">Revenue vs Operating Expenditures</h3>
            <p className="text-xs text-slate-500">Monthly side-by-side financial comparison</p>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={financialAnalyticsData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="month" stroke="#9CA3AF" fontSize={12} />
                <YAxis stroke="#9CA3AF" fontSize={12} tickFormatter={(v) => `$${v/1000}k`} />
                <Tooltip formatter={(v: any) => [formatCurrency(Number(v)), '']} />
                <Legend />
                <Bar dataKey="revenue" fill="#3B82F6" name="Revenue ($)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="expenses" fill="#EF4444" name="Expenses ($)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Profit Margin Trend LineChart */}
        <Card className="p-6">
          <div className="mb-4">
            <h3 className="text-base font-semibold text-slate-900 dark:text-white">Net Profit Margin Progression</h3>
            <p className="text-xs text-slate-500">Operating margin percentage trajectory (%)</p>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={financialAnalyticsData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="month" stroke="#9CA3AF" fontSize={12} />
                <YAxis stroke="#9CA3AF" fontSize={12} unit="%" />
                <Tooltip formatter={(v: any) => [`${v}%`, 'Margin']} />
                <Legend />
                <Line type="monotone" dataKey="margin" stroke="#10B981" strokeWidth={3} dot={{ r: 5 }} name="Net Margin (%)" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Pipeline Stage Funnel Breakdown */}
      <Card className="p-6">
        <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-1">CRM Pipeline Conversion Funnel</h3>
        <p className="text-xs text-slate-500 mb-6">Distribution of prospect deal volume across sales pipeline stages</p>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {['New', 'Contacted', 'Qualified', 'Proposal', 'Closed Won', 'Closed Lost'].map((stage) => {
            const count = leads.filter(l => l.status === stage).length;
            const value = leads.filter(l => l.status === stage).reduce((s, l) => s + l.value, 0);

            return (
              <div key={stage} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">{stage}</span>
                <h4 className="text-xl font-bold text-slate-900 dark:text-white">{count} deals</h4>
                <span className="text-xs text-blue-600 dark:text-blue-400 font-semibold">{formatCurrency(value)}</span>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
};
