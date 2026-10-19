import React, { useState } from 'react';
import {
  PhoneIncoming,
  PhoneMissed,
  Voicemail,
  Phone,
  Play,
  Pause,
  CheckCircle2,
  Clock,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useCalling } from '../context/CallingContext';

export const IncomingCalls: React.FC = () => {
  const { incomingCalls, resolveIncomingCall, openLeadModal } = useApp();
  const { startCall } = useCalling();
  const [playingVoicemailId, setPlayingVoicemailId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'resolved'>('all');

  const handleCallback = (call: any) => {
    resolveIncomingCall(call.id);
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
  const filteredCalls = incomingCalls.filter((c) => {
    if (statusFilter === 'pending') return c.status === 'pending';
    if (statusFilter === 'resolved') return c.status === 'resolved';
    return true;
  });

  return (
    <div className="space-y-4 pb-20 animate-in fade-in duration-150">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-charcoal tracking-tight">Incoming</h1>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900">
              {pendingCalls.length} Callbacks Required
            </span>
          </div>
          <p className="text-xs text-stone-500 mt-0.5">
            Missed inbound calls and voicemails waiting for agent callback.
          </p>
        </div>

        <div className="flex items-center gap-1.5 bg-white p-1 rounded-xl border border-stone-200 text-xs shadow-2xs self-start sm:self-auto">
          {(['all', 'pending', 'resolved'] as const).map((filter) => (
            <button
              key={filter}
              type="button"
              onClick={() => setStatusFilter(filter)}
              className={`px-3 py-1 rounded-lg font-semibold transition-colors capitalize ${
                statusFilter === filter
                  ? 'bg-stone-900 text-white shadow-2xs'
                  : 'text-stone-600 hover:bg-stone-50'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* 2. Clean List */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-xs divide-y divide-stone-100 overflow-hidden text-xs">
        {filteredCalls.map((call) => {
          const isPending = call.status === 'pending';

          return (
            <div
              key={call.id}
              className="p-3.5 sm:p-4 hover:bg-stone-50/60 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="flex items-start gap-3 min-w-0">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                    isPending ? 'bg-red-100 text-red-600' : 'bg-emerald-100 text-emerald-700'
                  }`}
                >
                  {call.reason === 'Voicemail Left' ? (
                    <Voicemail className="w-4 h-4" />
                  ) : (
                    <PhoneMissed className="w-4 h-4" />
                  )}
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span
                      onClick={() => call.leadId && openLeadModal(call.leadId)}
                      className="font-bold text-charcoal hover:text-emerald-700 cursor-pointer"
                    >
                      {call.callerName}
                    </span>
                    <span className="text-[10px] text-stone-400 font-mono">
                      {call.phone} · {call.timestamp}
                    </span>
                    <span
                      className={`text-[9px] font-bold px-1.5 py-0.2 rounded-full ${
                        isPending ? 'bg-amber-100 text-amber-900' : 'bg-stone-100 text-stone-600'
                      }`}
                    >
                      {call.reason}
                    </span>
                  </div>

                  <p className="text-[11px] text-stone-500 mt-0.5">
                    {call.company} · Potential Value: <strong className="text-charcoal">₹{call.potentialValue.toLocaleString()}</strong>
                  </p>

                  {/* Voicemail Snippet */}
                  {call.voicemailTranscript && (
                    <div className="mt-1.5 p-2 rounded-lg bg-stone-50 border border-stone-200 text-[11px] text-stone-600 flex items-center justify-between gap-2 max-w-xl">
                      <p className="truncate italic">"{call.voicemailTranscript}"</p>
                      <button
                        type="button"
                        onClick={() => toggleVoicemailAudio(call.id)}
                        className="text-stone-500 hover:text-emerald-700 shrink-0 font-bold flex items-center gap-1 text-[10px]"
                      >
                        {playingVoicemailId === call.id ? (
                          <>
                            <Pause className="w-3 h-3" />
                            <span>Stop</span>
                          </>
                        ) : (
                          <>
                            <Play className="w-3 h-3" />
                            <span>Play ({call.voicemailDuration || '0:30'})</span>
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Action */}
              <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                {isPending ? (
                  <button
                    type="button"
                    onClick={() => handleCallback(call)}
                    className="px-3.5 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-2xs transition-all flex items-center gap-1.5 active:scale-95"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Call Back</span>
                  </button>
                ) : (
                  <span className="text-[11px] text-stone-400 flex items-center gap-1 font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Resolved</span>
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
