import React, { useState } from 'react';
import {
  PhoneIncoming,
  PhoneMissed,
  Voicemail,
  Phone,
  Clock,
  DollarSign,
  Play,
  Pause,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useCalling } from '../context/CallingContext';
import { Badge } from '../components/common/Badge';

export const IncomingCalls: React.FC = () => {
  const { incomingCalls, resolveIncomingCall, openLeadModal } = useApp();
  const { startCall } = useCalling();
  const [playingVoicemailId, setPlayingVoicemailId] = useState<string | null>(null);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const handleCallback = (call: any) => {
    // Resolve callback state
    resolveIncomingCall(call.id);

    // Trigger full calling workflow
    startCall({
      id: call.leadId || `temp-${call.id}`,
      name: call.callerName,
      company: call.company,
      phone: call.phone,
    });
  };

  const toggleVoicemailAudio = (id: string) => {
    setPlayingVoicemailId((prev) => (prev === id ? null : id));
  };

  const pendingCalls = incomingCalls.filter((c) => c.status === 'pending');
  const resolvedCalls = incomingCalls.filter((c) => c.status === 'resolved');

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-charcoal tracking-tight">Incoming Calls</h1>
            <Badge variant="urgent" size="sm">
              {pendingCalls.length} Callbacks Required
            </Badge>
          </div>
          <p className="text-sm text-charcoal-muted mt-1">
            Inbound calls and voicemail recordings waiting for agent callback.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="px-3 py-1.5 rounded-xl bg-white border border-ivory-border font-semibold text-charcoal">
            Avg Callback Speed: <span className="font-bold text-emerald-700">6m 12s</span>
          </span>
        </div>
      </div>

      {/* Inbound Call Cards Stream */}
      <div className="space-y-4">
        {incomingCalls.map((item) => {
          const isResolved = item.status === 'resolved';
          const isPlaying = playingVoicemailId === item.id;

          return (
            <div
              key={item.id}
              className={`p-6 rounded-3xl border transition-all ${
                isResolved
                  ? 'bg-white/60 border-ivory-border opacity-70'
                  : 'bg-white border-ivory-border shadow-soft hover:shadow-card'
              }`}
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                {/* Caller Info */}
                <div className="flex items-start gap-4">
                  <div
                    className={`p-3 rounded-2xl ${
                      item.reason === 'Missed Call'
                        ? 'bg-rose-50 text-rose-600 border border-rose-200'
                        : 'bg-sage-light text-sage-text border border-sage-border'
                    }`}
                  >
                    {item.reason === 'Missed Call' ? (
                      <PhoneMissed className="w-6 h-6" />
                    ) : (
                      <Voicemail className="w-6 h-6" />
                    )}
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-base font-bold text-charcoal">{item.callerName}</h3>
                      <Badge
                        variant={item.priority === 'Urgent' ? 'urgent' : 'gold'}
                        size="sm"
                      >
                        {item.priority}
                      </Badge>
                      <Badge variant="sage" size="sm">
                        {item.reason}
                      </Badge>
                    </div>

                    <p className="text-xs text-charcoal-muted mt-1">
                      {item.company} • Phone:{' '}
                      <span className="font-mono font-bold text-sage-text">{item.phone}</span>
                    </p>

                    <div className="flex items-center gap-4 text-xs text-charcoal-muted mt-2">
                      <span className="flex items-center gap-1 font-mono">
                        <Clock className="w-3.5 h-3.5 text-sage" />
                        {item.timestamp}
                      </span>
                      <span className="flex items-center gap-1 font-semibold text-charcoal">
                        <DollarSign className="w-3.5 h-3.5 text-gold" />
                        Deal Value: {formatCurrency(item.potentialValue)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions & Callback Button */}
                <div className="flex items-center gap-3 self-end lg:self-center">
                  {item.leadId && (
                    <button
                      type="button"
                      onClick={() => openLeadModal(item.leadId!)}
                      className="px-3 py-2 rounded-xl bg-ivory-subtle border border-ivory-border text-xs font-semibold text-charcoal hover:bg-ivory transition-colors flex items-center gap-1.5"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>View Lead</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => handleCallback(item)}
                    className="px-4 py-2.5 rounded-xl bg-sage hover:bg-sage-hover text-white text-xs font-bold transition-all shadow-md flex items-center gap-2 active:scale-95"
                  >
                    <Phone className="w-4 h-4 fill-white" />
                    <span>Callback Now</span>
                  </button>
                </div>
              </div>

              {/* Voicemail Audio Player & Transcript Preview */}
              {item.voicemailTranscript && (
                <div className="mt-4 pt-4 border-t border-ivory-border/70 bg-ivory-subtle/50 rounded-2xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2 text-xs font-bold text-charcoal">
                      <Voicemail className="w-4 h-4 text-sage" />
                      <span>AI Transcribed Voicemail ({item.voicemailDuration})</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => toggleVoicemailAudio(item.id)}
                      className="flex items-center gap-1.5 text-xs font-bold text-sage hover:text-sage-hover"
                    >
                      {isPlaying ? (
                        <>
                          <Pause className="w-3.5 h-3.5 fill-current" />
                          <span>Pause Audio</span>
                        </>
                      ) : (
                        <>
                          <Play className="w-3.5 h-3.5 fill-current" />
                          <span>Play Audio Recording</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Simulated Audio Bar while playing */}
                  {isPlaying && (
                    <div className="my-2 p-2 bg-forest-surface rounded-xl flex items-center gap-2 animate-in fade-in">
                      <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                      <span className="text-[11px] text-emerald-200 font-mono">
                        Playing voicemail stream (0:14 / {item.voicemailDuration})
                      </span>
                    </div>
                  )}

                  <p className="text-xs text-charcoal-muted leading-relaxed italic bg-white p-3 rounded-xl border border-ivory-border">
                    {item.voicemailTranscript}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
