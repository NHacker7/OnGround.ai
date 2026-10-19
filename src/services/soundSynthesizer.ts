/**
 * Telephony Audio Synthesizer
 * Generates authentic dual-tone multi-frequency (DTMF) dial tones,
 * North American standard ringback tones (440Hz + 480Hz),
 * and live audio waveform analysis for phone calls.
 *
 * Implements independent hardware-level control for:
 * - Microphone input muting (disables MediaStream audio tracks)
 * - Speaker audio output (routes through master gain node to AudioContext destination)
 */

class SoundSynthesizer {
  private ctx: AudioContext | null = null;
  private masterSpeakerGain: GainNode | null = null;
  private ringbackInterval: any = null;
  private analyser: AnalyserNode | null = null;
  private micStream: MediaStream | null = null;
  private micSource: MediaStreamAudioSourceNode | null = null;
  private isMuted: boolean = false;
  private isSpeakerOn: boolean = true;

  private getContext(): AudioContext {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.masterSpeakerGain = this.ctx.createGain();
      this.masterSpeakerGain.gain.setValueAtTime(this.isSpeakerOn ? 1.0 : 0.0, this.ctx.currentTime);
      this.masterSpeakerGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  private getSpeakerDestination(): AudioNode {
    this.getContext();
    return this.masterSpeakerGain || this.ctx!.destination;
  }

  /**
   * Independently control speaker output (hardware level master gain)
   */
  public setSpeaker(enabled: boolean) {
    this.isSpeakerOn = enabled;
    if (this.ctx && this.masterSpeakerGain) {
      this.masterSpeakerGain.gain.setValueAtTime(enabled ? 1.0 : 0.0, this.ctx.currentTime);
    }
  }

  /**
   * Independently control microphone input (MediaStream track hardware mute)
   */
  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (this.micStream) {
      this.micStream.getAudioTracks().forEach((track) => {
        track.enabled = !muted;
      });
    }
  }

  public getMutedState(): boolean {
    return this.isMuted;
  }

  public getSpeakerState(): boolean {
    return this.isSpeakerOn;
  }

  /**
   * Play DTMF tone for a specific keypad button
   */
  public playDtmf(key: string, durationMs: number = 160) {
    try {
      const ctx = this.getContext();
      const dtmfFrequencies: Record<string, [number, number]> = {
        '1': [697, 1209],
        '2': [697, 1336],
        '3': [697, 1477],
        '4': [770, 1209],
        '5': [770, 1336],
        '6': [770, 1477],
        '7': [852, 1209],
        '8': [852, 1336],
        '9': [852, 1477],
        '*': [941, 1209],
        '0': [941, 1336],
        '#': [941, 1477],
      };

      const freqs = dtmfFrequencies[key] || [440, 480];

      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gainNode = ctx.createGain();

      osc1.type = 'sine';
      osc2.type = 'sine';

      osc1.frequency.value = freqs[0];
      osc2.frequency.value = freqs[1];

      gainNode.gain.setValueAtTime(0.12, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + durationMs / 1000);

      osc1.connect(gainNode);
      osc2.connect(gainNode);
      gainNode.connect(this.getSpeakerDestination());

      osc1.start();
      osc2.start();
      osc1.stop(ctx.currentTime + durationMs / 1000);
      osc2.stop(ctx.currentTime + durationMs / 1000);
    } catch (e) {
      console.warn('AudioContext not allowed or supported', e);
    }
  }

  /**
   * Start authentic US ringback tone (440Hz + 480Hz, 2s tone, 3s pause)
   */
  public startRingback() {
    this.stopRingback();
    const playBurst = () => {
      try {
        const ctx = this.getContext();
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const gain = ctx.createGain();

        osc1.type = 'sine';
        osc2.type = 'sine';
        osc1.frequency.value = 440;
        osc2.frequency.value = 480;

        // Soft attack & release
        gain.gain.setValueAtTime(0.001, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.09, ctx.currentTime + 0.08);
        gain.gain.setValueAtTime(0.09, ctx.currentTime + 1.8);
        gain.gain.linearRampToValueAtTime(0.001, ctx.currentTime + 2.0);

        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(this.getSpeakerDestination());

        osc1.start();
        osc2.start();
        osc1.stop(ctx.currentTime + 2.0);
        osc2.stop(ctx.currentTime + 2.0);
      } catch (err) {
        console.warn('Ringback audio error', err);
      }
    };

    playBurst();
    this.ringbackInterval = setInterval(playBurst, 5000);
  }

  /**
   * Stop ringback tone
   */
  public stopRingback() {
    if (this.ringbackInterval) {
      clearInterval(this.ringbackInterval);
      this.ringbackInterval = null;
    }
  }

  /**
   * Play call connect chime
   */
  public playConnectChime() {
    try {
      const ctx = this.getContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15); // A5

      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);

      osc.connect(gain);
      gain.connect(this.getSpeakerDestination());

      osc.start();
      osc.stop(ctx.currentTime + 0.35);
    } catch (e) {
      // silent
    }
  }

  /**
   * Play call disconnect tone
   */
  public playDisconnectTone() {
    try {
      const ctx = this.getContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(220, ctx.currentTime + 0.25);

      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);

      osc.connect(gain);
      gain.connect(this.getSpeakerDestination());

      osc.start();
      osc.stop(ctx.currentTime + 0.3);
    } catch (e) {
      // silent
    }
  }

  /**
   * Connect real user microphone for live speech input and waveform analysis
   */
  public async enableMicrophone(): Promise<boolean> {
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        this.micStream = stream;

        // Apply current mute state to incoming tracks
        stream.getAudioTracks().forEach((track) => {
          track.enabled = !this.isMuted;
        });

        const ctx = this.getContext();
        this.analyser = ctx.createAnalyser();
        this.analyser.fftSize = 64;
        this.micSource = ctx.createMediaStreamSource(stream);
        this.micSource.connect(this.analyser);
        return true;
      }
    } catch (err) {
      console.log('Microphone permission not granted or unavailable, using simulated voice analysis');
    }
    return false;
  }

  public disableMicrophone() {
    if (this.micStream) {
      this.micStream.getTracks().forEach((track) => track.stop());
      this.micStream = null;
    }
    if (this.micSource) {
      this.micSource.disconnect();
      this.micSource = null;
    }
  }

  /**
   * Get audio frequency levels for visualizer (0.0 to 1.0)
   */
  public getAudioLevels(): number[] {
    if (this.analyser && !this.isMuted) {
      const dataArray = new Uint8Array(this.analyser.frequencyBinCount);
      this.analyser.getByteFrequencyData(dataArray);
      const bars: number[] = [];
      const step = Math.floor(dataArray.length / 16);
      for (let i = 0; i < 16; i++) {
        const val = dataArray[i * step] || 0;
        bars.push(Math.min(1, Math.max(0.08, val / 255)));
      }
      return bars;
    }

    if (this.isMuted) {
      return new Array(16).fill(0.03);
    }

    // Default simulated waveform dynamics if microphone isn't connected
    const now = Date.now() / 200;
    const bars: number[] = [];
    for (let i = 0; i < 16; i++) {
      const wave = Math.sin(now + i * 0.4) * 0.4 + 0.5;
      const noise = (Math.random() - 0.5) * 0.15;
      bars.push(Math.max(0.12, Math.min(0.95, wave + noise)));
    }
    return bars;
  }
}

export const soundSynthesizer = new SoundSynthesizer();
