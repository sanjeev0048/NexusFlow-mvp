import React, { useState, useMemo } from 'react';
import { 
  DollarSign, Users, ShoppingCart, Receipt, ArrowUpRight, ArrowDownRight, 
  Download, Filter, Sparkles, Plus, Package, Clock, ShieldCheck, Activity,
  Briefcase, CheckCircle2, AlertTriangle, ArrowRight, Zap, TrendingUp
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, BarChart, Bar 
} from 'recharts';
import { Card } from '../components/common/Card';
import { MetricCard } from '../components/common/MetricCard';
import { Badge } from '../components/common/Badge';
import { Page, Lead, Order } from '../types';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { formatCurrency, formatDate, exportToCSV } from '../lib/utils';

const revenueMonthlyTrend = [
  { month: 'Jan', revenue: 45000, expenses: 32000, profit: 13000 },
  { month: 'Feb', revenue: 52000, expenses: 34000, profit: 18000 },
  { month: 'Mar', revenue: 61000, expenses: 38000, profit: 23000 },
  { month: 'Apr', revenue: 58000, expenses: 35000, profit: 23000 },
  { month: 'May', revenue: 74000, expenses: 41000, profit: 33000 },
  { month: 'Jun', revenue: 89000, expenses: 45000, profit: 44000 }
];

const categoryData = [
  { name: 'Cloud Software', value: 45, color: '#818CF8' },
  { name: 'Edge Hardware', value: 30, color: '#2DD4BF' },
  { name: 'Security Audit', value: 15, color: '#F59E0B' },
  { name: 'Advisory Retainer', value: 10, color: '#A855F7' }
];

