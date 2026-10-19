import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { soundSynthesizer } from '../services/soundSynthesizer';
import { initiateCallApi, logCallRecordApi } from '../services/callApi';

export interface ActiveLeadCallInfo {
  id: string;
  name: string;
  company: string;
  phone: string;
}

export type CallStatus = 'idle' | 'dialing' | 'ringing' | 'connected' | 'ended';

interface CallingContextType {
  isCallActive: boolean;
  callStatus: CallStatus;
  activeLead: ActiveLeadCallInfo | null;
  callDuration: number;
  isMuted: boolean;
  isSpeakerOn: boolean;
  isKeypadOpen: boolean;
  callMode: 'human-agent' | 'voice-ai';
  providerInfo: string;
  callSid: string | null;
  callNotes: string;
  callDisposition: string;
  audioLevels: number[];
  startCall: (lead: ActiveLeadCallInfo, mode?: 'human-agent' | 'voice-ai') => Promise<void>;
  endCall: () => void;
  toggleMute: () => void;
  toggleSpeaker: () => void;
  toggleKeypad: () => void;
  pressDtmf: (digit: string) => void;
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
  const [callMode, setCallMode] = useState<'human-agent' | 'voice-ai'>('human-agent');
  const [providerInfo, setProviderInfo] = useState<string>('Ready');
  const [callSid, setCallSid] = useState<string | null>(null);
  const [callNotes, setCallNotes] = useState<string>('');
  const [callDisposition, setCallDisposition] = useState<string>('Connected & Qualified');
  const [audioLevels, setAudioLevels] = useState<number[]>(new Array(16).fill(0.1));

  const timerRef = useRef<any>(null);
  const animFrameRef = useRef<any>(null);

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

  const startCall = async (lead: ActiveLeadCallInfo, mode: 'human-agent' | 'voice-ai' = 'human-agent') => {
    setActiveLead(lead);
    setCallMode(mode);
    setIsCallActive(true);
    setCallStatus('dialing');
    setCallDuration(0);
    setIsMuted(false);
    setIsKeypadOpen(false);
    setCallNotes('');
    setCallDisposition('Connected & Qualified');
    setProviderInfo('Connecting carrier line...');

    // Play quick initial dial sequence
    soundSynthesizer.playDtmf('9', 120);
    setTimeout(() => soundSynthesizer.playDtmf('1', 120), 160);

    // Call backend API
    try {
      const response = await initiateCallApi({
        leadId: lead.id,
        leadName: lead.name,
        customerPhone: lead.phone,
        mode,
      });

      if (response.data) {
        setCallSid(response.data.callSid || null);
        setProviderInfo(response.data.provider);
      }

      // Transition to Ringing
      setCallStatus('ringing');
      soundSynthesizer.startRingback();

      // Simulate contact picking up after 2.8 seconds
      setTimeout(async () => {
        soundSynthesizer.stopRingback();
        soundSynthesizer.playConnectChime();
        setCallStatus('connected');
        setProviderInfo(
          response.data?.mode === 'real-twilio'
            ? 'Live Twilio Voice Call in Progress'
            : 'Audio Synthesizer Call Connected'
        );
        await soundSynthesizer.enableMicrophone();
      }, 3000);
    } catch (err: any) {
      soundSynthesizer.stopRingback();
      setCallStatus('ended');
      setProviderInfo(`Error: ${err.message || 'Call failed'}`);
    }
  };

  const endCall = () => {
    soundSynthesizer.stopRingback();
    soundSynthesizer.playDisconnectTone();
    soundSynthesizer.disableMicrophone();
    setCallStatus('ended');
  };

  const toggleMute = () => {
    setIsMuted((prev) => !prev);
  };

  const toggleSpeaker = () => {
    setIsSpeakerOn((prev) => !prev);
  };

  const toggleKeypad = () => {
    setIsKeypadOpen((prev) => !prev);
  };

  const pressDtmf = (digit: string) => {
    soundSynthesizer.playDtmf(digit, 150);
  };

  const saveAndDismissCall = () => {
    if (activeLead) {
      const record = {
        leadId: activeLead.id,
        leadName: activeLead.name,
        company: activeLead.company,
        phone: activeLead.phone,
        direction: 'outbound',
        duration: callDuration,
        outcome: callDisposition,
        notes: callNotes || 'Call completed via On-Ground.ai calling console.',
        timestamp: 'Just now',
        hasRecording: true,
        sentiment: callDisposition.includes('Qualified') ? 'Positive' : 'Neutral',
        transcriptSnippet: `Call summary with ${activeLead.name}: Discussion logged by Alex Chen. Disposition set to "${callDisposition}". Notes: ${callNotes || 'Standard follow-up review.'}`,
      };

      logCallRecordApi(record);
      if (onCallCompleted) {
        onCallCompleted(record);
      }
    }

    setIsCallActive(false);
    setCallStatus('idle');
    setActiveLead(null);
    setCallDuration(0);
    setCallSid(null);
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
        callMode,
        providerInfo,
        callSid,
        callNotes,
        callDisposition,
        audioLevels,
        startCall,
        endCall,
        toggleMute,
        toggleSpeaker,
        toggleKeypad,
        pressDtmf,
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
