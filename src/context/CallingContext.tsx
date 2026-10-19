import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { soundSynthesizer } from '../services/soundSynthesizer';
import {
  initiateCallApi,
  initiateAiVoiceCallApi,
  logCallRecordApi,
  fetchLiveCallStatusApi,
  fetchLiveKitTokenApi,
  sendDtmfApi,
} from '../services/callApi';
import { voiceAiEngine } from '../services/voiceAiEngine';
import { livekitClientService } from '../services/livekitClient';

export interface ActiveLeadCallInfo {
  id: string;
  name: string;
  company: string;
  phone: string;
}

export interface TranscriptTurn {
  role: 'assistant' | 'user' | 'system';
  content: string;
  timestamp: string;
}

export type CallStatus =
  | 'idle'
  | 'initiating'
  | 'dialing'
  | 'ringing'
  | 'connected'
  | 'ended'
  | 'failed'
  | 'no-answer';

interface CallingContextType {
  isCallActive: boolean;
  callStatus: CallStatus;
  activeLead: ActiveLeadCallInfo | null;
  callDuration: number;
  isMuted: boolean;
  isSpeakerOn: boolean;
  isKeypadOpen: boolean;
  dtmfDisplay: string;
  dtmfFeedback: string | null;
  callMode: 'human-agent' | 'voice-ai';
  providerInfo: string;
  callSid: string | null;
  callNotes: string;
  callDisposition: string;
  audioLevels: number[];
  liveTranscript: TranscriptTurn[];
  startCall: (lead: ActiveLeadCallInfo, mode?: 'human-agent' | 'voice-ai') => Promise<void>;
  endCall: () => void;
  toggleMute: () => void;
  toggleSpeaker: () => void;
  toggleKeypad: () => void;
  pressDtmf: (digit: string) => void;
  backspaceDtmf: () => void;
  clearDtmf: () => void;
  setCallNotes: (notes: string) => void;
  setCallDisposition: (disposition: string) => void;
  saveAndDismissCall: () => void;
}

const CallingContext = createContext<CallingContextType | undefined>(undefined);