interface DashboardPageProps {
  setPage: (p: Page) => void;
  onOpenNewLead: () => void;
  onOpenNewProduct: () => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ 
  setPage, 
  onOpenNewLead, 
  onOpenNewProduct 
}) => {
  const { user } = useAuth();
  const { leads, orders, invoices, products, expenses, updateLeadStatus } = useData();

  const [chartView, setChartView] = useState<'revenue' | 'netProfit'>('revenue');

  const totalRevenue = useMemo(() => orders.reduce((acc, o) => acc + o.total, 0), [orders]);
  const totalExpenses = useMemo(() => expenses.reduce((acc, e) => acc + e.amount, 0), [expenses]);
  const netIncome = totalRevenue - totalExpenses;
  const activeLeads = useMemo(() => leads.filter(l => l.status !== 'Closed Lost'), [leads]);
  const totalPipeline = useMemo(() => activeLeads.reduce((s, l) => s + l.value, 0), [activeLeads]);
  const lowStockCount = useMemo(() => products.filter(p => p.stock <= p.lowStockThreshold).length, [products]);
  const pendingInvoicesTotal = useMemo(() => 
    invoices.filter(i => i.status === 'Pending' || i.status === 'Overdue').reduce((acc, i) => acc + i.totalAmount, 0),
    [invoices]
  );

  // Time greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const todayDate = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  });

  const handleExportSummary = () => {
    const summaryRow = [{
      TotalRevenue: totalRevenue,
      TotalExpenses: totalExpenses,
      NetOperatingMargin: netIncome,
      ActivePipelineValue: totalPipeline,
      ActiveLeadsCount: activeLeads.length,
      LowStockAlerts: lowStockCount,
      PendingReceivables: pendingInvoicesTotal,
      ExportDate: new Date().toISOString()
    }];
    exportToCSV('NexusFlow_CommandCenter_Snapshot', summaryRow);
  };

  return (
    <div className="space-y-6 pb-8">
      {/* 1. TOP SECTION: Sophisticated Header & Command Actions */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-2 border-b border-white/[0.06]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-mono text-[#818CF8] bg-[#818CF8]/10 px-2 py-0.5 rounded-md border border-[#818CF8]/20 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#2DD4BF] animate-pulse" />
              <span>{user?.organizationName || 'NexusFlow Enterprise'}</span>
            </span>
            <span className="text-white/20">•</span>
            <span className="text-xs font-mono text-[#94A3B8]">{todayDate}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            {getGreeting()}, {user?.name?.split(' ')[0] || 'Executive'}
          </h1>
          <p className="text-xs text-[#94A3B8] mt-0.5">
            Operational telemetry is active. All {activeLeads.length} active opportunities and catalog buffers are synchronized.
          </p>
        </div>

        {/* Quick Create Actions */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setPage('flow-ai')}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-[#818CF8]/15 hover:bg-[#818CF8]/25 text-[#818CF8] border border-[#818CF8]/30 flex items-center gap-1.5 transition active:scale-95 shadow-glow-primary"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Ask FlowAI</span>
          </button>
          <button
            onClick={onOpenNewLead}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-white/[0.05] hover:bg-white/[0.09] text-[#F8FAFC] border border-white/10 flex items-center gap-1.5 transition active:scale-95"
          >
            <Plus className="w-3.5 h-3.5 text-[#2DD4BF]" />
            <span>New Lead</span>
          </button>
          <button
            onClick={onOpenNewProduct}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-white/[0.05] hover:bg-white/[0.09] text-[#F8FAFC] border border-white/10 flex items-center gap-1.5 transition active:scale-95"
          >
            <Plus className="w-3.5 h-3.5 text-[#818CF8]" />
            <span>Add SKU</span>
          </button>
          <button
            onClick={handleExportSummary}
            className="p-2 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] text-slate-400 hover:text-white border border-white/[0.08] transition"
            title="Export Command Center Snapshot"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 2. REFINED KPI METRIC CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Recorded Revenue"
          value={formatCurrency(totalRevenue)}
          change="+14.2%"
          isPositive={true}
          icon={DollarSign}
          subtitle={`${orders.length} fulfilled client orders`}
        />
        <MetricCard
          title="Active Deal Pipeline"
          value={formatCurrency(totalPipeline)}
          change="+8.1%"
          isPositive={true}
          icon={Users}
          subtitle={`${activeLeads.length} prospects in active stages`}
        />
        <MetricCard
          title="Warehouse Buffers"
          value={`${products.length} Items`}
          change={lowStockCount > 0 ? `${lowStockCount} alerts` : 'Optimal'}
          isPositive={lowStockCount === 0}
          icon={Package}
          subtitle={lowStockCount > 0 ? 'Action required on hardware' : 'All buffer limits healthy'}
        />
        <MetricCard
          title="Pending Receivables"
          value={formatCurrency(pendingInvoicesTotal)}
          change="+5.3%"
          isPositive={true}
          icon={Receipt}
          subtitle={`${invoices.filter(i => i.status === 'Pending').length} invoices awaiting payment`}
        />
      </div>

      {/* 3. ASYMMETRIC BENTO GRID: REVENUE HERO + HEALTH SCORECARD */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Hero Revenue Performance Card (2 Cols) */}
        <Card className="lg:col-span-2 p-6 flex flex-col justify-between relative overflow-hidden" elevated>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white tracking-tight">Revenue Performance Run-Rate</h3>
                <Badge variant="purple" dot>Live Sync</Badge>
              </div>
              <p className="text-xs text-[#94A3B8] mt-0.5">
                Monthly revenue generation trajectory vs operating expenditure
              </p>
            </div>

            {/* View Switcher Pill */}
            <div className="flex items-center p-1 bg-[#080B14] rounded-xl border border-white/[0.08] text-xs">
              <button
                onClick={() => setChartView('revenue')}
                className={`px-3 py-1 rounded-lg font-medium transition ${
                  chartView === 'revenue' 
                    ? 'bg-white/[0.1] text-white shadow-sm' 
                    : 'text-[#94A3B8] hover:text-white'
                }`}
              >
                Gross Revenue
              </button>
              <button
                onClick={() => setChartView('netProfit')}
                className={`px-3 py-1 rounded-lg font-medium transition ${
                  chartView === 'netProfit' 
                    ? 'bg-white/[0.1] text-white shadow-sm' 
                    : 'text-[#94A3B8] hover:text-white'
                }`}
              >
                Operating Profit
              </button>
            </div>
          </div>

          {/* Area Chart Container */}
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueMonthlyTrend}>
                <defs>
                  <linearGradient id="colorHeroRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#818CF8" stopOpacity={0.35}/>
                    <stop offset="95%" stopColor="#818CF8" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorHeroProfit" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2DD4BF" stopOpacity={0.35}/>
                    <stop offset="95%" stopColor="#2DD4BF" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.05)" />
                <XAxis dataKey="month" stroke="#94A3B8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} tickFormatter={(v) => `$${v/1000}k`} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#101827', 
                    borderColor: 'rgba(255, 255, 255, 0.1)', 
                    borderRadius: '12px',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
                    fontSize: '12px'
                  }}
                  formatter={(value: any) => [formatCurrency(Number(value)), 'Amount']} 
                />
                <Area 
                  type="monotone" 
                  dataKey={chartView === 'revenue' ? 'revenue' : 'profit'} 
                  stroke={chartView === 'revenue' ? '#818CF8' : '#2DD4BF'} 
                  strokeWidth={2.5} 
                  fillOpacity={1} 
                  fill={chartView === 'revenue' ? 'url(#colorHeroRev)' : 'url(#colorHeroProfit)'} 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between text-xs text-[#94A3B8]">
            <span className="flex items-center gap-1.5 font-mono text-[11px]">
              <span className="w-2 h-2 rounded-full bg-[#818CF8]" />
              <span>Projected H2 Run-Rate: $780,000</span>
            </span>
            <button
              onClick={() => setPage('analytics')}
              className="text-[#818CF8] hover:underline flex items-center gap-1 font-semibold"
            >
              <span>Detailed Breakdown</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </Card>

        {/* Business Health Scorecard (1 Col) */}
        <Card className="p-6 flex flex-col justify-between" elevated>
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-white tracking-tight">Business Health</h3>
              <span className="text-xs font-mono font-bold text-[#2DD4BF] bg-[#2DD4BF]/10 px-2 py-0.5 rounded-full border border-[#2DD4BF]/20">
                98.4 Index
              </span>
            </div>
            <p className="text-xs text-[#94A3B8] mb-5">
              Comprehensive telemetry across capital efficiency, deal conversion & fulfillment.
            </p>

            {/* Health Indicators */}
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-300 font-medium">Operating Margin</span>
                  <span className="font-mono text-[#2DD4BF] font-semibold">44.5%</span>
                </div>
                <div className="w-full bg-white/[0.06] h-1.5 rounded-full overflow-hidden">
                  <div className="bg-[#2DD4BF] h-full rounded-full" style={{ width: '85%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-300 font-medium">Pipeline Coverage</span>
                  <span className="font-mono text-[#818CF8] font-semibold">3.8x Target</span>
                </div>
                <div className="w-full bg-white/[0.06] h-1.5 rounded-full overflow-hidden">
                  <div className="bg-[#818CF8] h-full rounded-full" style={{ width: '76%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-300 font-medium">Order Fulfillment Velocity</span>
                  <span className="font-mono text-emerald-400 font-semibold">99.1%</span>
                </div>
                <div className="w-full bg-white/[0.06] h-1.5 rounded-full overflow-hidden">
                  <div className="bg-emerald-400 h-full rounded-full" style={{ width: '99%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-300 font-medium">Attendance & Shifts</span>
                  <span className="font-mono text-amber-300 font-semibold">100% Present</span>
                </div>
                <div className="w-full bg-white/[0.06] h-1.5 rounded-full overflow-hidden">
                  <div className="bg-amber-400 h-full rounded-full" style={{ width: '100%' }} />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-white/[0.06] flex items-center justify-between text-xs">
            <span className="text-[#94A3B8]">Audit Compliance:</span>
            <span className="text-emerald-400 font-medium flex items-center gap-1 font-mono text-[11px]">
              <ShieldCheck className="w-3.5 h-3.5" /> SOC2 Verified
            </span>
          </div>
        </Card>
      </div>

      {/* 4. MAIN OPERATIONAL SPLIT: ACTIVE PIPELINE & OPERATIONAL STATUS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Active CRM Opportunities */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">Active Opportunities</h3>
              <p className="text-xs text-[#94A3B8]">High-probability accounts moving through pipeline</p>
            </div>
            <button 
              onClick={() => setPage('sales-pipeline')}
              className="text-xs text-[#818CF8] hover:underline font-semibold flex items-center gap-1"
            >
              <span>Kanban Board</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2.5">
            {leads.slice(0, 4).map((lead) => (
              <div 
                key={lead.id} 
                className="p-3.5 rounded-xl bg-[#151F32]/60 border border-white/[0.06] hover:border-white/20 transition flex items-center justify-between"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-white">{lead.name}</span>
                    <span className="text-xs text-slate-400">({lead.company})</span>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-[#94A3B8] mt-1 font-mono">
                    <span>{lead.assignedTo || 'Unassigned'}</span>
                    <span>•</span>
                    <Badge variant={lead.status === 'Closed Won' ? 'success' : lead.status === 'Qualified' ? 'purple' : 'info'}>
                      {lead.status}
                    </Badge>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-sm font-extrabold text-white tabular-nums">
                    {formatCurrency(lead.value)}
                  </div>
                  <span className="text-[11px] font-mono text-[#818CF8] font-semibold">
                    AI: {lead.score}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Operational Status & Recent Orders */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">Operational Fulfillment</h3>
              <p className="text-xs text-[#94A3B8]">Recent client purchase shipments & status updates</p>
            </div>
            <button 
              onClick={() => setPage('orders')}
              className="text-xs text-[#818CF8] hover:underline font-semibold flex items-center gap-1"
            >
              <span>All Orders ({orders.length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2.5">
            {orders.slice(0, 4).map((order) => (
              <div 
                key={order.id} 
                className="p-3.5 rounded-xl bg-[#151F32]/60 border border-white/[0.06] hover:border-white/20 transition flex items-center justify-between"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-white">{order.customer}</span>
                    <span className="text-[11px] font-mono text-slate-400">#{order.orderNumber}</span>
                  </div>
                  <p className="text-[11px] text-[#94A3B8] mt-0.5 font-mono">
                    {order.items.length} line items • Placed {formatDate(order.date)}
                  </p>
                </div>

                <div className="text-right">
                  <div className="text-sm font-extrabold text-white tabular-nums">
                    {formatCurrency(order.total)}
                  </div>
                  <Badge variant={order.status === 'Completed' ? 'success' : order.status === 'Processing' ? 'info' : 'warning'}>
                    {order.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};
