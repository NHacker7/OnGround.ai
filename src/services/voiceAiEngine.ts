/**
 * Voice AI Engine (Web Speech STT + Conversational AI + Speech Synthesis TTS)
 * 100% Free, zero-cost, locally runnable in modern browsers (Chrome, Edge, Safari, Firefox).
 *
 * Capabilities:
 * - Real microphone speech-to-text (STT) via Web Speech API
 * - Real speech synthesis (TTS) with natural voice selection
 * - Interruption handling (cancels speech output when user interrupts)
 * - Multi-turn conversational dialogue management
 */

export interface VoiceAiCallbacks {
  onCustomerSpeech: (text: string) => void;
  onAiSpeech: (text: string) => void;
  onStatusChange: (status: string) => void;
  onTransferRequested?: () => void;
  onOptOutRequested?: () => void;
}

class VoiceAiEngine {
  private recognition: any = null;
  private isListening: boolean = false;
  private isSpeaking: boolean = false;
  private callbacks: VoiceAiCallbacks | null = null;
  private currentCallSid: string | null = null;
  private isMuted: boolean = false;
  private isSpeakerOn: boolean = true;

  constructor() {
    this.initSpeechRecognition();
  }

  private initSpeechRecognition() {
    if (typeof window === 'undefined') return;

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      try {
        this.recognition = new SpeechRecognition();
        this.recognition.continuous = true;
        this.recognition.interimResults = false;
        this.recognition.lang = 'en-US';

        this.recognition.onresult = (event: any) => {
          if (this.isMuted) return;

          const lastResultIndex = event.results.length - 1;
          const transcript = event.results[lastResultIndex][0].transcript.trim();

          if (transcript.length > 0) {
            console.log('[VoiceAiEngine] Spoken speech detected:', transcript);

            // Interruption handling: cancel ongoing TTS speech if customer interrupts
            if (this.isSpeaking) {
              window.speechSynthesis.cancel();
              this.isSpeaking = false;
            }

            if (this.callbacks?.onCustomerSpeech) {
              this.callbacks.onCustomerSpeech(transcript);
            }

            // Send to AI conversation model
            this.handleCustomerUtterance(transcript);
          }
        };

        this.recognition.onerror = (event: any) => {
          if (event.error !== 'no-speech') {
            console.warn('[VoiceAiEngine] Speech recognition error:', event.error);
          }
        };

        this.recognition.onend = () => {
          // Keep recognition alive while call is active
          if (this.isListening) {
            try {
              this.recognition.start();
            } catch (e) {
              // already running
            }
          }
        };
      } catch (err) {
        console.warn('[VoiceAiEngine] Could not initialize Web Speech API:', err);
      }
    }
  }

  /**
   * Start listening to user microphone
   */
  public startSession(callSid: string, leadName: string, callbacks: VoiceAiCallbacks) {
    this.currentCallSid = callSid;
    this.callbacks = callbacks;
    this.isListening = true;

    if (this.recognition) {
      try {
        this.recognition.start();
        console.log('[VoiceAiEngine] Speech recognition listening on microphone');
      } catch (err) {
        // already started
      }
    }

    // Play transparent AI greeting aloud
    const greeting = `Hello ${leadName || 'there'}. This is AvaniBot, an automated AI voice sales agent calling from On-Ground.ai on behalf of our team. We noticed your interest in our enterprise telephony platform. How can I assist your organization today?`;
    this.speakAloud(greeting);
    if (this.callbacks?.onAiSpeech) {
      this.callbacks.onAiSpeech(greeting);
    }
  }

  /**
   * Stop session & cancel speech
   */
  public stopSession() {
    this.isListening = false;
    this.currentCallSid = null;
    this.callbacks = null;

    if (this.recognition) {
      try {
        this.recognition.stop();
      } catch (e) {
        // ignore
      }
    }

    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      this.isSpeaking = false;
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
  }

  /**
   * Control AI speech output volume (Speaker On/Off)
   */
  public setSpeaker(enabled: boolean) {
    this.isSpeakerOn = enabled;
    if (!enabled && typeof window !== 'undefined' && window.speechSynthesis) {
      if (this.isSpeaking) {
        window.speechSynthesis.cancel();
        this.isSpeaking = false;
      }
    }
  }

  /**
   * Process customer speech and generate context-aware response
   */
  private async handleCustomerUtterance(text: string) {
    if (!this.currentCallSid) return;

    try {
      if (this.callbacks?.onStatusChange) {
        this.callbacks.onStatusChange('AvaniBot is processing your question...');
      }

      // Query server AI conversation endpoint
      const res = await fetch('/api/calls/ai-agent/converse-text', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          callSid: this.currentCallSid,
          speechText: text,
        }),
      });

      if (!res.ok) throw new Error('AI response query failed');
      const data = await res.json();

      if (data.ok && data.data) {
        const { replyText, action } = data.data;

        // Speak AI response aloud
        this.speakAloud(replyText);

        if (this.callbacks?.onAiSpeech) {
          this.callbacks.onAiSpeech(replyText);
        }

        if (action === 'transfer_human' && this.callbacks?.onTransferRequested) {
          this.callbacks.onTransferRequested();
        } else if (action === 'opt_out' && this.callbacks?.onOptOutRequested) {
          this.callbacks.onOptOutRequested();
        }
      }
    } catch (err: any) {
      console.warn('[VoiceAiEngine] Fallback response on error:', err.message);
      const fallbackReply =
        'On-Ground.ai delivers sub-200 millisecond voice latency and guaranteed zero-downtime cutover. Would you like me to connect you with our senior specialist, Alex Chen?';
      this.speakAloud(fallbackReply);
      if (this.callbacks?.onAiSpeech) {
        this.callbacks.onAiSpeech(fallbackReply);
      }
    }
  }

  /**
   * Synthesize natural speech audio aloud
   */
  public speakAloud(text: string) {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.lang = 'en-US';
    utterance.volume = this.isSpeakerOn ? 1.0 : 0.0;

    // Pick natural voice if available
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice =
      voices.find((v) => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Jenny') || v.name.includes('Samantha'))) ||
      voices.find((v) => v.lang.startsWith('en-US')) ||
      voices[0];

    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    utterance.onstart = () => {
      this.isSpeaking = true;
    };

    utterance.onend = () => {
      this.isSpeaking = false;
      if (this.callbacks?.onStatusChange) {
        this.callbacks.onStatusChange('AvaniBot listening for your response...');
      }
    };

    utterance.onerror = (e) => {
      console.warn('[VoiceAiEngine] Speech synthesis error:', e);
      this.isSpeaking = false;
    };

    window.speechSynthesis.speak(utterance);
  }
}

export const voiceAiEngine = new VoiceAiEngine();