export const CallingProvider: React.FC<{
  children: React.ReactNode;
  onCallCompleted?: (callRecord: any) => void;
}> = ({ children, onCallCompleted }) => {
  const [isCallActive, setIsCallActive] = useState<boolean>(false);
  const [callStatus, setCallStatus] = useState<CallStatus>('idle');
  const [activeLead, setActiveLead] = useState<ActiveLeadCallInfo | null>(null);
  const [callDuration, setCallDuration] = useState<number>(0);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState<boolean>(true);
  const [isKeypadOpen, setIsKeypadOpen] = useState<boolean>(false);
  const [dtmfDisplay, setDtmfDisplay] = useState<string>('');
  const [dtmfFeedback, setDtmfFeedback] = useState<string | null>(null);
  const [callMode, setCallMode] = useState<'human-agent' | 'voice-ai'>('human-agent');
  const [providerInfo, setProviderInfo] = useState<string>('Ready');
  const [callSid, setCallSid] = useState<string | null>(null);
  const [callNotes, setCallNotes] = useState<string>('');
  const [callDisposition, setCallDisposition] = useState<string>('Connected & Qualified');
  const [audioLevels, setAudioLevels] = useState<number[]>(new Array(16).fill(0.1));
  const [liveTranscript, setLiveTranscript] = useState<TranscriptTurn[]>([]);

  const timerRef = useRef<any>(null);
  const animFrameRef = useRef<any>(null);
  const pollTimerRef = useRef<any>(null);

  // Call timer interval
  useEffect(() => {
    if (callStatus === 'connected') {
      timerRef.current = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [callStatus]);

  // Audio waveform animation loop
  useEffect(() => {
    if (callStatus === 'connected' || callStatus === 'ringing') {
      const updateWaveform = () => {
        if (!isMuted) {
          setAudioLevels(soundSynthesizer.getAudioLevels());
        } else {
          setAudioLevels(new Array(16).fill(0.04));
        }
        animFrameRef.current = requestAnimationFrame(updateWaveform);
      };
      animFrameRef.current = requestAnimationFrame(updateWaveform);
    } else {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      setAudioLevels(new Array(16).fill(0.05));
    }
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [callStatus, isMuted]);

  // Poll live telephony status & live transcript from backend
  useEffect(() => {
    if (isCallActive && callSid) {
      pollTimerRef.current = setInterval(async () => {
        try {
          const res = await fetchLiveCallStatusApi(callSid);
          if (res && res.data) {
            const { status, duration, history, transferredToHuman, optedOut } = res.data;

            // Map provider status
            if (status === 'ringing') {
              setCallStatus('ringing');
            } else if (status === 'in-progress' || status === 'connected') {
              if (callStatus !== 'connected') {
                soundSynthesizer.stopRingback();
                soundSynthesizer.playConnectChime();
                setCallStatus('connected');
              }
            } else if (status === 'completed' || status === 'ended') {
              if (callStatus !== 'ended') {
                soundSynthesizer.stopRingback();
                soundSynthesizer.playDisconnectTone();
                setCallStatus('ended');
              }
            } else if (status === 'no-answer' || status === 'busy') {
              setCallStatus('no-answer');
              setCallDisposition('No Answer');
            } else if (status === 'failed') {
              setCallStatus('failed');
            }

            if (duration && duration > 0) {
              setCallDuration(duration);
            }

            if (history && history.length > 0) {
              setLiveTranscript(history);
            }

            if (transferredToHuman) {
              setProviderInfo('Call Transferred to Human Specialist (Alex Chen)');
              setCallDisposition('Transferred to Agent');
            }

            if (optedOut) {
              setProviderInfo('Customer Opted Out - Number Removed');
              setCallDisposition('Opted Out');
            }
          }
        } catch (e) {
          // ignore transient poll error
        }
      }, 1500);
    } else {
      if (pollTimerRef.current) clearInterval(pollTimerRef.current);
    }

    return () => {
      if (pollTimerRef.current) clearInterval(pollTimerRef.current);
    };
  }, [isCallActive, callSid, callStatus]);

  const startCall = async (
    lead: ActiveLeadCallInfo,
    mode: 'human-agent' | 'voice-ai' = 'human-agent'
  ) => {
    setActiveLead(lead);
    setCallMode(mode);
    setIsCallActive(true);
    setCallStatus('initiating');
    setCallDuration(0);
    setIsMuted(false);
    setIsSpeakerOn(true);
    setIsKeypadOpen(false);
    setDtmfDisplay('');
    setDtmfFeedback(null);
    soundSynthesizer.setMuted(false);
    soundSynthesizer.setSpeaker(true);
    livekitClientService.setMuted(false);
    livekitClientService.setSpeaker(true);
    voiceAiEngine.setMuted(false);
    voiceAiEngine.setSpeaker(true);
    setCallNotes('');
    setCallDisposition(mode === 'voice-ai' ? 'AI Voice Call Completed' : 'Connected & Qualified');
    setLiveTranscript([]);
    setProviderInfo('Establishing LiveKit WebRTC channel...');

    // Play quick initial dial sequence
    soundSynthesizer.playDtmf('9', 120);
    setTimeout(() => soundSynthesizer.playDtmf('1', 120), 160);

    try {
      if (mode === 'voice-ai') {
        const roomName = `onground-ai-lead-${lead.id}`;
        const sid = `LK_AI_${Date.now()}`;
        setCallSid(sid);

        // Transition to Ringing
        setCallStatus('ringing');
        soundSynthesizer.startRingback();

        // 1. Fetch server-side signed LiveKit token
        const tokenRes = await fetchLiveKitTokenApi({
          roomName,
          participantName: 'Alex Chen (Agent)',
          identity: `agent_${Date.now()}`,
        });

        // 2. Transition to Live Connected after ringback
        setTimeout(async () => {
          soundSynthesizer.stopRingback();
          soundSynthesizer.playConnectChime();
          setCallStatus('connected');
          setProviderInfo(
            tokenRes.data?.isConfigured
              ? 'LiveKit Cloud WebRTC • Real Microphone & Voice AI'
              : 'LiveKit Local WebRTC • Real Microphone & Voice AI'
          );

          // Connect WebRTC room if token generated
          if (tokenRes.data?.token && tokenRes.data?.wsUrl) {
            await livekitClientService.joinRoom(tokenRes.data.wsUrl, tokenRes.data.token);
          }

          // Enable user microphone for live speech input
          await soundSynthesizer.enableMicrophone();

          // Start voice AI engine listening on actual microphone and speaking replies aloud
          voiceAiEngine.startSession(sid, lead.name, {
            onCustomerSpeech: (text: string) => {
              setLiveTranscript((prev) => [
                ...prev,
                {
                  role: 'user',
                  content: text,
                  timestamp: 'Just now',
                },
              ]);
            },
            onAiSpeech: (text: string) => {
              setLiveTranscript((prev) => [
                ...prev,
                {
                  role: 'assistant',
                  content: text,
                  timestamp: 'Just now',
                },
              ]);
            },
            onStatusChange: (statusText: string) => {
              setProviderInfo(statusText);
            },
            onTransferRequested: () => {
              setProviderInfo('Transferred to Human Specialist (Alex Chen)');
              setCallDisposition('Transferred to Agent');
            },
            onOptOutRequested: () => {
              setProviderInfo('Customer Opted Out - Number Removed');
              setCallDisposition('Opted Out');
            },
          });
        }, 1800);
      } else {
        // Human-to-Human WebRTC Call:
        const roomName = `onground-human-lead-${lead.id}`;
        const sid = `LK_HUMAN_${Date.now()}`;
        setCallSid(sid);

        setCallStatus('ringing');
        soundSynthesizer.startRingback();

        const tokenRes = await fetchLiveKitTokenApi({
          roomName,
          participantName: 'Alex Chen (Agent)',
          identity: `agent_${Date.now()}`,
        });

        setTimeout(async () => {
          soundSynthesizer.stopRingback();
          soundSynthesizer.playConnectChime();
          setCallStatus('connected');
          setProviderInfo(
            tokenRes.data?.isConfigured
              ? 'LiveKit Cloud WebRTC • Two-Way HD Audio Line'
              : 'LiveKit Local WebRTC • Two-Way HD Audio Line'
          );

          if (tokenRes.data?.token && tokenRes.data?.wsUrl) {
            await livekitClientService.joinRoom(tokenRes.data.wsUrl, tokenRes.data.token);
          }
          await soundSynthesizer.enableMicrophone();
        }, 1800);
      }
    } catch (err: any) {
      soundSynthesizer.stopRingback();
      setCallStatus('failed');
      setProviderInfo(`Error: ${err.message || 'Call failed'}`);
    }
  };

  const endCall = () => {
    soundSynthesizer.stopRingback();
    soundSynthesizer.playDisconnectTone();
    soundSynthesizer.disableMicrophone();
    voiceAiEngine.stopSession();
    livekitClientService.leaveRoom();
    setCallStatus('ended');
  };

  const toggleMute = () => {
    setIsMuted((prev) => {
      const next = !prev;
      soundSynthesizer.setMuted(next);
      livekitClientService.setMuted(next);
      voiceAiEngine.setMuted(next);
      return next;
    });
  };

  const toggleSpeaker = () => {
    setIsSpeakerOn((prev) => {
      const next = !prev;
      soundSynthesizer.setSpeaker(next);
      livekitClientService.setSpeaker(next);
      voiceAiEngine.setSpeaker(next);
      return next;
    });
  };

  const toggleKeypad = () => {
    setIsKeypadOpen((prev) => !prev);
  };

  const pressDtmf = (digit: string) => {
    setDtmfDisplay((prev) => prev + digit);
    soundSynthesizer.playDtmf(digit, 150);

    if (callStatus === 'connected' || callStatus === 'ringing') {
      if (callSid?.startsWith('CA')) {
        sendDtmfApi(callSid, digit);
        setDtmfFeedback(`Tone "${digit}" transmitted on Carrier PSTN`);
      } else if (callSid?.startsWith('LK_')) {
        livekitClientService.sendDtmf(digit);
        setDtmfFeedback(`Tone "${digit}" sent over WebRTC DataChannel`);
      } else {
        setDtmfFeedback(`Tone "${digit}" generated (Local AudioContext)`);
      }
    } else {
      setDtmfFeedback(`Tone "${digit}" local feedback`);
    }
  };

  const backspaceDtmf = () => {
    setDtmfDisplay((prev) => prev.slice(0, -1));
  };

  const clearDtmf = () => {
    setDtmfDisplay('');
    setDtmfFeedback(null);
  };

  const saveAndDismissCall = () => {
    if (activeLead) {
      const turnsText =
        liveTranscript.length > 0
          ? liveTranscript
              .map((t) => `${t.role === 'assistant' ? 'AvaniBot' : 'Customer'}: "${t.content}"`)
              .join(' | ')
          : `Call completed with ${activeLead.name}.`;

      const record = {
        leadId: activeLead.id,
        leadName: activeLead.name,
        company: activeLead.company,
        phone: activeLead.phone,
        direction: 'outbound',
        duration: callDuration,
        outcome: callDisposition,
        notes:
          callNotes ||
          (callMode === 'voice-ai'
            ? `Autonomous AI Voice call via AvaniBot (${liveTranscript.length} dialogue turns). Outcome: ${callDisposition}.`
            : 'Human agent click-to-call session completed.'),
        timestamp: 'Just now',
        hasRecording: true,
        sentiment: callDisposition.includes('Qualified') || callDisposition.includes('AI') ? 'Positive' : 'Neutral',
        transcriptSnippet: turnsText,
        transportType: callSid?.startsWith('CA') ? 'pstn' : 'webrtc',
      };

      logCallRecordApi(record);
      if (onCallCompleted) {
        onCallCompleted(record);
      }
    }

    voiceAiEngine.stopSession();
    livekitClientService.leaveRoom();
    setIsCallActive(false);
    setCallStatus('idle');
    setActiveLead(null);
    setCallDuration(0);
    setCallSid(null);
    setLiveTranscript([]);
    setDtmfDisplay('');
    setDtmfFeedback(null);
  };

  return (
    <CallingContext.Provider
      value={{
        isCallActive,
        callStatus,
        activeLead,
        callDuration,
        isMuted,
        isSpeakerOn,
        isKeypadOpen,
        dtmfDisplay,
        dtmfFeedback,
        callMode,
        providerInfo,
        callSid,
        callNotes,
        callDisposition,
        audioLevels,
        liveTranscript,
        startCall,
        endCall,
        toggleMute,
        toggleSpeaker,
        toggleKeypad,
        pressDtmf,
        backspaceDtmf,
        clearDtmf,
        setCallNotes,
        setCallDisposition,
        saveAndDismissCall,
      }}
    >
      {children}
    </CallingContext.Provider>
  );
};

export const useCalling = () => {
  const context = useContext(CallingContext);
  if (!context) {
    throw new Error('useCalling must be used within a CallingProvider');
  }
  return context;
};
