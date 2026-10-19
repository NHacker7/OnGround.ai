import React, { useState } from 'react';
import {
  X,
  ChevronRight,
  ChevronDown,
  Clock,
  Phone,
  Shield,
  FileText,
  Users,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useCalling } from '../../context/CallingContext';

export const LeadDetailsModal: React.FC = () => {
  const { isLeadModalOpen, selectedLead, closeLeadModal, nextLead, prevLead, leads, openLeadModal } =
    useApp();
  const { startCall } = useCalling();

  const [icpExpanded, setIcpExpanded] = useState(false);
  const [historyExpanded, setHistoryExpanded] = useState(false);
  const [signalsExpanded, setSignalsExpanded] = useState(true);

  if (!isLeadModalOpen || !selectedLead) return null;

  const currentIndex = Math.max(
    0,
    leads.findIndex((l) => l.id === selectedLead.id)
  );
  const totalLeads = leads.length || 5;

  const handleCall = (mode: 'human-agent' | 'voice-ai' = 'voice-ai') => {
    startCall(
      {
        id: selectedLead.id,
        name: selectedLead.name,
        company: selectedLead.company,
        phone: selectedLead.phone,
      },
      mode
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-3 overflow-y-auto animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl border border-stone-200 max-w-md w-full shadow-2xl overflow-hidden flex flex-col max-h-[94vh] animate-in zoom-in-95 duration-150 text-charcoal">
        {/* 1. Purple Header Bar */}
        <div className="px-5 py-3.5 bg-gradient-to-r from-[#3b0764] via-[#4c1d95] to-[#3b0764] text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-purple-200" />
            <div>
              <h2 className="text-sm font-bold tracking-tight text-white leading-tight">Leads</h2>
              <p className="text-[10px] text-purple-200">
                Lead {currentIndex + 1} of {totalLeads} · SLA to close
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={closeLeadModal}
            className="w-6 h-6 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-purple-200 hover:text-white transition-colors"
            title="Close Modal"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 2. Stepper Indicator Row */}
        <div className="px-5 py-2.5 bg-stone-50 border-b border-stone-200 flex items-center justify-between">
          <div className="flex-1 flex items-center justify-center gap-1.5 pl-6">
            {leads.map((l, index) => {
              const isActive = index === currentIndex;
              return (
                <button
                  key={l.id}
                  type="button"
                  onClick={() => openLeadModal(l.id)}
                  title={`Lead ${index + 1}`}
                  className={`transition-all ${
                    isActive
                      ? 'w-5 h-1.5 bg-purple-700 rounded-full'
                      : 'w-1.5 h-1.5 bg-stone-300 hover:bg-stone-400 rounded-full'
                  }`}
                />
              );
            })}
          </div>

          <button
            type="button"
            onClick={nextLead}
            className="w-6 h-6 rounded-full border border-stone-200 bg-white hover:bg-stone-100 flex items-center justify-center text-charcoal transition-all active:scale-95 shadow-2xs"
            title="Next Lead"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-3.5 text-xs">
          {/* Status Dot */}
          <div className="flex items-center gap-1.5 text-emerald-700 font-extrabold text-[11px]">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
            <span>OPEN</span>
          </div>

          {/* Lead Info Row */}
          <div className="flex items-start justify-between gap-2.5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-800 font-extrabold text-sm flex items-center justify-center shrink-0 border border-emerald-200">
                {selectedLead.name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')
                  .slice(0, 2)
                  .toUpperCase()}
              </div>

              <div>
                <h3 className="text-base font-extrabold text-charcoal tracking-tight leading-tight">
                  {selectedLead.name}
                </h3>
                <p className="text-[11px] text-charcoal-muted mt-0.5">
                  Interested: {selectedLead.interestedProduct || 'Ortho GRID · ₹8,490'}
                </p>
              </div>
            </div>

            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 shrink-0">
              {selectedLead.slaTimeLeft || '2h left'}
            </span>
          </div>

          {/* Notice Banner */}
          <div className="px-3 py-2 rounded-xl bg-amber-50 border border-amber-200/80 text-amber-900 text-[11px] font-semibold flex items-center gap-2">
            <span>📋</span>
            <span>{selectedLead.quoteNotice || 'Quote to be given to customer'}</span>
          </div>

          {/* Score Meters */}
          <div className="space-y-2">
            {/* ICP Bar */}
            <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200 flex items-center justify-between gap-3">
              <span className="font-bold text-[11px] text-charcoal flex items-center gap-1">
                <span>🎯</span>
                <span>ICP</span>
              </span>
              <div className="flex-1 bg-stone-200 h-2 rounded-full overflow-hidden mx-2">
                <div
                  className="bg-emerald-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${selectedLead.icpScore}%` }}
                />
              </div>
              <span className="font-extrabold text-xs text-charcoal">{selectedLead.icpScore}%</span>
            </div>

            {/* Lead Intent Score */}
            <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200 flex items-center justify-between">
              <span className="font-bold text-[11px] text-charcoal flex items-center gap-1">
                <span>🎯</span>
                <span>Lead Intent Score</span>
              </span>
              <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-extrabold text-xs">
                {selectedLead.intentScore}
              </span>
            </div>
          </div>

          {/* Collapsible 1: ICP FIT BREAKDOWN */}
          <div className="rounded-xl border border-stone-200 overflow-hidden">
            <button
              type="button"
              onClick={() => setIcpExpanded((prev) => !prev)}
              className="w-full px-3.5 py-2.5 bg-stone-50 hover:bg-stone-100 flex items-center justify-between text-[11px] font-bold text-charcoal tracking-wide transition-colors"
            >
              <span>ICP FIT BREAKDOWN</span>
              <ChevronRight
                className={`w-3.5 h-3.5 text-stone-400 transition-transform ${
                  icpExpanded ? 'rotate-90' : ''
                }`}
              />
            </button>
            {icpExpanded && (
              <div className="p-3 bg-white border-t border-stone-200 space-y-1.5 text-[11px]">
                {(
                  selectedLead.icpBreakdown || [
                    { label: 'Budget Match', score: '92%', detail: 'Fit for ₹8,490+ premium mattress tier' },
                    { label: 'Decision Authority', score: '95%', detail: 'Direct buyer with immediate purchase intent' },
                    { label: 'Location Coverage', score: '100%', detail: 'Koramangala, Bengaluru hub' },
                  ]
                ).map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between py-1 border-b border-stone-100 last:border-none">
                    <span className="text-stone-600">{item.label}</span>
                    <span className="font-bold text-emerald-700">{item.score}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Collapsible 2: HOW WE GOT HERE */}
          <div className="rounded-xl border border-stone-200 overflow-hidden">
            <button
              type="button"
              onClick={() => setHistoryExpanded((prev) => !prev)}
              className="w-full px-3.5 py-2.5 bg-stone-50 hover:bg-stone-100 flex items-center justify-between text-[11px] font-bold text-charcoal tracking-wide transition-colors"
            >
              <span className="flex items-center gap-1.5 text-purple-900">
                <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                <span>HOW WE GOT HERE</span>
              </span>
              <ChevronRight
                className={`w-3.5 h-3.5 text-stone-400 transition-transform ${
                  historyExpanded ? 'rotate-90' : ''
                }`}
              />
            </button>
            {historyExpanded && (
              <div className="p-3 bg-white border-t border-stone-200 space-y-2 text-[11px]">
                {(
                  selectedLead.howWeGotHere || [
                    { step: 'Inbound WhatsApp Inquiry', timestamp: '10:12 AM', note: 'Inquired via WhatsApp Business Campaign' },
                    { step: 'Product Brochure Viewed', timestamp: '10:14 AM', note: 'Viewed Ortho GRID technical PDF' },
                    { step: 'Cart Abandonment Signal', timestamp: '10:20 AM', note: 'Added King Size to cart, stopped at EMI step' },
                  ]
                ).map((step, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-600 mt-1.5 shrink-0" />
                    <div>
                      <p className="font-bold text-charcoal">{step.step}</p>
                      <p className="text-[10px] text-stone-500">{step.note}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Collapsible 3: WHERE WE PICKED UP SIGNALS (Collapsible, expanded by default) */}
          <div className="rounded-xl border border-stone-200 overflow-hidden">
            <button
              type="button"
              onClick={() => setSignalsExpanded((prev) => !prev)}
              className="w-full px-3.5 py-2.5 bg-stone-50 hover:bg-stone-100 flex items-center justify-between text-[11px] font-bold text-charcoal tracking-wide transition-colors"
            >
              <span className="flex items-center gap-1.5">
                <span>📑</span>
                <span>WHERE WE PICKED UP SIGNALS</span>
              </span>
              <ChevronDown
                className={`w-3.5 h-3.5 text-stone-400 transition-transform ${
                  signalsExpanded ? '' : '-rotate-90'
                }`}
              />
            </button>

            {signalsExpanded && (
              <div className="p-3 bg-stone-50/60 border-t border-stone-200 space-y-2.5">
                {/* Signal 1 */}
                <div className="p-2.5 rounded-lg bg-white border border-stone-200 space-y-1">
                  <div className="flex items-center gap-1 text-[11px] font-bold text-charcoal">
                    <span>⚡</span>
                    <span>Financing Related</span>
                  </div>
                  <p className="text-[10px] text-stone-600 leading-relaxed pl-4">
                    Asked specifically about EMI options on the Ortho GRID — budget is a live concern, not a blocker
                  </p>
                </div>

                {/* Signal 2 */}
                <div className="p-2.5 rounded-lg bg-white border border-stone-200 space-y-1">
                  <div className="flex items-center gap-1 text-[11px] font-bold text-charcoal">
                    <span>📄</span>
                    <span>Quotation Demanded</span>
                  </div>
                  <p className="text-[10px] text-stone-600 leading-relaxed pl-4">
                    Compared pricing with a competitor before reaching out — price-anchored, expects a competitive number
                  </p>
                </div>

                {/* Signal 3 */}
                <div className="p-2.5 rounded-lg bg-white border border-stone-200 space-y-1">
                  <div className="flex items-center gap-1 text-[11px] font-bold text-charcoal">
                    <span>🛡️</span>
                    <span>Warranty Related</span>
                  </div>
                  <p className="text-[10px] text-stone-600 leading-relaxed pl-4">
                    Hasn't raised this yet — worth proactively mentioning the 100-night trial to reduce perceived risk
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Cumulative Missed Warning Banner */}
          <div className="pt-1 text-[10px] font-bold text-red-600 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-red-600 shrink-0" />
            <span>
              CUMULATIVE MISSED: {selectedLead.cumulativeMissed ?? 2} · expired without close,
              visible to manager
            </span>
          </div>

          {/* Calling Bar at bottom */}
          <div className="pt-2 flex items-center justify-center gap-2 border-t border-stone-100">
            <span className="px-2 py-0.5 rounded-md bg-stone-100 text-stone-600 text-[10px] font-extrabold uppercase">
              DEMO
            </span>
            <button
              type="button"
              onClick={() => handleCall('voice-ai')}
              className="px-3 py-1.5 rounded-full bg-purple-700 hover:bg-purple-800 text-white text-[11px] font-bold shadow-xs transition-all flex items-center gap-1"
            >
              <Phone className="w-3 h-3 text-purple-200" />
              <span>In-app call</span>
            </button>
            <button
              type="button"
              onClick={() => handleCall('human-agent')}
              className="px-3 py-1.5 rounded-full bg-forest hover:bg-forest-hover text-white text-[11px] font-bold shadow-xs transition-all flex items-center gap-1"
            >
              <Phone className="w-3 h-3 text-emerald-300" />
              <span>Phone call</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
