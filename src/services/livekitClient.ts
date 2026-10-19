import { Room, RoomEvent, createLocalAudioTrack, LocalAudioTrack, RemoteAudioTrack } from 'livekit-client';

export interface WebRtcCallSession {
  room: Room | null;
  localAudioTrack: LocalAudioTrack | null;
  remoteAudioTracks: RemoteAudioTrack[];
  isConnected: boolean;
}

class LiveKitClientService {
  private currentSession: WebRtcCallSession = {
    room: null,
    localAudioTrack: null,
    remoteAudioTracks: [],
    isConnected: false,
  };
  private attachedAudioElements: HTMLAudioElement[] = [];
  private isSpeakerOn: boolean = true;

  /**
   * Connect to a LiveKit WebRTC room with token
   */
  public async joinRoom(
    wsUrl: string,
    token: string,
    onRemoteAudioAttached?: (element: HTMLAudioElement) => void
  ): Promise<WebRtcCallSession> {
    try {
      console.log(`[LiveKitClient] Connecting to WebRTC room at ${wsUrl}...`);

      const room = new Room({
        adaptiveStream: true,
        dynacast: true,
        audioCaptureDefaults: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });

      // Handle remote audio subscription (e.g., when customer or second tab speaks)
      room.on(RoomEvent.TrackSubscribed, (track, publication, participant) => {
        if (track.kind === 'audio') {
          console.log(`[LiveKitClient] Subscribed to remote audio track from ${participant.identity}`);
          const audioElement = track.attach();
          audioElement.autoplay = true;
          audioElement.muted = !this.isSpeakerOn;
          audioElement.volume = this.isSpeakerOn ? 1.0 : 0.0;
          this.attachedAudioElements.push(audioElement);
          this.currentSession.remoteAudioTracks.push(track as RemoteAudioTrack);
          if (onRemoteAudioAttached) {
            onRemoteAudioAttached(audioElement);
          }
        }
      });

      room.on(RoomEvent.TrackUnsubscribed, (track) => {
        track.detach().forEach((el) => {
          this.attachedAudioElements = this.attachedAudioElements.filter((a) => a !== el);
          el.remove();
        });
        this.currentSession.remoteAudioTracks = this.currentSession.remoteAudioTracks.filter((t) => t !== track);
      });

      room.on(RoomEvent.Disconnected, () => {
        console.log('[LiveKitClient] Room disconnected');
        this.currentSession.isConnected = false;
      });

      // Connect to server
      await room.connect(wsUrl, token);

      // Create and publish local microphone audio track
      let localAudioTrack: LocalAudioTrack | null = null;
      try {
        localAudioTrack = await createLocalAudioTrack({
          echoCancellation: true,
          noiseSuppression: true,
        });
        await room.localParticipant.publishTrack(localAudioTrack);
        console.log('[LiveKitClient] Local microphone published to WebRTC room');
      } catch (micErr) {
        console.warn('[LiveKitClient] Microphone track publish failed:', micErr);
      }

      this.currentSession = {
        room,
        localAudioTrack,
        remoteAudioTracks: [],
        isConnected: true,
      };

      return this.currentSession;
    } catch (err: any) {
      console.warn('[LiveKitClient] Connection to LiveKit server failed:', err.message);
      // Return degraded session that uses local audio
      return {
        room: null,
        localAudioTrack: null,
        remoteAudioTracks: [],
        isConnected: false,
      };
    }
  }

  /**
   * Leave room & release media tracks
   */
  public leaveRoom() {
    if (this.currentSession.localAudioTrack) {
      this.currentSession.localAudioTrack.stop();
      this.currentSession.localAudioTrack = null;
    }

    if (this.currentSession.room) {
      this.currentSession.room.disconnect();
      this.currentSession.room = null;
    }

    this.currentSession.remoteAudioTracks.forEach((t) => {
      t.detach().forEach((el) => el.remove());
    });
    this.currentSession.remoteAudioTracks = [];
    this.attachedAudioElements = [];
    this.currentSession.isConnected = false;
  }

  /**
   * Mute or unmute local WebRTC microphone track (hardware level)
   */
  public setMuted(muted: boolean) {
    if (this.currentSession.localAudioTrack) {
      if (muted) {
        this.currentSession.localAudioTrack.mute();
      } else {
        this.currentSession.localAudioTrack.unmute();
      }
    }
  }

  /**
   * Control remote participant audio output volume
   */
  public setSpeaker(enabled: boolean) {
    this.isSpeakerOn = enabled;
    this.attachedAudioElements.forEach((el) => {
      el.muted = !enabled;
      el.volume = enabled ? 1.0 : 0.0;
    });
  }

  /**
   * Transmit DTMF tone payload over WebRTC reliable data channel
   */
  public sendDtmf(digit: string): boolean {
    if (this.currentSession.room && this.currentSession.isConnected) {
      try {
        const payload = new TextEncoder().encode(JSON.stringify({ type: 'dtmf', digit, timestamp: Date.now() }));
        this.currentSession.room.localParticipant.publishData(payload, { reliable: true });
        console.log(`[LiveKitClient] DTMF tone "${digit}" dispatched over WebRTC data channel`);
        return true;
      } catch (err) {
        console.warn('[LiveKitClient] Failed to send DTMF data packet:', err);
      }
    }
    return false;
  }
}

export const livekitClientService = new LiveKitClientService();
