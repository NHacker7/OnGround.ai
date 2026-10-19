import React, { useState } from 'react';
import {
  X,
  ChevronLeft,
  ChevronRight,
  Phone,
  Mail,
  MapPin,
  Building,
  DollarSign,
  TrendingUp,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Calendar,
  Clock,
  ArrowRight,
  CheckCircle,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useCalling } from '../../context/CallingContext';
import { Badge } from '../common/Badge';
import { ScoreMeter } from '../common/ScoreMeter';

export const LeadDetailsModal: React.FC = () => {
  const { isLeadModalOpen, selectedLead, closeLeadModal, nextLead, prevLead } = useApp();
  const { startCall } = useCalling();
  const [expandedSignalId, setExpandedSignalId] = useState<string | null>(null);

  if (!isLeadModalOpen || !selectedLead) return null;

  const toggleSignal = (id: string) => {
    setExpandedSignalId((prev) => (prev === id ? null : id));
  };

  const handleCallFromModal = () => {
    startCall({
      id: selectedLead.id,
      name: selectedLead.name,
      company: selectedLead.company,
      phone: selectedLead.phone,
    });
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-forest-dark/60 backdrop-blur-sm p-4 sm:p-6 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl border border-ivory-border max-w-3xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Top Bar */}
        <div className="px-6 py-4 bg-ivory-subtle border-b border-ivory-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-charcoal-muted">
              Lead Intelligence File
            </span>
            <Badge variant="sage" size="sm">
              {selectedLead.status}
            </Badge>
          </div>

          <div className="flex items-center gap-2">
            {/* Previous Lead */}
            <button
              type="button"
              onClick={prevLead}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-ivory-border bg-white text-xs font-semibold text-charcoal hover:bg-ivory hover:text-forest transition-colors shadow-sm"
              title="Previous Lead"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>Prev</span>
            </button>

            {/* Next Lead */}
            <button
              type="button"
              onClick={nextLead}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-ivory-border bg-white text-xs font-semibold text-charcoal hover:bg-ivory hover:text-forest transition-colors shadow-sm"
              title="Next Lead"
            >
              <span>Next</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>

            {/* Close Button */}
            <button
              type="button"
              onClick={closeLeadModal}
              className="p-1.5 rounded-lg text-charcoal-muted hover:text-charcoal hover:bg-ivory-dark transition-colors ml-2"
              title="Close Modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Header Profile Section */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-ivory-border">
            <div className="flex items-center gap-4">
              <img
                src={selectedLead.avatar}
                alt={selectedLead.name}
                className="w-16 h-16 rounded-2xl object-cover border-2 border-sage-light shadow-sm"
              />
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-2xl font-bold text-charcoal tracking-tight">
                    {selectedLead.name}
                  </h2>
                  <Badge variant={selectedLead.priority === 'Urgent' ? 'urgent' : 'gold'} size="sm">
                    {selectedLead.priority}
                  </Badge>
                </div>
                <p className="text-sm font-semibold text-charcoal-muted flex items-center gap-1.5 mt-0.5">
                  <Building className="w-3.5 h-3.5 text-sage" />
                  {selectedLead.title} • {selectedLead.company}
                </p>
                <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-charcoal-muted">
                  <span className="flex items-center gap-1 font-mono text-sage-text font-medium">
                    <Phone className="w-3 h-3 text-sage" />
                    {selectedLead.phone}
                  </span>
                  <span className="flex items-center gap-1">
                    <Mail className="w-3 h-3 text-sage" />
                    {selectedLead.email}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-sage" />
                    {selectedLead.location}
                  </span>
                </div>
              </div>
            </div>

            {/* Prominent Call Button */}
            <button
              type="button"
              onClick={handleCallFromModal}
              className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-sage hover:bg-sage-hover text-white font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 active:scale-95 group"
            >
              <Phone className="w-4 h-4 fill-white group-hover:animate-bounce" />
              <span>Call Lead Now</span>
            </button>
          </div>

          {/* Scores & Deal Metrics Card */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-ivory-subtle border border-ivory-border flex flex-col justify-between">
              <ScoreMeter score={selectedLead.icpScore} label="Ideal Customer Profile (ICP)" />
              <span className="text-[11px] text-charcoal-muted mt-2">
                Evaluated against enterprise telephony benchmarks
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-ivory-subtle border border-ivory-border flex flex-col justify-between">
              <ScoreMeter score={selectedLead.intentScore} label="Buying Intent Score" type="intent" />
              <span className="text-[11px] text-charcoal-muted mt-2">
                High frequency pricing and doc downloads
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-ivory-subtle border border-ivory-border flex flex-col justify-between">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-charcoal-muted">Potential Contract Value</span>
                <span className="p-1 rounded-md bg-gold-light text-gold-text">
                  <DollarSign className="w-3.5 h-3.5" />
                </span>
              </div>
              <div className="my-1">
                <span className="text-2xl font-extrabold text-charcoal font-sans">
                  {formatCurrency(selectedLead.potentialValue)}
                </span>
                <span className="text-xs text-charcoal-muted ml-1">ARR</span>
              </div>
              <span className="text-[11px] text-charcoal-muted">
                {selectedLead.companySize} • {selectedLead.annualRevenue}
              </span>
            </div>
          </div>

          {/* Interests & Solution Focus */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-charcoal-muted mb-2">
              Solution Focus & Tags
            </h4>
            <div className="flex flex-wrap gap-2">
              {selectedLead.interests.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 rounded-xl text-xs font-semibold bg-white border border-sage-border/80 text-sage-text shadow-2xs"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          {/* Buying Signals (Expandable / Collapsible) */}
          <div className="rounded-2xl border border-ivory-border bg-white p-4 shadow-2xs">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-600" />
                <h4 className="text-sm font-bold text-charcoal">
                  High-Velocity Buying Signals ({selectedLead.buyingSignals.length})
                </h4>
              </div>
              <span className="text-xs text-charcoal-muted italic">Click to expand details</span>
            </div>

            <div className="space-y-2">
              {selectedLead.buyingSignals.map((signal) => {
                const isExpanded = expandedSignalId === signal.id;
                return (
                  <div
                    key={signal.id}
                    className="border border-ivory-border rounded-xl p-3 bg-ivory-subtle/50 hover:bg-ivory transition-colors cursor-pointer"
                    onClick={() => toggleSignal(signal.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <Badge
                          variant={signal.strength === 'Critical' ? 'urgent' : 'sage'}
                          size="sm"
                        >
                          {signal.strength}
                        </Badge>
                        <span className="text-xs font-bold text-charcoal">{signal.title}</span>
                      </div>
                      <div className="flex items-center gap-2 text-charcoal-muted">
                        <span className="text-[11px]">{signal.timestamp}</span>
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="mt-2.5 pt-2.5 border-t border-ivory-border text-xs text-charcoal-muted leading-relaxed">
                        <p>{signal.description}</p>
                        <div className="mt-2 text-[11px] font-semibold text-sage flex items-center gap-1">
                          <Sparkles className="w-3 h-3" />
                          Category: {signal.category}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recommended Next Actions */}
          <div className="rounded-2xl border border-gold-border/60 bg-gold-light/40 p-4">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-gold-text" />
              <h4 className="text-sm font-bold text-charcoal">AvaniBot Recommended Next Actions</h4>
            </div>

            <div className="space-y-2.5">
              {selectedLead.recommendedActions.map((rec) => (
                <div
                  key={rec.id}
                  className="bg-white rounded-xl p-3 border border-gold-border/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs"
                >
                  <div>
                    <p className="text-xs font-bold text-charcoal">{rec.action}</p>
                    <p className="text-[11px] text-charcoal-muted mt-0.5">{rec.rationale}</p>
                  </div>
                  <button
                    type="button"
                    onClick={handleCallFromModal}
                    className="px-3 py-1.5 rounded-lg bg-forest hover:bg-forest-hover text-white text-xs font-bold transition-colors flex items-center gap-1.5 shrink-0"
                  >
                    <span>{rec.ctaText}</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Contact History Timeline */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-charcoal-muted mb-3 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-sage" />
              Recent Contact History
            </h4>

            <div className="space-y-3 relative before:absolute before:inset-0 before:left-3 before:w-0.5 before:bg-ivory-border">
              {selectedLead.contactHistory.map((touch) => (
                <div key={touch.id} className="relative flex items-start gap-3 pl-1">
                  <div className="w-5 h-5 rounded-full bg-sage-light border border-sage-border flex items-center justify-center shrink-0 z-10 text-[10px] text-sage font-bold">
                    ✓
                  </div>
                  <div className="bg-ivory-subtle border border-ivory-border rounded-xl p-3 text-xs w-full">
                    <div className="flex items-center justify-between text-charcoal-muted mb-1">
                      <span className="font-bold text-charcoal flex items-center gap-1">
                        {touch.type} {touch.duration && `(${touch.duration})`}
                      </span>
                      <span className="text-[11px]">{touch.date}</span>
                    </div>
                    <p className="text-charcoal-muted leading-relaxed">{touch.summary}</p>
                    {touch.outcome && (
                      <div className="mt-1.5 text-[11px] font-semibold text-emerald-700 flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" />
                        Outcome: {touch.outcome}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-ivory-subtle border-t border-ivory-border flex items-center justify-between">
          <p className="text-xs text-charcoal-muted">
            ID: <span className="font-mono font-medium">{selectedLead.id}</span> • Next Action:{' '}
            <span className="font-semibold text-charcoal">{selectedLead.nextActionDeadline}</span>
          </p>
          <button
            type="button"
            onClick={closeLeadModal}
            className="px-4 py-2 rounded-xl bg-white border border-ivory-border text-xs font-bold text-charcoal hover:bg-ivory-dark transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
