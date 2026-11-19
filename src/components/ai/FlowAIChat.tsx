import React, { useState, useRef, useEffect } from 'react';
import { 
  Sparkles, Send, Bot, User, Trash2, ArrowUpRight, Lightbulb, 
  Copy, Check, Terminal, Zap, ShieldCheck, ChevronRight
} from 'lucide-react';
import { Card } from '../common/Card';
import { ChatMessage } from '../../types';
import { useData } from '../../context/DataContext';
import { askFlowAI } from '../../lib/gemini';

const PROMPT_SUGGESTIONS = [
  { label: 'Revenue & Margins', prompt: 'Analyze quarterly revenue and net profit margins' },
  { label: 'Low Stock Risks', prompt: 'Which products are below safety stock threshold buffer?' },
  { label: 'High-Value Leads', prompt: 'Identify top conversion prospects in our CRM pipeline' },
  { label: 'Pending Invoices', prompt: 'How much total balance is pending in accounts receivable?' },
  { label: 'Workforce Telemetry', prompt: 'Summarize active team headcount & attendance status' },
];

export const FlowAIChat: React.FC = () => {
  const { leads, products, orders, invoices, expenses, employees, geminiApiKey } = useData();

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-welcome',
      sender: 'ai',
      text: "👋 Welcome to **FlowAI** — your enterprise intelligence copilot.\n\nI am continuously synced to your workspace state:\n• Sales pipeline deals & conversion likelihoods\n• Warehouse catalog buffer alerts\n• Invoices, cash flow & expenditures\n• Employee attendance and records\n\nAsk me any operational question or select a prompt below to run automated business diagnostics.",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async (queryText?: string) => {
    const textToSend = queryText || input;
    if (!textToSend.trim() || isTyping) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const reply = await askFlowAI(
        textToSend,
        { leads, products, orders, invoices, expenses, employees },
        geminiApiKey
      );

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch {
      setMessages(prev => [
        ...prev,
        {
          id: `ai-err-${Date.now()}`,
          sender: 'ai',
          text: "I encountered an issue analyzing the workspace data. Please verify your network connection or enter a valid Gemini API key in Settings.",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: 'msg-fresh',
        sender: 'ai',
        text: "Conversation session cleared. Ready for your next enterprise query!",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <Card className="flex-1 flex flex-col h-[calc(100vh-14rem)] overflow-hidden border-white/10 shadow-card-elevated" elevated glowTop>
      {/* Chat Subheader */}
      <div className="px-5 py-3 border-b border-white/[0.08] flex items-center justify-between bg-[#151F32]/50">
        <div className="flex items-center gap-2.5">
          <div className="w-2 h-2 rounded-full bg-[#2DD4BF] animate-ping" />
          <span className="text-xs font-semibold text-[#F8FAFC]">
            {geminiApiKey ? 'Gemini 1.5 Pro Connected' : 'NexusFlow Engine Active (Local Context Mode)'}
          </span>
          <span className="text-[10px] font-mono text-[#94A3B8] hidden sm:inline">• Live RLS Telemetry</span>
        </div>

        <button
          onClick={handleClearChat}
          className="text-xs text-[#94A3B8] hover:text-[#F8FAFC] flex items-center gap-1.5 p-1 rounded-lg hover:bg-white/[0.06] transition"
          title="Clear Session"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Reset Context</span>
        </button>
      </div>

      {/* Messages Feed */}
      <div className="flex-1 p-5 md:p-6 overflow-y-auto space-y-4 bg-[#080B14]/60">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
          >
            {/* Avatar */}
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 text-xs font-bold ${
              msg.sender === 'user' 
                ? 'bg-[#151F32] border border-white/15 text-[#818CF8]' 
                : 'bg-gradient-to-tr from-[#818CF8] to-[#2DD4BF] text-[#080B14] shadow-glow-primary'
            }`}>
              {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>

            {/* Bubble / Card */}
            <div className={`max-w-[85%] sm:max-w-[80%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed relative group ${
              msg.sender === 'user'
                ? 'bg-[#151F32] text-white border border-[#818CF8]/30 rounded-tr-none shadow-card-subtle'
                : 'bg-[#101827] text-[#F8FAFC] rounded-tl-none border border-white/[0.08] shadow-card-subtle'
            }`}>
              {/* Copy message button */}
              <button
                onClick={() => handleCopy(msg.text, msg.id)}
                className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 text-[#94A3B8] hover:text-white transition p-1 rounded-md bg-white/[0.05]"
                title="Copy to clipboard"
              >
                {copiedId === msg.id ? <Check className="w-3 h-3 text-[#2DD4BF]" /> : <Copy className="w-3 h-3" />}
              </button>

              <div className="whitespace-pre-wrap font-sans space-y-1">
                {msg.text}
              </div>

              <div className="mt-2.5 pt-2 border-t border-white/[0.04] flex items-center justify-between text-[10px] font-mono text-[#94A3B8]">
                <span>{msg.sender === 'ai' ? 'NexusFlow Intelligence' : 'You'}</span>
                <span>{msg.timestamp}</span>
              </div>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#818CF8] to-[#2DD4BF] text-[#080B14] flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-4 h-4 animate-spin" />
            </div>
            <div className="bg-[#101827] p-3.5 rounded-2xl rounded-tl-none border border-white/[0.08] text-xs text-[#94A3B8] flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-[#818CF8] animate-bounce" />
              <div className="w-1.5 h-1.5 rounded-full bg-[#2DD4BF] animate-bounce" style={{ animationDelay: '0.2s' }} />
              <div className="w-1.5 h-1.5 rounded-full bg-white animate-bounce" style={{ animationDelay: '0.4s' }} />
              <span className="font-mono text-[11px] ml-1">FlowAI is synthesizing workspace telemetry...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Questions Strip */}
      <div className="px-4 py-2.5 border-t border-white/[0.06] overflow-x-auto flex items-center gap-2 bg-[#101827]">
        <span className="text-[11px] font-mono font-semibold text-[#94A3B8] flex items-center gap-1 flex-shrink-0">
          <Terminal className="w-3.5 h-3.5 text-[#818CF8]" /> Suggested:
        </span>
        {PROMPT_SUGGESTIONS.map((sug, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(sug.prompt)}
            className="px-3 py-1 rounded-full text-xs bg-[#151F32] hover:bg-[#818CF8]/15 hover:border-[#818CF8]/40 hover:text-white text-[#94A3B8] border border-white/[0.08] whitespace-nowrap transition active:scale-95 flex items-center gap-1.5"
          >
            <span>{sug.label}</span>
            <ChevronRight className="w-3 h-3 text-slate-500" />
          </button>
        ))}
      </div>

      {/* Command Input Bar */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="p-3.5 border-t border-white/[0.08] flex items-center gap-3 bg-[#101827]"
      >
        <div className="relative flex-1">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask FlowAI anything (e.g. 'Analyze revenue trends', 'What are our low stock SKUs?')..."
            className="w-full pl-4 pr-12 py-2.5 bg-[#151F32] border border-white/[0.08] rounded-xl text-xs sm:text-sm text-[#F8FAFC] placeholder-[#94A3B8]/60 focus:outline-none focus:border-[#818CF8]/50 focus:bg-[#151F32] transition"
          />
          <kbd className="hidden sm:inline-block absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-mono text-[#94A3B8] bg-white/[0.06] px-1.5 py-0.5 rounded border border-white/[0.06]">
            ↵ Enter
          </kbd>
        </div>

        <button
          type="submit"
          disabled={!input.trim() || isTyping}
          className="px-5 py-2.5 bg-[#818CF8] hover:bg-[#6366F1] disabled:opacity-40 text-[#080B14] font-bold rounded-xl text-xs sm:text-sm flex items-center gap-2 shadow-glow-primary transition active:scale-95 shrink-0"
        >
          <Send className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Execute</span>
        </button>
      </form>
    </Card>
  );
};
