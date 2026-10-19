import React from 'react';
import {
  PhoneOff,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Grid,
  CheckCircle2,
  Clock,
  Sparkles,
  ShieldCheck,
  FileText,
} from 'lucide-react';
import { useCalling } from '../../context/CallingContext';
import { AudioWaveform } from './AudioWaveform';
import { Dialpad } from './Dialpad';

export const ActiveCallConsole: React.FC = () => {
  const {
    isCallActive,
    callStatus,
    activeLead,
    callDuration,
    isMuted,
    isSpeakerOn,
    isKeypadOpen,
    providerInfo,
    callSid,
    callNotes,
    callDisposition,
    audioLevels,
    endCall,
    toggleMute,
    toggleSpeaker,
    toggleKeypad,
    setCallNotes,
    setCallDisposition,
    saveAndDismissCall,
  } = useCalling();

  if (!isCallActive || !activeLead) return null;

  const formatDuration = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const isRinging = callStatus === 'ringing';
  const isConnected = callStatus === 'connected';
  const isEnded = callStatus === 'ended';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-forest-dark/70 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-forest text-ivory rounded-3xl border border-forest-border w-full max-w-xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
        {/* Top Header */}
        <div className="bg-forest-surface px-6 py-4 border-b border-forest-border flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-300 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              On-Ground.ai Secure Voice Line
            </span>
          </div>

          <div className="text-xs px-2.5 py-1 rounded-full bg-forest-dark/80 text-gold-light border border-forest-border">
            {callSid ? `SID: ${callSid.slice(0, 14)}...` : 'Telephony Active'}
          </div>
        </div>

        {/* Lead Identity & Status Banner */}
        <div className="px-6 pt-6 pb-4 text-center">
          <div className="inline-block p-1 rounded-full bg-forest-surface border border-forest-border/60 mb-3 shadow-md">
            <div className="w-16 h-16 rounded-full bg-sage flex items-center justify-center text-white font-bold text-xl shadow-inner">
              {activeLead.name
                .split(' ')
                .map((n) => n[0])
                .join('')}
            </div>
          </div>

          <h3 className="text-xl font-bold text-white tracking-tight">{activeLead.name}</h3>
          <p className="text-sm text-charcoal-muted font-medium">{activeLead.company}</p>
          <p className="text-xs font-mono text-emerald-300/90 mt-1">{activeLead.phone}</p>

          {/* Status Badge */}
          <div className="mt-4 flex items-center justify-center gap-2">
            {callStatus === 'dialing' && (
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-900/40 text-amber-300 border border-amber-700/50 flex items-center gap-1.5 animate-pulse">
                Dialing carrier gateway...
              </span>
            )}
            {isRinging && (
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-900/50 text-amber-200 border border-amber-600/50 flex items-center gap-1.5 animate-pulse">
                <Clock className="w-3.5 h-3.5" />
                Ringing Customer...
              </span>
            )}
            {isConnected && (
              <div className="flex items-center gap-2">
                <span className="px-3.5 py-1 rounded-full text-xs font-bold bg-emerald-950 text-emerald-300 border border-emerald-500/40 flex items-center gap-2 shadow-sm">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  Live Connected
                </span>
                <span className="font-mono text-sm font-semibold text-white px-2.5 py-0.5 bg-forest-surface rounded-md border border-forest-border">
                  {formatDuration(callDuration)}
                </span>
              </div>
            )}
            {isEnded && (
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-rose-950 text-rose-300 border border-rose-700 flex items-center gap-1.5">
                <PhoneOff className="w-3.5 h-3.5" />
                Call Finished ({formatDuration(callDuration)})
              </span>
            )}
          </div>

          {/* Provider details */}
          <p className="text-[11px] text-gray-400 mt-2 italic flex items-center justify-center gap-1">
            <Sparkles className="w-3 h-3 text-gold" />
            {providerInfo}
          </p>
        </div>

        {/* Live Audio Waveform Visualizer */}
        <div className="px-6 py-2">
          <AudioWaveform levels={audioLevels} isActive={isConnected || isRinging} />
        </div>

        {/* Dialpad Flyout if Opened */}
        {isKeypadOpen && !isEnded && (
          <div className="px-6 py-2 animate-in fade-in zoom-in-95 duration-150">
            <Dialpad />
          </div>
        )}

        {/* Controls when call is running */}
        {!isEnded ? (
          <div className="px-6 py-4 flex items-center justify-center gap-4 border-t border-forest-border/60 bg-forest-surface/30">
            {/* Mute */}
            <button
              type="button"
              onClick={toggleMute}
              className={`flex flex-col items-center gap-1 p-3 rounded-2xl border transition-all ${
                isMuted
                  ? 'bg-rose-900/60 border-rose-500 text-rose-200'
                  : 'bg-forest-surface hover:bg-forest-hover border-forest-border text-ivory'
              }`}
              title={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              <span className="text-[10px] font-semibold">{isMuted ? 'Muted' : 'Mute'}</span>
            </button>

            {/* Keypad */}
            <button
              type="button"
              onClick={toggleKeypad}
              className={`flex flex-col items-center gap-1 p-3 rounded-2xl border transition-all ${
                isKeypadOpen
                  ? 'bg-emerald-900/60 border-emerald-500 text-emerald-200'
                  : 'bg-forest-surface hover:bg-forest-hover border-forest-border text-ivory'
              }`}
              title="DTMF Keypad"
            >
              <Grid className="w-5 h-5" />
              <span className="text-[10px] font-semibold">Keypad</span>
            </button>

            {/* Speaker */}
            <button
              type="button"
              onClick={toggleSpeaker}
              className={`flex flex-col items-center gap-1 p-3 rounded-2xl border transition-all ${
                !isSpeakerOn
                  ? 'bg-rose-900/40 border-rose-700 text-rose-300'
                  : 'bg-forest-surface hover:bg-forest-hover border-forest-border text-ivory'
              }`}
              title="Speaker Toggle"
            >
              {isSpeakerOn ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
              <span className="text-[10px] font-semibold">{isSpeakerOn ? 'Speaker' : 'Muted'}</span>
            </button>

            {/* Hangup Button */}
            <button
              type="button"
              onClick={endCall}
              className="flex flex-col items-center gap-1 px-5 py-3 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-bold transition-all shadow-lg active:scale-95"
            >
              <PhoneOff className="w-5 h-5" />
              <span className="text-[10px] font-bold">End Call</span>
            </button>
          </div>
        ) : (
          /* Post-Call Wrap-up & Disposition */
          <div className="px-6 py-4 bg-forest-surface border-t border-forest-border space-y-4 overflow-y-auto">
            <div>
              <label className="block text-xs font-semibold text-emerald-300 mb-1 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Call Outcome / Disposition
              </label>
              <select
                value={callDisposition}
                onChange={(e) => setCallDisposition(e.target.value)}
                className="w-full bg-forest-dark border border-forest-border text-ivory rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-emerald-500 font-medium"
              >
                <option value="Connected & Qualified">Connected & Qualified (High Intent)</option>
                <option value="Follow-up Scheduled">Follow-up Scheduled</option>
                <option value="Voicemail">Left Voicemail</option>
                <option value="Gatekeeper">Gatekeeper Reached</option>
                <option value="Closed-Won">Closed-Won (Deal Committed)</option>
                <option value="No Answer">No Answer / Busy</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-emerald-300 mb-1 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5" />
                Call Notes & CRM Logging
              </label>
              <textarea
                value={callNotes}
                onChange={(e) => setCallNotes(e.target.value)}
                placeholder="Key takeaways, customer objections, next action items..."
                rows={3}
                className="w-full bg-forest-dark border border-forest-border text-ivory placeholder-gray-400 rounded-xl p-3 text-sm focus:outline-none focus:border-emerald-500"
              />
            </div>

            <button
              type="button"
              onClick={saveAndDismissCall}
              className="w-full py-3 rounded-xl bg-sage hover:bg-sage-hover text-white font-bold text-sm transition-all shadow-md flex items-center justify-center gap-2 active:scale-98"
            >
              <CheckCircle2 className="w-4 h-4" />
              Save Record & Update Lead Status
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
