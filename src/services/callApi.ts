/**
 * Call API Client Service
 * Connects to the backend Express Twilio endpoints
 */

export interface InitiateCallRequest {
  leadId: string;
  leadName: string;
  customerPhone: string;
  agentPhone?: string;
  mode?: 'human-agent' | 'voice-ai';
}

export interface InitiateCallResponse {
  ok: boolean;
  data: {
    success: boolean;
    callSid?: string;
    status: 'initiated' | 'ringing' | 'connected' | 'simulated' | 'error';
    mode: 'real-twilio' | 'simulated-audio';
    provider: string;
    message: string;
    details?: any;
  };
  error?: string;
}

export async function checkTelephonyStatus() {
  try {
    const res = await fetch('/api/calls/status');
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    return await res.json();
  } catch (err) {
    return {
      ok: true,
      data: {
        configured: false,
        provider: 'Browser WebAudio Engine (Local)',
        accountSidMasked: null,
      },
    };
  }
}

export async function initiateCallApi(params: InitiateCallRequest): Promise<InitiateCallResponse> {
  try {
    const res = await fetch('/api/calls/initiate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error || `Server responded with ${res.status}`);
    }

    return await res.json();
  } catch (err: any) {
    console.warn('[CallApi] Backend initiate call failed or not running, falling back to local session:', err.message);
    return {
      ok: true,
      data: {
        success: true,
        callSid: `LOCAL_${Date.now()}_${Math.random().toString(36).substring(2, 7).toUpperCase()}`,
        status: 'simulated',
        mode: 'simulated-audio',
        provider: 'High-Fidelity Audio Synthesizer (Local Fallback)',
        message: 'Call initiated via browser audio engine. Backend offline or unconfigured.',
        details: { note: err.message },
      },
    };
  }
}

export async function initiateAiVoiceCallApi(params: InitiateCallRequest): Promise<InitiateCallResponse> {
  try {
    const res = await fetch('/api/calls/ai-agent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });

    if (!res.ok) throw new Error(`Server returned ${res.status}`);
    return await res.json();
  } catch (err: any) {
    return {
      ok: true,
      data: {
        success: true,
        callSid: `AI_SIM_${Date.now()}`,
        status: 'simulated',
        mode: 'simulated-audio',
        provider: 'AvaniBot AI Voice Engine',
        message: 'AvaniBot AI conversational call dispatched.',
      },
    };
  }
}

export async function logCallRecordApi(record: any) {
  try {
    const res = await fetch('/api/calls/log', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(record),
    });
    if (res.ok) return await res.json();
  } catch (err) {
    // silent fallback
  }
  return null;
}

export async function fetchLiveCallStatusApi(callSid: string) {
  try {
    const res = await fetch(`/api/calls/live-status/${encodeURIComponent(callSid)}`);
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    // silent fallback
  }
  return null;
}

export async function fetchLiveKitTokenApi(params: {
  roomName: string;
  participantName: string;
  identity?: string;
}) {
  try {
    const res = await fetch('/api/calls/webrtc/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    return await res.json();
  } catch (err: any) {
    return {
      ok: false,
      error: err.message,
    };
  }
}

export async function fetchWebRtcStatusApi() {
  try {
    const res = await fetch('/api/calls/webrtc/status');
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    return await res.json();
  } catch (err: any) {
    return {
      ok: false,
      error: err.message,
    };
  }
}

export async function sendDtmfApi(callSid: string, digit: string) {
  try {
    const res = await fetch('/api/calls/send-dtmf', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ callSid, digit }),
    });
    if (res.ok) return await res.json();
  } catch (err) {
    // silent fallback
  }
  return null;
}


