import { AccessToken } from 'livekit-server-sdk';
import dotenv from 'dotenv';

dotenv.config();

export interface LiveKitTokenParams {
  roomName: string;
  participantName: string;
  identity: string;
  metadata?: Record<string, any>;
  isPublisher?: boolean;
}

export interface LiveKitTokenResponse {
  token: string;
  wsUrl: string;
  roomName: string;
  participantName: string;
  identity: string;
  isConfigured: boolean;
  provider: 'livekit-cloud' | 'livekit-local' | 'webrtc-peer';
}

class LiveKitService {
  private url: string;
  private apiKey: string;
  private apiSecret: string;

  constructor() {
    this.url = process.env.LIVEKIT_URL || '';
    this.apiKey = process.env.LIVEKIT_API_KEY || '';
    this.apiSecret = process.env.LIVEKIT_API_SECRET || '';

    if (this.isConfigured()) {
      console.log(`[LiveKitService] Initialized with LiveKit URL: ${this.url}`);
    } else {
      console.log('[LiveKitService] No complete LiveKit Cloud keys in .env. Operating with local WebRTC peer gateway.');
    }
  }

  public isConfigured(): boolean {
    return Boolean(
      this.url &&
      this.apiKey &&
      this.apiSecret &&
      !this.apiKey.includes('your_') &&
      !this.apiSecret.includes('your_')
    );
  }

  public getStatus() {
    return {
      configured: this.isConfigured(),
      url: this.url || 'ws://localhost:7880',
      apiKeyMasked: this.apiKey ? `${this.apiKey.slice(0, 4)}...${this.apiKey.slice(-3)}` : null,
      provider: this.isConfigured() ? 'LiveKit Cloud WebRTC' : 'LiveKit Local / WebRTC Audio Gateway',
    };
  }

  /**
   * Generates a secure, cryptographically signed JWT token for joining a LiveKit WebRTC room.
   */
  public async generateToken(params: LiveKitTokenParams): Promise<LiveKitTokenResponse> {
    const { roomName, participantName, identity, metadata, isPublisher = true } = params;

    const apiKey = this.isConfigured() ? this.apiKey : 'devkey';
    const apiSecret = this.isConfigured() ? this.apiSecret : 'secret_dev_key_for_local_testing_12345';
    const wsUrl = this.isConfigured() ? this.url : (process.env.LIVEKIT_URL || 'ws://127.0.0.1:7880');

    try {
      const at = new AccessToken(apiKey, apiSecret, {
        identity: identity || `user-${Date.now()}`,
        name: participantName || 'Agent',
        ttl: '2h',
        metadata: metadata ? JSON.stringify(metadata) : undefined,
      });

      at.addGrant({
        roomJoin: true,
        room: roomName,
        canPublish: isPublisher,
        canSubscribe: true,
        canPublishData: true,
      });

      const token = await at.toJwt();

      return {
        token,
        wsUrl,
        roomName,
        participantName,
        identity,
        isConfigured: this.isConfigured(),
        provider: this.isConfigured() ? 'livekit-cloud' : 'livekit-local',
      };
    } catch (err: any) {
      console.error('[LiveKitService] Token generation failed:', err);
      throw new Error(`Failed to generate WebRTC token: ${err.message}`);
    }
  }
}

export const livekitService = new LiveKitService();
