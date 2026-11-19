import React, { useState } from 'react';
import { BarChart3, TrendingUp, TrendingDown, DollarSign, Calendar, Filter, Download, Activity, Zap } from 'lucide-react';
import { 
  BarChart, Bar, LineChart, Line, AreaChart, Area, XAxis, YAxis, 
  CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell 
} from 'recharts';
import { Card } from '../components/common/Card';
import { MetricCard } from '../components/common/MetricCard';
import { Badge } from '../components/common/Badge';
import { useData } from '../context/DataContext';
import { formatCurrency, exportToCSV } from '../lib/utils';

const financialAnalyticsData = [
  { month: 'Jan', revenue: 45000, expenses: 32000, profit: 13000, margin: 28.8 },
  { month: 'Feb', revenue: 52000, expenses: 34000, profit: 18000, margin: 34.6 },
  { month: 'Mar', revenue: 61000, expenses: 38000, profit: 23000, margin: 37.7 },
  { month: 'Apr', revenue: 58000, expenses: 35000, profit: 23000, margin: 39.6 },
  { month: 'May', revenue: 74000, expenses: 41000, profit: 33000, margin: 44.5 },
  { month: 'Jun', revenue: 89450, expenses: 45000, profit: 44450, margin: 49.6 }
];

const categoryData = [
  { name: 'Software Licenses', value: 45, color: '#818CF8' },
  { name: 'Edge Hardware', value: 30, color: '#2DD4BF' },
  { name: 'Implementation Services', value: 15, color: '#F59E0B' },
  { name: 'Advisory Retainer', value: 10, color: '#A855F7' }
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
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-[#818CF8]/10 text-[#818CF8] text-[11px] font-mono border border-[#818CF8]/25 mb-1.5">
            <BarChart3 className="w-3 h-3 text-[#2DD4BF]" />
            <span>Multi-Dimensional Modeling</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Advanced Enterprise Analytics
          </h1>
          <p className="text-xs text-[#94A3B8] mt-1">
            Revenue velocity, operational margins, SKU sales composition and deal conversion funnels.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-3.5 py-2 bg-[#101827] border border-white/[0.08] text-white rounded-xl text-xs font-mono focus:outline-none cursor-pointer"
          >
            <option value="Q1" className="bg-[#101827]">Q1 2026</option>
            <option value="Q2" className="bg-[#101827]">Q2 2026</option>
            <option value="H1" className="bg-[#101827]">H1 2026 (YTD)</option>
            <option value="FY2026" className="bg-[#101827]">FY 2026 Projected</option>
          </select>

          <button
            onClick={handleExport}
            className="px-3.5 py-2 bg-[#101827] hover:bg-[#151F32] border border-white/[0.08] text-[#94A3B8] hover:text-white rounded-xl text-xs font-medium flex items-center gap-1.5 transition shadow-card-subtle"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Analytics</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Gross Billed Run-Rate"
          value={formatCurrency(totalRev)}
          change="+18.4%"
          isPositive={true}
          icon={TrendingUp}
          subtitle="Orders fulfilled year-to-date"
        />
        <MetricCard
          title="Net Operating Margin"
          value={formatCurrency(netIncome)}
          change="+12.2%"
          isPositive={true}
          icon={DollarSign}
          subtitle="49.6% capital margin efficiency"
        />
        <MetricCard
          title="Average Deal Size"
          value={formatCurrency(avgDealSize)}
          change="+6.8%"
          isPositive={true}
          icon={Activity}
          subtitle="Across active CRM funnel"
        />
        <MetricCard
          title="Operating Expenditure"
          value={formatCurrency(totalExp)}
          change="-4.1%"
          isPositive={true}
          icon={TrendingDown}
          subtitle="Controlled capital outflow"
        />
      </div>

      {/* Main Charts: Revenue & Margin Progression */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <Card className="lg:col-span-2 p-6 flex flex-col justify-between" elevated glowTop>
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-white tracking-tight">Revenue vs. Operating Outflow</h3>
                <p className="text-xs text-[#94A3B8]">Monthly cash velocity comparison and net retained capital</p>
              </div>
              <Badge variant="purple" dot>Vector Synced</Badge>
            </div>

            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={financialAnalyticsData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="anRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#818CF8" stopOpacity={0.35}/>
                      <stop offset="95%" stopColor="#818CF8" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="anExp" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#F43F5E" stopOpacity={0.25}/>
                      <stop offset="95%" stopColor="#F43F5E" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.05)" />
                  <XAxis dataKey="month" stroke="#94A3B8" fontSize={11} tickLine={false} />
                  <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} tickFormatter={(v) => `$${v/1000}k`} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#101827', 
                      borderColor: 'rgba(255, 255, 255, 0.12)', 
                      borderRadius: '12px',
                      boxShadow: '0 8px 32px rgba(0,0,0,0.7)',
                      fontSize: '12px'
                    }}
                    formatter={(val: any) => [formatCurrency(Number(val)), 'Amount']}
                  />
                  <Area type="monotone" dataKey="revenue" name="Gross Revenue" stroke="#818CF8" strokeWidth={2.5} fillOpacity={1} fill="url(#anRev)" />
                  <Area type="monotone" dataKey="expenses" name="Expenses" stroke="#F43F5E" strokeWidth={2} fillOpacity={1} fill="url(#anExp)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between text-xs text-[#94A3B8] font-mono">
            <span className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#818CF8]" /> Gross Revenue
            </span>
            <span className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500" /> Operational Outflow
            </span>
          </div>
        </Card>

        {/* Product Category Distribution */}
        <Card className="p-6 flex flex-col justify-between" elevated glowTop>
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-white tracking-tight">Revenue Mix</h3>
              <span className="text-xs font-mono text-[#94A3B8]">100% Total</span>
            </div>
            <p className="text-xs text-[#94A3B8] mb-4">
              Sales volume distribution across software licenses, edge hardware and services.
            </p>

            <div className="h-52 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#101827', 
                      borderColor: 'rgba(255, 255, 255, 0.12)', 
                      borderRadius: '12px',
                      fontSize: '12px'
                    }}
                    formatter={(v: any) => [`${v}%`, 'Share']}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="space-y-2 pt-3 border-t border-white/[0.06] text-xs">
            {categoryData.map(item => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-[#94A3B8]">{item.name}</span>
                </div>
                <span className="font-mono font-bold text-white tabular-nums">{item.value}%</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Monthly Profit Margin Breakdown Table */}
      <Card className="p-6 border-white/[0.08]" elevated>
        <h3 className="text-base font-bold text-white tracking-tight mb-4">
          Monthly Fiscal Health & Capital Efficiency Ledger
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-white/[0.08] text-[11px] font-mono uppercase tracking-wider text-[#94A3B8]">
                <th className="pb-3">Reporting Period</th>
                <th className="pb-3">Gross Revenue</th>
                <th className="pb-3">Operating Expenses</th>
                <th className="pb-3">Net Operating Profit</th>
                <th className="pb-3">Profit Margin %</th>
                <th className="pb-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {financialAnalyticsData.map(row => (
                <tr key={row.month} className="hover:bg-white/[0.02]">
                  <td className="py-3 font-bold text-white font-mono">{row.month} 2026</td>
                  <td className="py-3 font-mono text-white tabular-nums">{formatCurrency(row.revenue)}</td>
                  <td className="py-3 font-mono text-rose-400 tabular-nums">-{formatCurrency(row.expenses)}</td>
                  <td className="py-3 font-mono font-bold text-[#2DD4BF] tabular-nums">{formatCurrency(row.profit)}</td>
                  <td className="py-3 font-mono font-bold text-white tabular-nums">{row.margin}%</td>
                  <td className="py-3 text-right">
                    <Badge variant="success">Reconciled</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
