import React, { useState } from 'react';
import { 
  Sparkles, ArrowRight, ShieldCheck, CheckCircle2, ChevronRight, 
  Users, Package, Receipt, BarChart3, Bot, Zap, Globe, Layers,
  TrendingUp, Clock, Terminal, ChevronDown
} from 'lucide-react';
import { Page } from '../types';
import { NexusLogo } from '../components/common/NexusLogo';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';

interface LandingPageProps {
  setPage: (p: Page) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ setPage }) => {
  const [activeTab, setActiveTab] = useState<'crm' | 'inventory' | 'finance' | 'ai'>('crm');

  return (
    <div className="min-h-screen bg-[#080B14] text-[#F8FAFC] font-sans overflow-x-hidden selection:bg-[#818CF8]/30 selection:text-white">
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[600px] bg-gradient-to-b from-[#818CF8]/15 via-[#2DD4BF]/5 to-transparent blur-[140px] pointer-events-none rounded-full" />
      <div className="absolute top-96 right-1/4 w-[400px] h-[400px] bg-[#818CF8]/10 blur-[150px] pointer-events-none rounded-full" />

      {/* Top Navbar */}
      <nav className="sticky top-0 z-40 bg-[#080B14]/80 backdrop-blur-md border-b border-white/[0.08]">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <NexusLogo size="md" badge="Enterprise OS" />

          <div className="hidden md:flex items-center gap-7 text-xs font-medium text-[#94A3B8]">
            <a href="#solutions" className="hover:text-white transition">Platform Solutions</a>
            <a href="#features" className="hover:text-white transition">Features</a>
            <a href="#architecture" className="hover:text-white transition">Architecture</a>
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
              className="px-4.5 py-2 text-xs font-semibold bg-[#818CF8] hover:bg-[#6366F1] text-white rounded-xl shadow-glow-primary transition flex items-center gap-1.5 active:scale-95"
            >
              <span>Launch Demo</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-6 pt-20 md:pt-28 pb-32 relative z-10">
        <div className="text-center max-w-4xl mx-auto space-y-6">
          {/* Version pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/10 text-xs text-[#94A3B8] backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-[#2DD4BF] animate-pulse" />
            <span className="font-mono text-[#F8FAFC]">NexusFlow v2.4</span>
            <span className="text-white/20">|</span>
            <span className="text-[#818CF8] font-medium flex items-center gap-1">
              Google Gemini 1.5 Integrated <Sparkles className="w-3 h-3" />
            </span>
          </div>

          {/* Core Headline */}
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight leading-[1.08] text-white">
            Your Business.<br />
            <span className="bg-gradient-to-r from-[#818CF8] via-[#A5B4FC] to-[#2DD4BF] bg-clip-text text-transparent">
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
              className="w-full sm:w-auto px-7 py-3.5 bg-gradient-to-r from-[#818CF8] to-[#6366F1] hover:from-[#6366F1] hover:to-[#4F46E5] text-white font-semibold rounded-xl shadow-glow-primary flex items-center justify-center gap-2 transition active:scale-95"
            >
              <span>Explore Command Center</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button 
              onClick={() => setPage('signup')}
              className="w-full sm:w-auto px-7 py-3.5 bg-[#101827] border border-white/10 hover:border-white/20 hover:bg-[#151F32] text-[#F8FAFC] font-medium rounded-xl transition"
            >
              Start 14-Day Free Trial
            </button>
          </div>

          {/* Enterprise validation strip */}
          <div className="pt-6 flex flex-wrap items-center justify-center gap-6 text-[11px] font-mono text-[#94A3B8]">
            <span className="flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5 text-[#2DD4BF]" /> Supabase PostgreSQL RLS</span>
            <span className="flex items-center gap-1.5"><Zap className="w-3.5 h-3.5 text-amber-300" /> Sub-50ms Global Query Latency</span>
            <span className="flex items-center gap-1.5"><Globe className="w-3.5 h-3.5 text-[#818CF8]" /> Zero-Config Local Persistence</span>
          </div>
        </div>

        {/* Floating Product Preview Showcase */}
        <div className="mt-16 sm:mt-20 relative">
          {/* Floating Widget 1: Revenue Run Rate */}
          <div className="hidden lg:flex absolute -top-8 -left-6 z-20 p-4 bg-[#101827]/90 backdrop-blur-xl border border-white/10 rounded-2xl shadow-card-elevated items-center gap-3.5 animate-floatSlow">
            <div className="w-10 h-10 rounded-xl bg-[#2DD4BF]/10 border border-[#2DD4BF]/20 flex items-center justify-center text-[#2DD4BF]">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase text-[#94A3B8]">Revenue Run Rate</span>
              <div className="text-lg font-bold text-white tabular-nums">$377,000</div>
              <span className="text-[10px] font-semibold text-[#2DD4BF]">+14.2% MoM</span>
            </div>
          </div>

          {/* Floating Widget 2: FlowAI Insight */}
          <div className="hidden lg:flex absolute -bottom-6 -right-6 z-20 p-4 bg-[#101827]/90 backdrop-blur-xl border border-white/10 rounded-2xl shadow-card-elevated items-center gap-3.5 animate-floatSlow" style={{ animationDelay: '-3s' }}>
            <div className="w-10 h-10 rounded-xl bg-[#818CF8]/10 border border-[#818CF8]/20 flex items-center justify-center text-[#818CF8]">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase text-[#94A3B8]">FlowAI Copilot</span>
              <div className="text-xs font-semibold text-white">5 High-Probability Deals</div>
              <span className="text-[10px] text-[#818CF8] font-mono">Predicted Velocity: 94%</span>
            </div>
          </div>

          {/* Main Dashboard Window Mockup */}
          <div className="rounded-2xl border border-white/10 bg-[#101827]/80 backdrop-blur-2xl shadow-card-elevated p-2 sm:p-4 overflow-hidden">
            <div className="rounded-xl border border-white/[0.08] bg-[#080B14] p-4 sm:p-6 space-y-5">
              {/* Window controls bar */}
              <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                  <span className="ml-2 text-xs font-mono text-[#94A3B8]">nexusflow.app/command-center</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-[#2DD4BF] px-2 py-0.5 rounded bg-[#2DD4BF]/10 border border-[#2DD4BF]/20">
                    Live Operational Stream
                  </span>
                </div>
              </div>

              {/* Showcase Metric Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
                <div className="p-3.5 rounded-xl bg-[#101827] border border-white/[0.07]">
                  <span className="text-[11px] font-mono text-[#94A3B8] uppercase">Total Revenue</span>
                  <div className="text-xl font-bold text-white mt-1 tabular-nums">$149,500</div>
                  <span className="text-[11px] text-[#2DD4BF] font-semibold">+14.2% Growth</span>
                </div>
                <div className="p-3.5 rounded-xl bg-[#101827] border border-white/[0.07]">
                  <span className="text-[11px] font-mono text-[#94A3B8] uppercase">Active Pipeline</span>
                  <div className="text-xl font-bold text-white mt-1 tabular-nums">$303,000</div>
                  <span className="text-[11px] text-[#818CF8] font-semibold">5 Active Accounts</span>
                </div>
                <div className="p-3.5 rounded-xl bg-[#101827] border border-white/[0.07]">
                  <span className="text-[11px] font-mono text-[#94A3B8] uppercase">Warehouse Buffer</span>
                  <div className="text-xl font-bold text-white mt-1 tabular-nums">98.4%</div>
                  <span className="text-[11px] text-[#2DD4BF] font-semibold">Optimal Stock</span>
                </div>
                <div className="p-3.5 rounded-xl bg-[#101827] border border-white/[0.07]">
                  <span className="text-[11px] font-mono text-[#94A3B8] uppercase">Staff Attendance</span>
                  <div className="text-xl font-bold text-white mt-1 tabular-nums">100%</div>
                  <span className="text-[11px] text-[#818CF8] font-semibold">5 Present Today</span>
                </div>
              </div>

              {/* Interactive Showcase Tabs */}
              <div className="pt-2">
                <div className="flex items-center gap-2 border-b border-white/[0.08] pb-2 text-xs">
                  {[
                    { id: 'crm', label: 'CRM Sales Funnel', icon: Users },
                    { id: 'inventory', label: 'Inventory & SKUs', icon: Package },
                    { id: 'finance', label: 'Financial Billing', icon: Receipt },
                    { id: 'ai', label: 'FlowAI Layer', icon: Sparkles },
                  ].map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition ${
                        activeTab === tab.id 
                          ? 'bg-white/[0.08] text-white border border-white/10' 
                          : 'text-[#94A3B8] hover:text-white'
                      }`}
                    >
                      <tab.icon className="w-3.5 h-3.5 text-[#818CF8]" />
                      <span>{tab.label}</span>
                    </button>
                  ))}
                </div>

                {/* Tab content simulation */}
                <div className="mt-4 p-4 rounded-xl bg-[#101827] border border-white/[0.07] min-h-[140px] flex items-center justify-between text-xs">
                  {activeTab === 'crm' && (
                    <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-4">
                      <div>
                        <h4 className="font-semibold text-sm text-white">High-Velocity Deal Flow</h4>
                        <p className="text-[#94A3B8] mt-0.5">Michael Chang (Global Tech) in Proposal stage with $120,000 deal value.</p>
                      </div>
                      <Badge variant="purple" dot>AI Closing Probability: 94%</Badge>
                    </div>
                  )}
                  {activeTab === 'inventory' && (
                    <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-4">
                      <div>
                        <h4 className="font-semibold text-sm text-white">Dynamic Buffer Thresholds</h4>
                        <p className="text-[#94A3B8] mt-0.5">Automated re-order triggers active across Cloud Hardware licenses.</p>
                      </div>
                      <Badge variant="success">Buffer Health: Normal</Badge>
                    </div>
                  )}
                  {activeTab === 'finance' && (
                    <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-4">
                      <div>
                        <h4 className="font-semibold text-sm text-white">Automated Accounts Receivable</h4>
                        <p className="text-[#94A3B8] mt-0.5">Real-time ledger balancing with tax calculation and one-click receipt issuance.</p>
                      </div>
                      <Badge variant="accent">Settled: $15,000</Badge>
                    </div>
                  )}
                  {activeTab === 'ai' && (
                    <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-4">
                      <div>
                        <h4 className="font-semibold text-sm text-white">Real-Time Context Ingestion</h4>
                        <p className="text-[#94A3B8] mt-0.5">Google Gemini 1.5 actively parsing sales trends, inventory buffers, and cash flow.</p>
                      </div>
                      <Badge variant="purple">Gemini Engine Ready</Badge>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Matrix */}
        <div id="features" className="mt-32 pt-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-mono font-semibold tracking-wider text-[#818CF8] uppercase">
              Unified Architecture
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
              Built for Modern Operating Velocity
            </h2>
            <p className="text-sm text-[#94A3B8]">
              Replace fragmented tools with an interconnected system built for precision and scale.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-7 bg-[#101827] border-white/[0.08]" hoverable>
              <div className="w-10 h-10 rounded-xl bg-[#818CF8]/10 border border-[#818CF8]/20 flex items-center justify-center text-[#818CF8] mb-5">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white mb-2">High-Velocity CRM</h3>
              <p className="text-xs text-[#94A3B8] leading-relaxed mb-4">
                Structured Kanban pipeline stages, one-click customer conversion, and AI lead scoring that adapts to deal parameters.
              </p>
              <ul className="space-y-2 text-xs text-slate-300">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-[#2DD4BF]" /> Deal Stage Advancement</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-[#2DD4BF]" /> Automated Conversion Funnels</li>
              </ul>
            </Card>

            <Card className="p-7 bg-[#101827] border-white/[0.08]" hoverable>
              <div className="w-10 h-10 rounded-xl bg-[#2DD4BF]/10 border border-[#2DD4BF]/20 flex items-center justify-center text-[#2DD4BF] mb-5">
                <Package className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white mb-2">Inventory Operations</h3>
              <p className="text-xs text-[#94A3B8] leading-relaxed mb-4">
                SKU catalog control, automated safety buffer warnings, instant Stock In/Out logging, and multi-item purchase fulfillment.
              </p>
              <ul className="space-y-2 text-xs text-slate-300">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-[#2DD4BF]" /> Real-time Stock Buffers</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-[#2DD4BF]" /> Automated Deductions</li>
              </ul>
            </Card>

            <Card className="p-7 bg-[#101827] border-white/[0.08]" hoverable>
              <div className="w-10 h-10 rounded-xl bg-[#818CF8]/10 border border-[#818CF8]/20 flex items-center justify-center text-[#818CF8] mb-5">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white mb-2">FlowAI Intelligence Layer</h3>
              <p className="text-xs text-[#94A3B8] leading-relaxed mb-4">
                Natural language copilot with instant access to your enterprise database for immediate financial health and pipeline assessments.
              </p>
              <ul className="space-y-2 text-xs text-slate-300">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-[#2DD4BF]" /> Google Gemini 1.5 Powered</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-[#2DD4BF]" /> Offline Rule Engine Fallback</li>
              </ul>
            </Card>
          </div>
        </div>

        {/* Pricing Matrix */}
        <div id="pricing" className="mt-32 pt-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-mono font-semibold tracking-wider text-[#818CF8] uppercase">
              Pricing Plans
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
              Predictable, Transparent Pricing
            </h2>
            <p className="text-sm text-[#94A3B8]">
              Deploy across your enterprise with no hidden seat fees.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {/* Starter */}
            <Card className="p-7 bg-[#101827] border-white/[0.08] flex flex-col justify-between">
              <div>
                <h4 className="text-base font-bold text-white">Starter</h4>
                <p className="text-xs text-[#94A3B8] mt-1">For growing teams & startups.</p>
                <div className="mt-5 mb-6">
                  <span className="text-3xl font-extrabold text-white font-mono">$49</span>
                  <span className="text-xs text-[#94A3B8]"> / month</span>
                </div>
                <ul className="space-y-2.5 text-xs text-slate-300 mb-8">
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-[#818CF8]" /> Up to 5 team members</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-[#818CF8]" /> Full CRM & Kanban pipeline</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-[#818CF8]" /> 500 SKU warehouse tracking</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-[#818CF8]" /> Standard FlowAI queries</li>
                </ul>
              </div>
              <button onClick={() => setPage('signup')} className="w-full py-2.5 bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-white rounded-xl text-xs font-semibold transition">
                Start Trial
              </button>
            </Card>

            {/* Growth Enterprise */}
            <Card className="p-7 bg-[#151F32] border-[#818CF8]/50 shadow-glow-primary flex flex-col justify-between relative">
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-[#818CF8] text-white text-[10px] font-mono uppercase tracking-wider font-bold rounded-full">
                Recommended
              </span>
              <div>
                <h4 className="text-base font-bold text-white">Growth Enterprise</h4>
                <p className="text-xs text-[#94A3B8] mt-1">For expanding B2B operations.</p>
                <div className="mt-5 mb-6">
                  <span className="text-3xl font-extrabold text-white font-mono">$149</span>
                  <span className="text-xs text-[#94A3B8]"> / month</span>
                </div>
                <ul className="space-y-2.5 text-xs text-slate-300 mb-8">
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-[#2DD4BF]" /> Unlimited team members</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-[#2DD4BF]" /> Supabase PostgreSQL Multi-Tenant RLS</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-[#2DD4BF]" /> Unlimited SKUs & itemized invoicing</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-[#2DD4BF]" /> Live Google Gemini 1.5 Pro Copilot</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-[#2DD4BF]" /> Priority 24/7 SLA & Data Export</li>
                </ul>
              </div>
              <button onClick={() => setPage('dashboard')} className="w-full py-2.5 bg-[#818CF8] hover:bg-[#6366F1] text-white rounded-xl text-xs font-semibold shadow-md transition">
                Launch Workspace
              </button>
            </Card>

            {/* Dedicated */}
            <Card className="p-7 bg-[#101827] border-white/[0.08] flex flex-col justify-between">
              <div>
                <h4 className="text-base font-bold text-white">Custom Dedicated</h4>
                <p className="text-xs text-[#94A3B8] mt-1">For custom compliance & on-prem.</p>
                <div className="mt-5 mb-6">
                  <span className="text-3xl font-extrabold text-white font-mono">Custom</span>
                </div>
                <ul className="space-y-2.5 text-xs text-slate-300 mb-8">
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-[#818CF8]" /> Dedicated database cluster</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-[#818CF8]" /> Custom ERP / CRM integrations</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-[#818CF8]" /> SOC2 Type II & HIPAA compliance</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-[#818CF8]" /> Dedicated Solutions Architect</li>
                </ul>
              </div>
              <button onClick={() => setPage('signup')} className="w-full py-2.5 bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-white rounded-xl text-xs font-semibold transition">
                Contact Enterprise
              </button>
            </Card>
          </div>
        </div>

        {/* Bottom CTA Banner */}
        <div className="mt-32 rounded-3xl bg-gradient-to-r from-[#101827] via-[#151F32] to-[#101827] border border-white/10 p-10 sm:p-14 text-center space-y-6 relative overflow-hidden shadow-card-elevated">
          <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-96 h-96 bg-[#818CF8]/10 blur-[100px] pointer-events-none rounded-full" />

          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Ready to upgrade your enterprise velocity?
          </h2>
          <p className="text-sm text-[#94A3B8] max-w-xl mx-auto">
            Experience the complete NexusFlow operating system with pre-loaded leads, inventory, invoices, and the FlowAI copilot.
          </p>
          <div className="pt-2">
            <button
              onClick={() => setPage('dashboard')}
              className="px-8 py-3.5 bg-[#818CF8] hover:bg-[#6366F1] text-white font-semibold rounded-xl shadow-glow-primary transition active:scale-95"
            >
              Launch Live Workspace
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/[0.08] py-10 px-6 text-xs text-[#94A3B8]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <NexusLogo size="sm" showText={true} />
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-white transition">Privacy Policy</a>
            <a href="#" className="hover:text-white transition">Security Architecture</a>
            <a href="#" className="hover:text-white transition">API Documentation</a>
            <button onClick={() => setPage('login')} className="text-[#818CF8] hover:underline font-medium">Staff Sign In</button>
          </div>
          <span className="font-mono text-[11px] text-slate-500">
            © {new Date().getFullYear()} NexusFlow Inc.
          </span>
        </div>
      </footer>
    </div>
  );
};
