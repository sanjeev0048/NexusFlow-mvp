import React, { useState } from 'react';
import { 
  Sparkles, ArrowRight, ShieldCheck, CheckCircle2, ChevronRight, 
  Users, Package, Receipt, BarChart3, Bot, Zap, Globe, Layers,
  TrendingUp, Clock, Terminal, ChevronDown, Activity, Play, Star
} from 'lucide-react';
import { Page } from '../types';
import { NexusLogo } from '../components/common/NexusLogo';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';

interface LandingPageProps {
  setPage: (p: Page) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ setPage }) => {
  const [activePreviewTab, setActivePreviewTab] = useState<'overview' | 'crm' | 'inventory' | 'finance' | 'ai'>('overview');
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');

  return (
    <div className="min-h-screen bg-[#080B14] text-[#F8FAFC] font-sans overflow-x-hidden selection:bg-[#818CF8]/30 selection:text-white">
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1100px] h-[550px] bg-gradient-to-b from-[#818CF8]/18 via-[#2DD4BF]/8 to-transparent blur-[140px] pointer-events-none rounded-full" />
      <div className="absolute top-96 right-10 w-[450px] h-[450px] bg-[#818CF8]/10 blur-[160px] pointer-events-none rounded-full" />
      <div className="absolute top-[800px] left-10 w-[400px] h-[400px] bg-[#2DD4BF]/8 blur-[150px] pointer-events-none rounded-full" />

      {/* Subtle grid pattern background */}
      <div className="absolute inset-0 bg-grid-subtle opacity-60 pointer-events-none" />

      {/* Top Navbar */}
      <nav className="sticky top-0 z-40 bg-[#080B14]/80 backdrop-blur-md border-b border-white/[0.08]">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <NexusLogo size="md" badge="Enterprise OS" />

          <div className="hidden md:flex items-center gap-8 text-xs font-medium text-[#94A3B8]">
            <a href="#preview" className="hover:text-white transition">Product Experience</a>
            <a href="#solutions" className="hover:text-white transition">Capabilities</a>
            <a href="#intelligence" className="hover:text-white transition">Intelligence Layer</a>
            <a href="#pricing" className="hover:text-white transition">Pricing</a>
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={() => setPage('login')} 
              className="px-4 py-2 text-xs font-medium text-[#94A3B8] hover:text-white transition"
            >
              Sign In
            </button>
            <button 
              onClick={() => setPage('dashboard')} 
              className="px-4 py-2 text-xs font-semibold bg-[#818CF8] hover:bg-[#6366F1] text-[#080B14] font-bold rounded-xl shadow-glow-primary transition flex items-center gap-1.5 active:scale-95"
            >
              <span>Launch Command Center</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-6 pt-20 md:pt-28 pb-32 relative z-10">
        <div className="text-center max-w-4xl mx-auto space-y-6">
          {/* Version Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/10 text-xs text-[#94A3B8] backdrop-blur-sm shadow-card-subtle">
            <span className="w-2 h-2 rounded-full bg-[#2DD4BF] animate-pulse" />
            <span className="font-mono text-[#F8FAFC]">NexusFlow v2.4</span>
            <span className="text-white/20">|</span>
            <span className="text-[#818CF8] font-medium flex items-center gap-1">
              Intelligent Business Operating System <Sparkles className="w-3 h-3 text-[#2DD4BF]" />
            </span>
          </div>

          {/* Core Headline */}
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight leading-[1.08] text-white">
            Your Business.<br />
            <span className="bg-gradient-to-r from-[#818CF8] via-[#C7D2FE] to-[#2DD4BF] bg-clip-text text-transparent">
              One Intelligent Ecosystem.
            </span>
          </h1>

          {/* Supporting Text */}
          <p className="text-base sm:text-lg md:text-xl text-[#94A3B8] max-w-2xl mx-auto font-normal leading-relaxed">
            Connect your people, processes and performance through one powerful business operating platform.
          </p>

          {/* CTA Buttons */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3.5">
            <button 
              onClick={() => setPage('dashboard')} 
              className="w-full sm:w-auto px-7 py-3.5 bg-[#818CF8] hover:bg-[#6366F1] text-[#080B14] font-bold rounded-xl shadow-glow-primary flex items-center justify-center gap-2 transition active:scale-95"
            >
              <span>Explore Command Center</span>
              <ArrowRight className="w-4 h-4 text-[#080B14]" />
            </button>
            <button 
              onClick={() => setPage('signup')}
              className="w-full sm:w-auto px-7 py-3.5 bg-[#101827] border border-white/10 hover:border-white/25 hover:bg-[#151F32] text-[#F8FAFC] font-medium rounded-xl transition shadow-card-subtle flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-[#818CF8]" />
              <span>Start 14-Day Enterprise Trial</span>
            </button>
          </div>

          {/* Enterprise Validation Strip */}
          <div className="pt-6 flex flex-wrap items-center justify-center gap-6 text-[11px] font-mono text-[#94A3B8]">
            <span className="flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5 text-[#2DD4BF]" /> PostgreSQL Row-Level Security</span>
            <span className="text-white/20">•</span>
            <span className="flex items-center gap-1.5"><Activity className="w-3.5 h-3.5 text-[#818CF8]" /> Real-time Telemetry &lt;10ms</span>
            <span className="text-white/20">•</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-[#2DD4BF]" /> SOC-2 Type II Architecture</span>
          </div>
        </div>

        {/* ========================================================
            2. PRODUCT PREVIEW WITH FLOATING DASHBOARD CARDS
        ======================================================== */}
        <section id="preview" className="mt-16 md:mt-24 relative max-w-6xl mx-auto">
          {/* Outer glow aura */}
          <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-[#818CF8]/30 via-transparent to-[#2DD4BF]/30 blur-2xl opacity-50 pointer-events-none" />

          {/* Interactive Preview Container */}
          <div className="relative rounded-2xl bg-[#101827] border border-white/10 shadow-card-elevated overflow-hidden">
            {/* Window Topbar */}
            <div className="px-5 py-3 border-b border-white/[0.08] bg-[#151F32]/60 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                <span className="ml-3 text-xs font-mono text-[#94A3B8]">nexusflow.app/command-center</span>
              </div>

              {/* View Switcher Tabs */}
              <div className="hidden sm:flex items-center gap-1 bg-[#101827] p-1 rounded-xl border border-white/[0.06]">
                {(['overview', 'crm', 'inventory', 'finance', 'ai'] as const).map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActivePreviewTab(tab)}
                    className={`px-3 py-1 rounded-lg text-xs font-medium capitalize transition-all ${
                      activePreviewTab === tab
                        ? 'bg-[#818CF8] text-[#080B14] font-bold shadow-sm'
                        : 'text-[#94A3B8] hover:text-white'
                    }`}
                  >
                    {tab === 'ai' ? 'FlowAI Intelligence' : tab}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-[#2DD4BF]/10 text-[#2DD4BF] border border-[#2DD4BF]/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#2DD4BF] animate-ping" />
                  LIVE TELEMETRY
                </span>
              </div>
            </div>

            {/* Preview Viewport Body */}
            <div className="p-6 md:p-8 bg-[#080B14]/80 space-y-6 min-h-[460px]">
              {/* Tab: Overview / Command Center */}
              {activePreviewTab === 'overview' && (
                <div className="space-y-6 animate-fadeIn">
                  {/* Top quick stats row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="p-4 rounded-xl bg-[#101827] border border-white/[0.08] relative overflow-hidden">
                      <div className="text-[11px] font-mono text-[#94A3B8] uppercase">Net Revenue (Q2)</div>
                      <div className="text-2xl font-extrabold text-white mt-1 tabular-nums">$89,450.00</div>
                      <div className="text-[11px] text-[#2DD4BF] font-semibold mt-1 flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" /> +14.2% vs previous run
                      </div>
                    </div>
                    <div className="p-4 rounded-xl bg-[#101827] border border-white/[0.08]">
                      <div className="text-[11px] font-mono text-[#94A3B8] uppercase">Active Pipeline</div>
                      <div className="text-2xl font-extrabold text-white mt-1 tabular-nums">$412,000.00</div>
                      <div className="text-[11px] text-[#818CF8] font-semibold mt-1 flex items-center gap-1">
                        <Users className="w-3 h-3" /> 24 High-Intent Deals
                      </div>
                    </div>
                    <div className="p-4 rounded-xl bg-[#101827] border border-white/[0.08]">
                      <div className="text-[11px] font-mono text-[#94A3B8] uppercase">Inventory Health</div>
                      <div className="text-2xl font-extrabold text-[#2DD4BF] mt-1 tabular-nums">98.4%</div>
                      <div className="text-[11px] text-[#94A3B8] mt-1">14 SKUs monitored • 0 critical</div>
                    </div>
                    <div className="p-4 rounded-xl bg-[#101827] border border-[#818CF8]/30 relative overflow-hidden bg-gradient-to-br from-[#818CF8]/10 via-transparent to-transparent">
                      <div className="text-[11px] font-mono text-[#818CF8] uppercase flex items-center gap-1">
                        <Sparkles className="w-3 h-3" /> FlowAI Predictor
                      </div>
                      <div className="text-xl font-bold text-white mt-1">Growth Forecast</div>
                      <div className="text-[11px] text-[#94A3B8] mt-1">Target ARR on track (+28%)</div>
                    </div>
                  </div>

                  {/* Asymmetric layout demo */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                    {/* Visual Chart Mock */}
                    <div className="lg:col-span-2 p-5 rounded-xl bg-[#101827] border border-white/[0.08] space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-sm font-semibold text-white">Revenue & Operating Margin Trajectory</h4>
                          <p className="text-xs text-[#94A3B8]">Continuous financial reconciliation & transaction analytics</p>
                        </div>
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-white/[0.06] text-[#94A3B8]">Fiscal 2026</span>
                      </div>

                      {/* SVG Mini Chart Visualizer */}
                      <div className="h-44 w-full flex items-end gap-3 pt-6 px-2">
                        {[
                          { month: 'Jan', h: 45, rev: '$45K' },
                          { month: 'Feb', h: 52, rev: '$52K' },
                          { month: 'Mar', h: 64, rev: '$64K' },
                          { month: 'Apr', h: 58, rev: '$58K' },
                          { month: 'May', h: 76, rev: '$76K' },
                          { month: 'Jun', h: 95, rev: '$89K' },
                        ].map((bar, i) => (
                          <div key={bar.month} className="flex-1 flex flex-col items-center gap-2 group cursor-pointer">
                            <span className="text-[10px] font-mono text-[#94A3B8] opacity-0 group-hover:opacity-100 transition-opacity">
                              {bar.rev}
                            </span>
                            <div className="w-full rounded-t-lg bg-gradient-to-t from-[#818CF8]/20 to-[#818CF8] group-hover:to-[#2DD4BF] transition-all relative overflow-hidden" style={{ height: `${bar.h}%` }}>
                              <div className="absolute top-0 left-0 right-0 h-1 bg-white/40" />
                            </div>
                            <span className="text-[11px] font-mono text-slate-400">{bar.month}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Operational Telemetry Feed */}
                    <div className="p-5 rounded-xl bg-[#101827] border border-white/[0.08] space-y-3.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold uppercase tracking-wider text-[#94A3B8] font-mono">Live Telemetry</span>
                        <span className="w-2 h-2 rounded-full bg-[#2DD4BF] animate-ping" />
                      </div>

                      <div className="space-y-2.5 text-xs">
                        <div className="p-2.5 rounded-lg bg-white/[0.03] border border-white/[0.06] flex items-start gap-2.5">
                          <div className="p-1 rounded bg-[#2DD4BF]/10 text-[#2DD4BF] mt-0.5"><CheckCircle2 className="w-3.5 h-3.5" /></div>
                          <div>
                            <div className="font-semibold text-white">Deal Closed: $42,000</div>
                            <div className="text-[11px] text-[#94A3B8]">Acme Hypercloud migrated to Annual Tier</div>
                          </div>
                        </div>

                        <div className="p-2.5 rounded-lg bg-white/[0.03] border border-white/[0.06] flex items-start gap-2.5">
                          <div className="p-1 rounded bg-[#818CF8]/10 text-[#818CF8] mt-0.5"><Package className="w-3.5 h-3.5" /></div>
                          <div>
                            <div className="font-semibold text-white">Warehouse Buffer Restocked</div>
                            <div className="text-[11px] text-[#94A3B8]">500 units of Neural Gateway Edge received</div>
                          </div>
                        </div>

                        <div className="p-2.5 rounded-lg bg-white/[0.03] border border-white/[0.06] flex items-start gap-2.5">
                          <div className="p-1 rounded bg-amber-400/10 text-amber-400 mt-0.5"><Receipt className="w-3.5 h-3.5" /></div>
                          <div>
                            <div className="font-semibold text-white">Automated Invoice Reconciled</div>
                            <div className="text-[11px] text-[#94A3B8]">Invoice #INV-2026-088 cleared via ACH</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab: CRM */}
              {activePreviewTab === 'crm' && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-semibold text-white">Visual Sales Pipeline & Opportunity Kanban</h4>
                      <p className="text-xs text-[#94A3B8]">Automated lead scoring, stages velocity, and contract value tracking</p>
                    </div>
                    <Badge variant="success">6 Active Deal Stages</Badge>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="p-3.5 rounded-xl bg-[#101827] border border-white/[0.08]">
                      <div className="text-[10px] font-mono text-[#818CF8] uppercase">Qualified Stage ($140K)</div>
                      <div className="mt-2 space-y-2">
                        <div className="p-2.5 rounded-lg bg-[#151F32] border border-white/[0.06] text-xs">
                          <div className="font-bold text-white">Nova Dynamics</div>
                          <div className="text-[#94A3B8] text-[11px]">$48,000 • AI Score: 92/100</div>
                        </div>
                        <div className="p-2.5 rounded-lg bg-[#151F32] border border-white/[0.06] text-xs">
                          <div className="font-bold text-white">Cortex Robotics</div>
                          <div className="text-[#94A3B8] text-[11px]">$92,000 • AI Score: 87/100</div>
                        </div>
                      </div>
                    </div>

                    <div className="p-3.5 rounded-xl bg-[#101827] border border-white/[0.08]">
                      <div className="text-[10px] font-mono text-[#2DD4BF] uppercase">Proposal Sent ($185K)</div>
                      <div className="mt-2 space-y-2">
                        <div className="p-2.5 rounded-lg bg-[#151F32] border border-white/[0.06] text-xs">
                          <div className="font-bold text-white">Vanguard Aerospace</div>
                          <div className="text-[#94A3B8] text-[11px]">$125,000 • AI Score: 95/100</div>
                        </div>
                        <div className="p-2.5 rounded-lg bg-[#151F32] border border-white/[0.06] text-xs">
                          <div className="font-bold text-white">Starlight Payments</div>
                          <div className="text-[#94A3B8] text-[11px]">$60,000 • AI Score: 81/100</div>
                        </div>
                      </div>
                    </div>

                    <div className="p-3.5 rounded-xl bg-[#101827] border border-white/[0.08]">
                      <div className="text-[10px] font-mono text-emerald-400 uppercase">Closed Won ($210K)</div>
                      <div className="mt-2 space-y-2">
                        <div className="p-2.5 rounded-lg bg-[#151F32] border border-[#2DD4BF]/30 text-xs">
                          <div className="font-bold text-white">Apex FinTech</div>
                          <div className="text-[#2DD4BF] text-[11px]">$110,000 • Closed Successfully</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab: Inventory */}
              {activePreviewTab === 'inventory' && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-semibold text-white">Intelligent Inventory & Stock Movement Ledger</h4>
                      <p className="text-xs text-[#94A3B8]">SKU buffers, automated supplier threshold re-ordering, unit margins</p>
                    </div>
                    <Badge variant="purple">SKU Health: 100%</Badge>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-white/[0.08] text-[#94A3B8] font-mono">
                          <th className="py-2">SKU & Item</th>
                          <th className="py-2">Category</th>
                          <th className="py-2">Stock Level</th>
                          <th className="py-2">Unit Price</th>
                          <th className="py-2">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/[0.04]">
                        <tr>
                          <td className="py-3 font-semibold text-white">Nexus Enterprise License (SKU-NX-01)</td>
                          <td className="py-3 text-[#94A3B8]">Software</td>
                          <td className="py-3 font-mono text-white">Unlimited Units</td>
                          <td className="py-3 font-mono text-white">$4,900/yr</td>
                          <td className="py-3"><Badge variant="success">In Stock</Badge></td>
                        </tr>
                        <tr>
                          <td className="py-3 font-semibold text-white">Neural Gateway Edge Node (SKU-HW-88)</td>
                          <td className="py-3 text-[#94A3B8]">Hardware</td>
                          <td className="py-3 font-mono text-white">142 units remaining</td>
                          <td className="py-3 font-mono text-white">$1,250.00</td>
                          <td className="py-3"><Badge variant="success">Healthy Buffer</Badge></td>
                        </tr>
                        <tr>
                          <td className="py-3 font-semibold text-white">Enterprise Migration Retainer (SKU-SV-03)</td>
                          <td className="py-3 text-[#94A3B8]">Services</td>
                          <td className="py-3 font-mono text-white">12 Available Slots</td>
                          <td className="py-3 font-mono text-white">$15,000.00</td>
                          <td className="py-3"><Badge variant="purple">Consulting</Badge></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Tab: Finance */}
              {activePreviewTab === 'finance' && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-semibold text-white">Autonomous Billing & Cash Flow Intelligence</h4>
                      <p className="text-xs text-[#94A3B8]">Real-time accounts receivable, expense reconciliation, net operating margin</p>
                    </div>
                    <Badge variant="accent">Cash Runway: 36 Months</Badge>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="p-4 rounded-xl bg-[#101827] border border-white/[0.08]">
                      <div className="text-xs text-[#94A3B8]">Total Invoiced</div>
                      <div className="text-2xl font-bold text-white mt-1 tabular-nums">$328,500.00</div>
                      <div className="text-[11px] text-[#2DD4BF] mt-1 font-mono">100% Tax Compliant</div>
                    </div>
                    <div className="p-4 rounded-xl bg-[#101827] border border-white/[0.08]">
                      <div className="text-xs text-[#94A3B8]">Collections Rate</div>
                      <div className="text-2xl font-bold text-[#2DD4BF] mt-1 tabular-nums">96.8%</div>
                      <div className="text-[11px] text-[#94A3B8] mt-1">Dunning automation enabled</div>
                    </div>
                    <div className="p-4 rounded-xl bg-[#101827] border border-white/[0.08]">
                      <div className="text-xs text-[#94A3B8]">Operating Margin</div>
                      <div className="text-2xl font-bold text-white mt-1 tabular-nums">48.2%</div>
                      <div className="text-[11px] text-[#818CF8] mt-1 font-mono">+$44,000 Net Q2</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab: AI */}
              {activePreviewTab === 'ai' && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-semibold text-white">FlowAI Natural Language Business Intelligence</h4>
                      <p className="text-xs text-[#94A3B8]">Instant synthesized answers across sales, inventory, finance & payroll</p>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-[#818CF8]/10 text-[#818CF8] text-[10px] font-mono border border-[#818CF8]/30 flex items-center gap-1">
                      <Sparkles className="w-3 h-3" /> Gemini 1.5 Pro Connected
                    </span>
                  </div>
                  <div className="p-4 rounded-xl bg-[#151F32] border border-white/10 space-y-3">
                    <div className="text-xs text-[#818CF8] font-mono flex items-center gap-1.5">
                      <Terminal className="w-3.5 h-3.5" /> Prompt: "Analyze quarterly revenue vs expenses & summarize runway"
                    </div>
                    <div className="text-xs text-[#F8FAFC] leading-relaxed bg-[#101827] p-3.5 rounded-lg border border-white/[0.06] space-y-1.5">
                      <p className="font-semibold text-[#2DD4BF]">📊 Executive Financial Summary:</p>
                      <p>• Total Revenue recorded: <strong>$89,450.00</strong> across 6 fulfilled orders (+14.2% MoM).</p>
                      <p>• Operating expenses: <strong>$45,000.00</strong>, generating an operating margin of <strong>49.6%</strong>.</p>
                      <p>• Outstanding receivables: <strong>$24,000.00</strong> pending across 3 invoices.</p>
                      <p className="text-[#818CF8] font-medium pt-1">💡 Strategic Insight: Cash runway is comfortably 36+ months. Re-investing into sales outbound recommended.</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Preview Bar */}
            <div className="px-6 py-3.5 bg-[#151F32]/50 border-t border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#94A3B8]">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#2DD4BF]" />
                <span>Enterprise Multi-Tenant Environment Active</span>
              </div>
              <button 
                onClick={() => setPage('dashboard')}
                className="text-[#818CF8] hover:text-white font-semibold flex items-center gap-1.5 group transition"
              >
                <span>Launch live interactive session</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          {/* Floating Feature Glass Badges */}
          <div className="hidden lg:block absolute -bottom-7 -left-6 p-4 rounded-2xl bg-[#151F32]/90 border border-white/15 backdrop-blur-xl shadow-card-elevated animate-floatSlow">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#818CF8] to-[#2DD4BF] flex items-center justify-center text-[#080B14] font-bold">
                <Zap className="w-5 h-5 text-[#080B14]" />
              </div>
              <div>
                <div className="text-xs font-bold text-white">Continuous Sync</div>
                <div className="text-[11px] text-[#94A3B8]">0.02s Postgres Realtime latency</div>
              </div>
            </div>
          </div>

          <div className="hidden lg:block absolute -top-6 -right-6 p-4 rounded-2xl bg-[#151F32]/90 border border-white/15 backdrop-blur-xl shadow-card-elevated animate-floatSlow" style={{ animationDelay: '2s' }}>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#2DD4BF]/20 border border-[#2DD4BF]/40 flex items-center justify-center text-[#2DD4BF]">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-white">Bank-Grade Security</div>
                <div className="text-[11px] text-[#94A3B8]">AES-256 + RLS multi-tenant isolated</div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================
            3. CORE CAPABILITIES (BENTO GRID)
        ======================================================== */}
        <section id="solutions" className="mt-32 max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <Badge variant="purple">Architected for Speed & Scale</Badge>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              A Unified Operating Layer for High-Growth Enterprises
            </h2>
            <p className="text-sm text-[#94A3B8]">
              Replace fragmented tools with one cohesive software platform designed for modern business velocity.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* Bento Card 1 */}
            <Card className="p-7 space-y-4 hover:border-[#818CF8]/40 transition-all duration-300" hoverable glowTop>
              <div className="w-10 h-10 rounded-xl bg-[#818CF8]/15 border border-[#818CF8]/30 flex items-center justify-center text-[#818CF8]">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white tracking-tight">Predictive CRM & Sales Pipeline</h3>
              <p className="text-xs text-[#94A3B8] leading-relaxed">
                Kanban deal tracking with automated AI conversion scores, rep assignment, deal valuation, and customer account promotion.
              </p>
              <ul className="text-xs text-slate-300 space-y-2 pt-2 border-t border-white/[0.06]">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-[#2DD4BF]" /> Automated AI deal win likelihood score</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-[#2DD4BF]" /> Real-time deal stage advancement</li>
              </ul>
            </Card>

            {/* Bento Card 2 */}
            <Card className="p-7 space-y-4 hover:border-[#2DD4BF]/40 transition-all duration-300" hoverable glowTop>
              <div className="w-10 h-10 rounded-xl bg-[#2DD4BF]/15 border border-[#2DD4BF]/30 flex items-center justify-center text-[#2DD4BF]">
                <Package className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white tracking-tight">Warehouse & SKU Telemetry</h3>
              <p className="text-xs text-[#94A3B8] leading-relaxed">
                Precise inventory buffer monitors, low-stock proactive alerts, SKU unit profit calculations, and order fulfillment tracking.
              </p>
              <ul className="text-xs text-slate-300 space-y-2 pt-2 border-t border-white/[0.06]">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-[#2DD4BF]" /> 1-Click stock adjustments & audit logs</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-[#2DD4BF]" /> SKU threshold re-order automated alerts</li>
              </ul>
            </Card>

            {/* Bento Card 3 */}
            <Card className="p-7 space-y-4 hover:border-[#818CF8]/40 transition-all duration-300" hoverable glowTop>
              <div className="w-10 h-10 rounded-xl bg-[#818CF8]/15 border border-[#818CF8]/30 flex items-center justify-center text-[#818CF8]">
                <Receipt className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white tracking-tight">Autonomous Financial Ledger</h3>
              <p className="text-xs text-[#94A3B8] leading-relaxed">
                Generate itemized tax-compliant invoices, track pending/overdue collections, categorize corporate expenditures, and monitor burn rate.
              </p>
              <ul className="text-xs text-slate-300 space-y-2 pt-2 border-t border-white/[0.06]">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-[#2DD4BF]" /> Live PDF invoice preview & printing</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-[#2DD4BF]" /> Automated overdue dunning tracking</li>
              </ul>
            </Card>

            {/* Bento Card 4 */}
            <Card className="p-7 space-y-4 hover:border-[#818CF8]/40 transition-all duration-300" hoverable glowTop>
              <div className="w-10 h-10 rounded-xl bg-[#818CF8]/15 border border-[#818CF8]/30 flex items-center justify-center text-[#818CF8]">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white tracking-tight">FlowAI Intelligence Layer</h3>
              <p className="text-xs text-[#94A3B8] leading-relaxed">
                Direct integration with Google Gemini 1.5 Pro to synthesize real-time business telemetry, forecast cash flow, and discover risks.
              </p>
              <ul className="text-xs text-slate-300 space-y-2 pt-2 border-t border-white/[0.06]">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-[#2DD4BF]" /> Natural language query over live Postgres context</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-[#2DD4BF]" /> Intelligent offline fallback rule engine</li>
              </ul>
            </Card>

            {/* Bento Card 5 */}
            <Card className="p-7 space-y-4 hover:border-[#2DD4BF]/40 transition-all duration-300" hoverable glowTop>
              <div className="w-10 h-10 rounded-xl bg-[#2DD4BF]/15 border border-[#2DD4BF]/30 flex items-center justify-center text-[#2DD4BF]">
                <Clock className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white tracking-tight">Workforce & Shift Telemetry</h3>
              <p className="text-xs text-[#94A3B8] leading-relaxed">
                Employee profiles, department directories, payroll valuation, and real-time punch clock-in/out attendance tracking.
              </p>
              <ul className="text-xs text-slate-300 space-y-2 pt-2 border-t border-white/[0.06]">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-[#2DD4BF]" /> 1-Click header shift clock in/out</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-[#2DD4BF]" /> Departmental headcount & salary analysis</li>
              </ul>
            </Card>

            {/* Bento Card 6 */}
            <Card className="p-7 space-y-4 hover:border-[#818CF8]/40 transition-all duration-300" hoverable glowTop>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#818CF8]/20 to-[#2DD4BF]/20 border border-white/10 flex items-center justify-center text-white">
                <BarChart3 className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white tracking-tight">Multi-Dimensional Analytics</h3>
              <p className="text-xs text-[#94A3B8] leading-relaxed">
                Interactive financial charts, profit margin progression, average deal sizes, and automated CSV export pipelines.
              </p>
              <ul className="text-xs text-slate-300 space-y-2 pt-2 border-t border-white/[0.06]">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-[#2DD4BF]" /> Recharts vector time-series modeling</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-[#2DD4BF]" /> 1-Click CSV snapshot exports</li>
              </ul>
            </Card>
          </div>
        </section>

        {/* ========================================================
            4. PRICING SECTION
        ======================================================== */}
        <section id="pricing" className="mt-32 max-w-5xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
            <Badge variant="purple">Transparent Enterprise Pricing</Badge>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Invest in Scalable Operational Excellence
            </h2>
            <p className="text-sm text-[#94A3B8]">
              Start instantly with our demo workspace or activate multi-tenant cloud storage.
            </p>

            {/* Billing Toggle */}
            <div className="pt-4 flex items-center justify-center gap-3">
              <span className={`text-xs font-semibold ${billingCycle === 'monthly' ? 'text-white' : 'text-[#94A3B8]'}`}>
                Monthly Billing
              </span>
              <button
                onClick={() => setBillingCycle(b => b === 'monthly' ? 'annual' : 'monthly')}
                className="w-12 h-6 rounded-full bg-[#151F32] border border-white/10 p-1 flex items-center transition cursor-pointer"
              >
                <div className={`w-4 h-4 rounded-full bg-[#818CF8] transition-transform ${billingCycle === 'annual' ? 'translate-x-6' : 'translate-x-0'}`} />
              </button>
              <span className={`text-xs font-semibold flex items-center gap-1.5 ${billingCycle === 'annual' ? 'text-white' : 'text-[#94A3B8]'}`}>
                Annual Billing <span className="text-[10px] font-mono text-[#2DD4BF] bg-[#2DD4BF]/10 px-1.5 py-0.5 rounded border border-[#2DD4BF]/20">Save 20%</span>
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Starter Plan */}
            <Card className="p-7 space-y-6 flex flex-col justify-between" hoverable>
              <div className="space-y-4">
                <div className="text-sm font-bold text-white uppercase tracking-wider font-mono">Growth Node</div>
                <p className="text-xs text-[#94A3B8]">For early-stage startups and boutique consultancies.</p>
                <div className="text-3xl font-extrabold text-white tabular-nums">
                  ${billingCycle === 'annual' ? '79' : '99'}<span className="text-xs text-[#94A3B8] font-normal"> / month</span>
                </div>
                <ul className="text-xs text-slate-300 space-y-2.5 pt-4 border-t border-white/[0.06]">
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-[#2DD4BF]" /> Up to 10 Team Members</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-[#2DD4BF]" /> CRM & Pipeline Kanban</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-[#2DD4BF]" /> 500 Product SKUs</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-[#2DD4BF]" /> Standard Financial Ledger</li>
                </ul>
              </div>
              <button 
                onClick={() => setPage('signup')}
                className="w-full py-2.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] text-white text-xs font-semibold border border-white/10 transition"
              >
                Start Free Trial
              </button>
            </Card>

            {/* Enterprise Plan (Featured) */}
            <Card className="p-7 space-y-6 flex flex-col justify-between border-[#818CF8]/50 shadow-glow-primary relative overflow-hidden bg-[#151F32]" elevated>
              <div className="absolute top-0 right-0 bg-[#818CF8] text-[#080B14] font-bold text-[10px] font-mono uppercase px-3 py-1 rounded-bl-xl">
                MOST POPULAR
              </div>
              <div className="space-y-4">
                <div className="text-sm font-bold text-[#818CF8] uppercase tracking-wider font-mono">Scale Enterprise</div>
                <p className="text-xs text-[#94A3B8]">Complete operational stack with FlowAI Copilot.</p>
                <div className="text-3xl font-extrabold text-white tabular-nums">
                  ${billingCycle === 'annual' ? '199' : '249'}<span className="text-xs text-[#94A3B8] font-normal"> / month</span>
                </div>
                <ul className="text-xs text-slate-300 space-y-2.5 pt-4 border-t border-white/[0.06]">
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-[#2DD4BF]" /> Unlimited Team Seats</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-[#2DD4BF]" /> Unlimited Products & Deals</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-[#2DD4BF]" /> FlowAI (Gemini 1.5 Pro) Copilot</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-[#2DD4BF]" /> Supabase Cloud Database + RLS</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-[#2DD4BF]" /> Real-time Shift Attendance Punch</li>
                </ul>
              </div>
              <button 
                onClick={() => setPage('signup')}
                className="w-full py-2.5 rounded-xl bg-[#818CF8] hover:bg-[#6366F1] text-[#080B14] text-xs font-bold shadow-sm transition active:scale-95"
              >
                Claim Enterprise Node
              </button>
            </Card>

            {/* Custom Tier */}
            <Card className="p-7 space-y-6 flex flex-col justify-between" hoverable>
              <div className="space-y-4">
                <div className="text-sm font-bold text-white uppercase tracking-wider font-mono">Global Dedicated</div>
                <p className="text-xs text-[#94A3B8]">Dedicated VPC deployment, custom SLA & audit logs.</p>
                <div className="text-3xl font-extrabold text-white tabular-nums">
                  Custom<span className="text-xs text-[#94A3B8] font-normal"> / annual</span>
                </div>
                <ul className="text-xs text-slate-300 space-y-2.5 pt-4 border-t border-white/[0.06]">
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-[#2DD4BF]" /> Dedicated PostgreSQL Cluster</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-[#2DD4BF]" /> 99.99% Uptime Guarantee</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-[#2DD4BF]" /> Custom ERP Integrations & Webhooks</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-[#2DD4BF]" /> 24/7 Dedicated Technical Account Rep</li>
                </ul>
              </div>
              <button 
                onClick={() => setPage('login')}
                className="w-full py-2.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] text-white text-xs font-semibold border border-white/10 transition"
              >
                Contact Sales
              </button>
            </Card>
          </div>
        </section>

        {/* ========================================================
            5. FINAL CALL TO ACTION
        ======================================================== */}
        <section className="mt-32 relative rounded-3xl bg-gradient-to-b from-[#151F32] to-[#101827] border border-white/10 p-10 md:p-16 text-center overflow-hidden shadow-card-elevated">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-48 bg-[#818CF8]/20 blur-[100px] pointer-events-none" />
          
          <div className="relative z-10 max-w-2xl mx-auto space-y-6">
            <NexusLogo size="lg" className="justify-center" showText={false} />
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Transform Your Business Operating Speed Today
            </h2>
            <p className="text-sm text-[#94A3B8] leading-relaxed">
              Experience the power of a modern business operating ecosystem. Zero credit card required to explore the full interactive demo.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button 
                onClick={() => setPage('dashboard')} 
                className="w-full sm:w-auto px-8 py-3.5 bg-[#818CF8] hover:bg-[#6366F1] text-[#080B14] font-bold rounded-xl shadow-glow-primary transition flex items-center justify-center gap-2 active:scale-95"
              >
                <span>Launch Interactive Demo</span>
                <ArrowRight className="w-4 h-4 text-[#080B14]" />
              </button>
              <button 
                onClick={() => setPage('signup')}
                className="w-full sm:w-auto px-8 py-3.5 bg-[#101827] border border-white/15 hover:border-white/30 text-white font-medium rounded-xl transition"
              >
                Create Enterprise Account
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/[0.08] bg-[#080B14] py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-[#94A3B8]">
          <NexusLogo size="sm" badge="v2.4" />
          <div className="flex items-center gap-6">
            <span className="font-mono">© 2026 NexusFlow Technologies Inc.</span>
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span>Security Architecture</span>
          </div>
          <div className="flex items-center gap-2 font-mono text-[11px] text-[#2DD4BF]">
            <span className="w-2 h-2 rounded-full bg-[#2DD4BF] animate-ping" />
            <span>Operational Telemetry Online</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
