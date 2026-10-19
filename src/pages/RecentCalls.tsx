import React, { useState } from 'react';
import {
  History,
  PhoneOutgoing,
  PhoneIncoming,
  PhoneMissed,
  Clock,
  Play,
  Pause,
  ExternalLink,
  Sparkles,
  FileText,
  CheckCircle2,
  Phone,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useCalling } from '../context/CallingContext';
import { Badge } from '../components/common/Badge';

export const RecentCalls: React.FC = () => {
  const { callRecords, openLeadModal } = useApp();
  const { startCall } = useCalling();
  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);

  const formatDuration = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins}m ${secs.toString().padStart(2, '0')}s`;
  };

  const togglePlayAudio = (id: string) => {
    setPlayingAudioId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-charcoal tracking-tight">Recent Calls</h1>
            <Badge variant="sage" size="sm">
              {callRecords.length} Indexed Logs
            </Badge>
          </div>
          <p className="text-sm text-charcoal-muted mt-1">
            Complete call recordings, AI sentiment analysis, and post-call dispositions.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="px-3 py-1.5 rounded-xl bg-white border border-ivory-border font-semibold text-charcoal">
            All calls encrypted & archived (AES-256)
          </span>
        </div>
      </div>

      {/* Call History List */}
      <div className="bg-white rounded-3xl border border-ivory-border shadow-soft divide-y divide-ivory-border overflow-hidden">
        {callRecords.map((call) => {
          const isPlaying = playingAudioId === call.id;

          const getOutcomeVariant = (outcome: string) => {
            if (outcome.includes('Qualified') || outcome.includes('Closed-Won')) return 'success';
            if (outcome.includes('Follow-up')) return 'sage';
            if (outcome.includes('Voicemail')) return 'gold';
            return 'gray';
          };

          const getSentimentVariant = (sentiment: string) => {
            if (sentiment === 'Positive') return 'success';
            if (sentiment === 'Neutral') return 'blue';
            return 'gold';
          };

          return (
            <div key={call.id} className="p-6 hover:bg-ivory/50 transition-colors">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                {/* Caller details */}
                <div className="flex items-start gap-4">
                  <div
                    className={`p-3 rounded-2xl ${
                      call.direction === 'outbound'
                        ? 'bg-sage-light text-sage-text border border-sage-border'
                        : 'bg-blue-50 text-blue-700 border border-blue-200'
                    }`}
                  >
                    {call.direction === 'outbound' ? (
                      <PhoneOutgoing className="w-5 h-5" />
                    ) : (
                      <PhoneIncoming className="w-5 h-5" />
                    )}
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className="text-base font-bold text-charcoal cursor-pointer hover:text-sage transition-colors"
                        onClick={() => call.leadId && openLeadModal(call.leadId)}
                      >
                        {call.leadName}
                      </span>
                      <Badge variant={getOutcomeVariant(call.outcome)} size="sm">
                        {call.outcome}
                      </Badge>
                      <Badge variant={getSentimentVariant(call.sentiment)} size="sm">
                        <Sparkles className="w-3 h-3" />
                        {call.sentiment} Sentiment
                      </Badge>
                    </div>

                    <p className="text-xs text-charcoal-muted mt-1">
                      {call.company} • Phone:{' '}
                      <span className="font-mono text-sage-text font-semibold">{call.phone}</span>
                    </p>

                    <div className="flex items-center gap-4 text-xs text-charcoal-muted mt-2">
                      <span className="flex items-center gap-1 font-mono">
                        <Clock className="w-3.5 h-3.5 text-sage" />
                        {call.timestamp}
                      </span>
                      <span className="flex items-center gap-1 font-mono">
                        Duration: {formatDuration(call.duration)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3 self-end lg:self-center">
                  {call.hasRecording && (
                    <button
                      type="button"
                      onClick={() => togglePlayAudio(call.id)}
                      className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                        isPlaying
                          ? 'bg-forest text-white'
                          : 'bg-ivory-subtle hover:bg-ivory text-charcoal border border-ivory-border'
                      }`}
                    >
                      {isPlaying ? (
                        <>
                          <Pause className="w-3.5 h-3.5 fill-current" />
                          <span>Pause Recording</span>
                        </>
                      ) : (
                        <>
                          <Play className="w-3.5 h-3.5 fill-current" />
                          <span>Play Audio</span>
                        </>
                      )}
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() =>
                      startCall({
                        id: call.leadId || call.id,
                        name: call.leadName,
                        company: call.company,
                        phone: call.phone,
                      })
                    }
                    className="px-3 py-2 rounded-xl bg-sage hover:bg-sage-hover text-white text-xs font-bold shadow-sm transition-all flex items-center gap-1.5 active:scale-95"
                  >
                    <Phone className="w-3.5 h-3.5 fill-white" />
                    <span>Redial</span>
                  </button>

                  {call.leadId && (
                    <button
                      type="button"
                      onClick={() => openLeadModal(call.leadId)}
                      className="p-2 rounded-xl bg-white border border-ivory-border text-charcoal-muted hover:text-charcoal hover:bg-ivory"
                      title="Inspect Lead File"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Transcript & Summary */}
              {call.transcriptSnippet && (
                <div className="mt-4 pt-4 border-t border-ivory-border/70 text-xs">
                  <div className="p-3.5 rounded-2xl bg-ivory-subtle border border-ivory-border">
                    <div className="flex items-center gap-1.5 font-bold text-charcoal text-[11px] uppercase tracking-wider mb-1">
                      <FileText className="w-3.5 h-3.5 text-sage" />
                      <span>AI Call Transcript & Synthesis</span>
                    </div>
                    <p className="text-charcoal-muted leading-relaxed italic">
                      "{call.transcriptSnippet}"
                    </p>
                    <div className="mt-2 text-[11px] text-charcoal font-semibold">
                      Notes: <span className="text-charcoal-muted font-normal">{call.notes}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
