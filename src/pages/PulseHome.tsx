import React, { useState } from 'react';
import {
  Sparkles,
  Search,
  ChevronRight,
  TrendingUp,
  ShieldCheck,
  Zap,
  Target,
  MessageCircle,
  Award,
  X,
  ExternalLink,
  Bot,
  Grid,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const PulseHome: React.FC = () => {
  const { setActiveScreen, setActiveChannelId, openLeadModal } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [briefModalOpen, setBriefModalOpen] = useState(false);
  const [qaAnswer, setQaAnswer] = useState<string | null>(null);

  const handleOpenChannel = (channelId: string) => {
    setActiveChannelId(channelId);
    setActiveScreen('pulse-channel');
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    const q = searchQuery.toLowerCase();
    if (q.includes('mukunda') || q.includes('ortho') || q.includes('8490') || q.includes('quote')) {
      setQaAnswer(
        'Mukunda is waiting for the Ortho GRID quotation (₹8,490) with No-Cost EMI approval. SLA deadline in 2h.'
      );
    } else if (q.includes('priya') || q.includes('callback') || q.includes('dispute') || q.includes('4:30')) {
      setQaAnswer(
        'Priya Iyer has a scheduled 4:30 PM callback in #callcentre-team regarding ₹1,200 discount code application.'
      );
    } else {
      setQaAnswer(
        `AvaniBot searched Pulse for "${searchQuery}": Found 2 related items in #callcentre-team.`
      );
    }
  };

  return (
    <div className="space-y-4 pb-20 animate-in fade-in duration-150">
      {/* 1. Purple Header Bar */}
      <div className="rounded-xl bg-[#3b0764] text-white px-4 py-3 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 rounded-md bg-white/10 flex items-center justify-center text-purple-200">
            <Grid className="w-3.5 h-3.5" />
          </div>
          <h1 className="text-sm font-bold tracking-tight text-white flex items-center gap-2">
            <span>Pulse</span>
            <span className="text-xs text-purple-200 font-normal">The Sleep Company · Koramangala</span>
          </h1>
        </div>
      </div>

      {/* 2. Full-Width Search Input */}
      <form onSubmit={handleSearchSubmit} className="relative">
        <div className="relative flex items-center bg-white rounded-xl border border-stone-200 shadow-2xs focus-within:border-purple-600 focus-within:ring-1 focus-within:ring-purple-600">
          <div className="pl-3.5 pr-2 text-purple-600">
            <Sparkles className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Ask AvaniBot or search Pulse..."
            className="w-full py-2.5 pr-10 text-xs text-charcoal bg-transparent placeholder-stone-400 focus:outline-hidden"
          />
          <button
            type="submit"
            className="absolute right-2.5 p-1 rounded-md text-stone-400 hover:text-purple-700"
            title="Search Pulse"
          >
            <Search className="w-4 h-4" />
          </button>
        </div>

        {qaAnswer && (
          <div className="mt-2 p-3 rounded-xl bg-purple-50 border border-purple-200 text-purple-950 flex items-start justify-between gap-3 text-xs shadow-2xs">
            <div className="flex items-start gap-2">
              <Bot className="w-4 h-4 text-purple-700 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">{qaAnswer}</p>
                {searchQuery.toLowerCase().includes('mukunda') && (
                  <button
                    type="button"
                    onClick={() => openLeadModal('lead-1')}
                    className="mt-1 text-[11px] font-bold text-purple-700 hover:underline flex items-center gap-1"
                  >
                    <span>Open Mukunda's Lead File (₹8,490)</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>
            <button
              type="button"
              onClick={() => setQaAnswer(null)}
              className="p-1 rounded text-purple-400 hover:text-purple-700"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </form>

      {/* 3. AvaniBot Panel */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-[#4c1d95] via-[#581c87] to-[#3b0764] text-white shadow-xs relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-200" />
              <span className="font-bold text-sm text-white">AvaniBot</span>
              <span className="text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-400/20 text-emerald-300 border border-emerald-400/30">
                ALWAYS ON
              </span>
            </div>
            <p className="text-xs text-purple-100 max-w-xl leading-relaxed">
              Ask me about anything happening in Pulse — daily briefs, action items, quick answers
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setBriefModalOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 active:scale-95 text-white text-xs font-bold border border-white/20 backdrop-blur-xs transition-all flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Daily Brief</span>
            </button>
            <button
              type="button"
              onClick={() => {
                const input = document.querySelector('input[placeholder*="Ask AvaniBot"]') as HTMLInputElement;
                input?.focus();
              }}
              className="px-3 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 active:scale-95 text-white text-xs font-bold border border-white/20 backdrop-blur-xs transition-all flex items-center gap-1.5"
            >
              <span>💬 Ask a question</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4. Custom Agents Card */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-xs divide-y divide-stone-100 overflow-hidden text-xs">
        <div className="px-5 py-3.5 bg-stone-50/70 border-b border-stone-100">
          <div className="flex items-center gap-1.5 text-xs font-bold text-charcoal">
            <Sparkles className="w-3.5 h-3.5 text-purple-600" />
            <span>Custom Agents</span>
          </div>
          <p className="text-[11px] text-stone-500 mt-0.5">
            Set up by your manager — already live, tap to open
          </p>
        </div>

        {/* ROLE AGENTS */}
        <div className="p-4 space-y-2">
          <div className="text-[10px] font-bold uppercase tracking-wider text-stone-400 px-1">
            ROLE AGENTS (run a team)
          </div>

          <button
            type="button"
            onClick={() => handleOpenChannel('chan-callcentre-team')}
            className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-stone-50 transition-colors group text-left"
          >
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
                #
              </div>
              <div>
                <span className="font-bold text-xs text-charcoal group-hover:text-purple-700">
                  # callcentre-agent
                </span>
                <p className="text-[11px] text-stone-400">Call Centre Agent</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-stone-300 group-hover:text-stone-500 transition-colors" />
          </button>
        </div>

        {/* TASK AGENTS */}
        <div className="p-4 space-y-2">
          <div className="text-[10px] font-bold uppercase tracking-wider text-stone-400 px-1">
            TASK AGENTS (move one metric)
          </div>

          <div className="space-y-1">
            {/* cross-sell-agent */}
            <div className="flex items-center justify-between p-2.5 rounded-xl hover:bg-stone-50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-xs">
                  #
                </div>
                <div>
                  <span className="font-bold text-xs text-charcoal"># cross-sell-agent</span>
                  <p className="text-[11px] text-stone-400">Your Attach rate · 5 members</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-md bg-stone-100 text-stone-700 font-extrabold text-[10px]">
                  24%
                </span>
                <ChevronRight className="w-4 h-4 text-stone-300" />
              </div>
            </div>

            {/* sop-agent */}
            <div className="flex items-center justify-between p-2.5 rounded-xl hover:bg-stone-50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-lg bg-teal-100 text-teal-700 flex items-center justify-center font-bold text-xs">
                  #
                </div>
                <div>
                  <span className="font-bold text-xs text-charcoal"># sop-agent</span>
                  <p className="text-[11px] text-stone-400">Your SOP adherence · 5 members</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-md bg-stone-100 text-stone-700 font-extrabold text-[10px]">
                  81%
                </span>
                <ChevronRight className="w-4 h-4 text-stone-300" />
              </div>
            </div>

            {/* lead-conversion-agent */}
            <div className="flex items-center justify-between p-2.5 rounded-xl hover:bg-stone-50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-xs">
                  #
                </div>
                <div>
                  <span className="font-bold text-xs text-charcoal"># lead-conversion-agent</span>
                  <p className="text-[11px] text-stone-400">Lead Conversion Agent</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-stone-300" />
            </div>

            {/* capture-agent */}
            <div className="flex items-center justify-between p-2.5 rounded-xl hover:bg-stone-50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs">
                  #
                </div>
                <div>
                  <span className="font-bold text-xs text-charcoal"># capture-agent</span>
                  <p className="text-[11px] text-stone-400">Your Capture Coverage · 5 members</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-md bg-stone-100 text-stone-700 font-extrabold text-[10px]">
                  78%
                </span>
                <ChevronRight className="w-4 h-4 text-stone-300" />
              </div>
            </div>
          </div>
        </div>

        {/* GENERAL */}
        <div className="p-4 space-y-2">
          <div className="text-[10px] font-bold uppercase tracking-wider text-stone-400 px-1">
            GENERAL
          </div>

          <button
            type="button"
            onClick={() => handleOpenChannel('chan-customer-discussions')}
            className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-stone-50 transition-colors group text-left"
          >
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs">
                <MessageCircle className="w-4 h-4 text-emerald-600" />
              </div>
              <div>
                <span className="font-bold text-xs text-charcoal group-hover:text-emerald-700">
                  customer-discussions
                </span>
                <p className="text-[11px] text-stone-400">Relayed via WhatsApp Business</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-stone-300 group-hover:text-stone-500 transition-colors" />
          </button>
        </div>
      </div>

      {/* 5. Kudos Card */}
      <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-amber-700">💡</span>
            <span className="font-bold text-charcoal">Kudos</span>
            <span className="px-2 py-0.2 rounded-full bg-amber-200 text-amber-900 font-extrabold text-[10px]">
              3 NEW
            </span>
          </div>
          <p className="text-[11px] text-stone-600 italic">
            "Great work with Mukunda — closed that objection beautifully... Sunita Rao"
          </p>
        </div>

        <span className="text-[10px] font-extrabold tracking-wider text-stone-400 self-end sm:self-center">
          12 ALL-TIME
        </span>
      </div>

      {/* Daily Brief Modal */}
      {briefModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl border border-stone-200 max-w-lg w-full p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div className="flex items-center gap-2 font-bold text-sm text-charcoal">
                <Sparkles className="w-4 h-4 text-purple-600" />
                <span>Daily Brief · Koramangala Hub</span>
              </div>
              <button
                type="button"
                onClick={() => setBriefModalOpen(false)}
                className="p-1 rounded text-stone-400 hover:text-charcoal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2.5 text-xs text-charcoal leading-relaxed">
              <p>• <strong>Mukunda (Ortho GRID):</strong> Deliver ₹8,490 quote with 10-year warranty certificate within 2 hours.</p>
              <p>• <strong>Priya Iyer:</strong> 4:30 PM callback in #callcentre-team. ₹1,200 courtesy credit approved.</p>
              <p>• <strong>Team SOP adherence:</strong> Currently at 81%.</p>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setBriefModalOpen(false)}
                className="px-4 py-1.5 rounded-lg bg-stone-900 text-white text-xs font-bold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
