import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Send, Bot, User, Trash2, ArrowUpRight, Lightbulb } from 'lucide-react';
import { Card } from '../common/Card';
import { ChatMessage } from '../../types';
import { useData } from '../../context/DataContext';
import { askFlowAI } from '../../lib/gemini';

const PROMPT_SUGGESTIONS = [
  '📊 Analyze revenue & profit margins',
  '⚠️ Which products have low stock?',
  '🎯 What are our top high-value leads?',
  '🧾 How much is pending in invoices?',
  '👥 Summarize workforce attendance'
];

export const FlowAIChat: React.FC = () => {
  const { leads, products, orders, invoices, expenses, employees, geminiApiKey } = useData();

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-welcome',
      sender: 'ai',
      text: "👋 Welcome to **FlowAI**! I am your real-time ERP & CRM intelligence copilot.\n\nI have instant access to your live database:\n• Sales pipeline & leads\n• Warehouse stock & SKU alerts\n• Invoices, cash flow & expenditures\n• Employee attendance and records\n\nHow can I assist your business operations today?",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
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
          text: "I encountered an issue analyzing the workspace data. Please check your network or try a different query.",
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
        text: "Conversation cleared. Ready for your next enterprise query!",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  return (
    <Card className="flex-1 flex flex-col h-[calc(100vh-13rem)] overflow-hidden">
      {/* Chat Subheader */}
      <div className="px-6 py-3 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/40">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            {geminiApiKey ? 'Gemini 1.5 Pro Copilot Active' : 'NexusFlow Engine Active (Local Context Mode)'}
          </span>
        </div>
        <button
          onClick={handleClearChat}
          className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 flex items-center gap-1 transition"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Clear Session</span>
        </button>
      </div>

      {/* Messages Feed */}
      <div className="flex-1 p-6 overflow-y-auto space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
          >
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 text-xs font-bold ${
              msg.sender === 'user' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gradient-to-tr from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-500/20'
            }`}>
              {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>

            <div className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 text-sm leading-relaxed ${
              msg.sender === 'user'
                ? 'bg-blue-600 text-white rounded-tr-none shadow-sm'
                : 'bg-slate-100 dark:bg-slate-800/90 text-slate-900 dark:text-slate-100 rounded-tl-none border border-slate-200 dark:border-slate-700/80'
            }`}>
              <div className="whitespace-pre-wrap">{msg.text}</div>
              <span className={`block text-[10px] mt-2 text-right ${
                msg.sender === 'user' ? 'text-blue-200' : 'text-slate-400'
              }`}>
                {msg.timestamp}
              </span>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white flex items-center justify-center flex-shrink-0">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-2xl rounded-tl-none border border-slate-200 dark:border-slate-700 text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-500 animate-spin" />
              <span>FlowAI is calculating metrics and analyzing records...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggestion Chips */}
      <div className="px-4 py-2 border-t border-slate-100 dark:border-slate-800/60 overflow-x-auto flex items-center gap-2 bg-slate-50/30 dark:bg-slate-900/30">
        <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1 flex-shrink-0">
          <Lightbulb className="w-3.5 h-3.5 text-amber-500" /> Prompts:
        </span>
        {PROMPT_SUGGESTIONS.map((sug, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(sug)}
            className="px-2.5 py-1 rounded-full text-xs bg-slate-200/60 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-slate-700 hover:text-blue-600 dark:hover:text-blue-400 text-slate-600 dark:text-slate-300 border border-slate-300/40 dark:border-slate-700 whitespace-nowrap transition"
          >
            {sug}
          </button>
        ))}
      </div>

      {/* Input Bar */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="p-4 border-t border-slate-200 dark:border-slate-800 flex items-center gap-3 bg-white dark:bg-slate-900"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask FlowAI anything (e.g. 'Draft forecast for next month', 'Find high-risk invoices')..."
          className="flex-1 px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 transition"
        />
        <button
          type="submit"
          disabled={!input.trim() || isTyping}
          className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-xl text-sm font-semibold flex items-center gap-2 shadow-sm transition"
        >
          <Send className="w-4 h-4" />
          <span className="hidden sm:inline">Send</span>
        </button>
      </form>
    </Card>
  );
};
