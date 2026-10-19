import React, { useRef, useEffect } from 'react';
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
  Bot,
  User,
  ArrowRightLeft,
  AlertCircle,
  XCircle,
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
    callMode,
    providerInfo,
    callSid,
    callNotes,
    callDisposition,
    audioLevels,
    liveTranscript,
    endCall,
    toggleMute,
    toggleSpeaker,
    toggleKeypad,
    setCallNotes,
    setCallDisposition,
    saveAndDismissCall,
  } = useCalling();

  const transcriptEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (transcriptEndRef.current) {
      transcriptEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [liveTranscript]);

  if (!isCallActive || !activeLead) return null;

  const formatDuration = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const isRinging = callStatus === 'ringing';
  const isConnected = callStatus === 'connected';
  const isEnded = callStatus === 'ended' || callStatus === 'failed' || callStatus === 'no-answer';

  const isLiveKit = Boolean(callSid?.startsWith('LK_'));
  const isTwilioPstn = Boolean(callSid?.startsWith('CA'));
  const isSimulated = !isLiveKit && !isTwilioPstn;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-forest-dark/75 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-forest text-ivory rounded-3xl border border-forest-border w-full max-w-xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
        {/* Top Header */}
        <div className="bg-forest-surface px-6 py-3.5 border-b border-forest-border flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className={`w-3 h-3 rounded-full ${
                isConnected
                  ? 'bg-emerald-400 animate-pulse'
                  : isEnded
                  ? 'bg-rose-400'
                  : 'bg-amber-400 animate-ping'
              }`}
            />
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-300 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              {callMode === 'voice-ai' ? (
                <span className="flex items-center gap-1 text-gold-light">
                  <Sparkles className="w-3.5 h-3.5 text-gold" />
                  AvaniBot AI Voice Agent
                </span>
              ) : (
                'On-Ground.ai Secure Voice Line'
              )}
            </span>
          </div>

          <div
            className={`text-[11px] px-2.5 py-0.5 rounded-full font-mono font-bold border flex items-center gap-1.5 ${
              isLiveKit
                ? 'bg-emerald-950/70 text-emerald-300 border-emerald-500/50'
                : isTwilioPstn
                ? 'bg-blue-950/70 text-blue-300 border-blue-500/50'
                : 'bg-amber-950/60 text-amber-300 border-amber-600/50'
            }`}
          >
            {isLiveKit ? (
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                WEBRTC LIVEKIT
              </span>
            ) : isTwilioPstn ? (
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-ping" />
                REAL PSTN
              </span>
            ) : (
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                SIMULATION
              </span>
            )}
            <span className="opacity-60">•</span>
            <span>{callSid ? `SID: ${callSid.slice(0, 11)}...` : 'Active'}</span>
          </div>
        </div>

        {/* Lead Identity & Status Banner */}
        <div className="px-6 pt-5 pb-3 text-center border-b border-forest-border/40">
          <div className="inline-block p-1 rounded-full bg-forest-surface border border-forest-border/60 mb-2 shadow-md">
            <div className="w-14 h-14 rounded-full bg-sage flex items-center justify-center text-white font-bold text-lg shadow-inner">
              {activeLead.name
                .split(' ')
                .map((n) => n[0])
                .join('')}
            </div>
          </div>

          <h3 className="text-xl font-bold text-white tracking-tight">{activeLead.name}</h3>
          <p className="text-xs text-charcoal-muted font-medium">{activeLead.company}</p>
          <p className="text-xs font-mono text-emerald-300/90 mt-0.5">{activeLead.phone}</p>

          {/* Status Badges */}
          <div className="mt-3 flex items-center justify-center gap-2">
            {callStatus === 'initiating' && (
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-950/60 text-blue-200 border border-blue-700/50 flex items-center gap-1.5 animate-pulse">
                Initiating voice line...
              </span>
            )}
            {callStatus === 'dialing' && (
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-900/40 text-amber-300 border border-amber-700/50 flex items-center gap-1.5 animate-pulse">
                Dialing carrier gateway...
              </span>
            )}
            {isRinging && (
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-950/70 text-emerald-200 border border-emerald-600/50 flex items-center gap-1.5 animate-pulse">
                <Clock className="w-3.5 h-3.5" />
                {isLiveKit
                  ? 'Connecting WebRTC Audio Room...'
                  : isTwilioPstn
                  ? 'Ringing Customer Handset (Carrier PSTN)...'
                  : 'Simulating Ringback Tone...'}
              </span>
            )}
            {isConnected && (
              <div className="flex items-center gap-2">
                {isLiveKit ? (
                  <span className="px-3.5 py-1 rounded-full text-xs font-bold bg-emerald-950 text-emerald-300 border border-emerald-500/50 flex items-center gap-2 shadow-sm">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    LIVEKIT WEBRTC CONNECTED
                  </span>
                ) : isTwilioPstn ? (
                  <span className="px-3.5 py-1 rounded-full text-xs font-bold bg-blue-950 text-blue-300 border border-blue-500/40 flex items-center gap-2 shadow-sm">
                    <span className="w-2 h-2 rounded-full bg-blue-400 animate-ping" />
                    REAL PSTN CONNECTED
                  </span>
                ) : (
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-950/80 text-amber-300 border border-amber-600/60 flex items-center gap-1.5 shadow-sm">
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                    SIMULATION (Audio Synthesizer)
                  </span>
                )}
                <span className="font-mono text-xs font-semibold text-white px-2.5 py-0.5 bg-forest-surface rounded-md border border-forest-border">
                  {formatDuration(callDuration)}
                </span>
              </div>
            )}
            {callStatus === 'ended' && (
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-rose-950 text-rose-300 border border-rose-700 flex items-center gap-1.5">
                <PhoneOff className="w-3.5 h-3.5" />
                {isLiveKit ? 'WebRTC Call Ended' : isTwilioPstn ? 'PSTN Call Ended' : 'Simulation Finished'} ({formatDuration(callDuration)})
              </span>
            )}
            {callStatus === 'no-answer' && (
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-950 text-amber-300 border border-amber-700 flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5" />
                No Answer / Customer Busy
              </span>
            )}
            {callStatus === 'failed' && (
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-rose-950 text-rose-300 border border-rose-700 flex items-center gap-1.5">
                <XCircle className="w-3.5 h-3.5" />
                Call Failed
              </span>
            )}
          </div>

          {/* Telephony line indicator */}
          <p className="text-[11px] text-gray-400 mt-2 flex items-center justify-center gap-1">
            <Sparkles className="w-3 h-3 text-gold" />
            <span className={isSimulated ? 'text-amber-300/80 font-medium' : 'text-emerald-300/90 font-medium'}>
              {providerInfo}
            </span>
          </p>
        </div>

        {/* Live Audio Waveform Visualizer */}
        <div className="px-6 py-2 bg-forest-dark/40">
          <AudioWaveform levels={audioLevels} isActive={isConnected || isRinging} />
        </div>

        {/* Live Multi-turn Dialogue Transcript Box */}
        {(callMode === 'voice-ai' || liveTranscript.length > 0) && (
          <div className="px-6 py-3 flex-1 overflow-y-auto max-h-52 bg-forest-dark/70 border-t border-b border-forest-border/50 space-y-2.5">
            <div className="flex items-center justify-between text-[11px] text-gray-400 font-semibold uppercase tracking-wider pb-1 border-b border-forest-border/30">
              <span className="flex items-center gap-1 text-gold-light">
                <Bot className="w-3.5 h-3.5 text-gold" />
                Live AI Speech Transcript
              </span>
              <span className="text-[10px] text-emerald-400">
                {liveTranscript.length} turn{liveTranscript.length !== 1 ? 's' : ''}
              </span>
            </div>

            {liveTranscript.length === 0 ? (
              <div className="py-6 text-center text-xs text-gray-400 flex flex-col items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-forest-surface border border-forest-border flex items-center justify-center text-gold animate-pulse">
                  <Sparkles className="w-4 h-4" />
                </div>
                {isConnected ? (
                  <p>AvaniBot is speaking the initial greeting to customer...</p>
                ) : (
                  <p>Awaiting customer answer to begin real-time voice synthesis...</p>
                )}
              </div>
            ) : (
              liveTranscript.map((turn, idx) => (
                <div
                  key={idx}
                  className={`flex flex-col text-xs rounded-xl p-2.5 ${
                    turn.role === 'assistant'
                      ? 'bg-forest-surface/90 border border-emerald-500/30 text-emerald-100 ml-4'
                      : turn.role === 'user'
                      ? 'bg-charcoal/70 border border-ivory-border/30 text-white mr-4'
                      : 'bg-amber-950/70 border border-amber-600/40 text-amber-200 text-center font-medium'
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px] text-gray-400 mb-1">
                    <span className="font-bold flex items-center gap-1">
                      {turn.role === 'assistant' && (
                        <>
                          <Bot className="w-3 h-3 text-gold" />
                          <span className="text-gold-light">AvaniBot (AI Voice)</span>
                        </>
                      )}
                      {turn.role === 'user' && (
                        <>
                          <User className="w-3 h-3 text-emerald-400" />
                          <span className="text-emerald-300">Customer ({activeLead.name})</span>
                        </>
                      )}
                      {turn.role === 'system' && (
                        <span className="flex items-center gap-1 text-amber-300 mx-auto">
                          <ArrowRightLeft className="w-3 h-3" />
                          System Telephony Event
                        </span>
                      )}
                    </span>
                    <span className="text-[9px] text-gray-500">{turn.timestamp}</span>
                  </div>
                  <p className="leading-relaxed">{turn.content}</p>
                </div>
              ))
            )}
            <div ref={transcriptEndRef} />
          </div>
        )}

        {/* Dialpad Flyout if Opened */}
        {isKeypadOpen && !isEnded && (
          <div className="px-6 py-2 animate-in fade-in zoom-in-95 duration-150">
            <Dialpad />
          </div>
        )}

        {/* Controls when call is running */}
        {!isEnded ? (
          <div className="px-6 py-4 flex items-center justify-center gap-4 border-t border-forest-border/60 bg-forest-surface/30">
            {/* Mute (Microphone Hardware Control) */}
            <button
              type="button"
              onClick={toggleMute}
              className={`flex flex-col items-center gap-1 p-3 rounded-2xl border transition-all ${
                isMuted
                  ? 'bg-rose-950/70 border-rose-500/80 text-rose-200 shadow-inner'
                  : 'bg-forest-surface hover:bg-forest-hover border-forest-border text-ivory'
              }`}
              title={isMuted ? 'Unmute microphone' : 'Mute microphone'}
            >
              {isMuted ? <MicOff className="w-5 h-5 text-rose-300" /> : <Mic className="w-5 h-5" />}
              <span className="text-[10px] font-semibold">{isMuted ? 'Unmute' : 'Mute'}</span>
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

            {/* Speaker (Call Audio Output Control) */}
            <button
              type="button"
              onClick={toggleSpeaker}
              className={`flex flex-col items-center gap-1 p-3 rounded-2xl border transition-all ${
                !isSpeakerOn
                  ? 'bg-amber-950/60 border-amber-600/70 text-amber-200 shadow-inner'
                  : 'bg-forest-surface hover:bg-forest-hover border-forest-border text-ivory'
              }`}
              title={isSpeakerOn ? 'Turn off call audio output' : 'Turn on call audio output'}
            >
              {isSpeakerOn ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5 text-amber-300" />}
              <span className="text-[10px] font-semibold">{isSpeakerOn ? 'Speaker On' : 'Speaker Off'}</span>
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
          <div className="px-6 py-4 bg-forest-surface border-t border-forest-border space-y-3.5 overflow-y-auto">
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
                <option value="AI Voice Call Completed">AI Voice Call Completed</option>
                <option value="Connected & Qualified">Connected & Qualified (High Intent)</option>
                <option value="Transferred to Agent">Transferred to Agent (Human Specialist)</option>
                <option value="Follow-up Scheduled">Follow-up Scheduled</option>
                <option value="Voicemail">Left Voicemail</option>
                <option value="Gatekeeper">Gatekeeper Reached</option>
                <option value="Opted Out">Opted Out / DNC Requested</option>
                <option value="No Answer">No Answer / Busy</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-emerald-300 mb-1 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5" />
                Call Notes & Summary
              </label>
              <textarea
                value={callNotes}
                onChange={(e) => setCallNotes(e.target.value)}
                placeholder="Key takeaways, customer questions, pricing discussed, next action items..."
                rows={2}
                className="w-full bg-forest-dark border border-forest-border text-ivory placeholder-gray-400 rounded-xl p-2.5 text-xs focus:outline-none focus:border-emerald-500"
              />
            </div>

            <button
              type="button"
              onClick={saveAndDismissCall}
              className="w-full py-2.5 rounded-xl bg-sage hover:bg-sage-hover text-white font-bold text-xs sm:text-sm transition-all shadow-md flex items-center justify-center gap-2 active:scale-98"
            >
              <CheckCircle2 className="w-4 h-4" />
              Save Record & Log to Recent Calls
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
