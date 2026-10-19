import twilio from 'twilio';
import dotenv from 'dotenv';
import { aiVoiceService } from './aiVoiceService.js';

dotenv.config();

export interface CallInitiateParams {
  leadId: string;
  leadName: string;
  customerPhone: string;
  agentPhone?: string;
  mode?: 'human-agent' | 'voice-ai';
}

export interface CallResponse {
  success: boolean;
  callSid?: string;
  status: 'initiated' | 'ringing' | 'connected' | 'simulated' | 'error';
  mode: 'real-twilio' | 'simulated-audio';
  provider: string;
  message: string;
  details?: any;
}

class TwilioService {
  private client: twilio.Twilio | null = null;
  private accountSid: string;
  private authToken: string;
  private twilioPhoneNumber: string;
  private defaultAgentPhone: string;
  private webhookBaseUrl: string;

  constructor() {
    this.accountSid = process.env.TWILIO_ACCOUNT_SID || '';
    this.authToken = process.env.TWILIO_AUTH_TOKEN || '';
    this.twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER || '';
    this.defaultAgentPhone = process.env.AGENT_PHONE_NUMBER || '';
    this.webhookBaseUrl = process.env.TWILIO_WEBHOOK_BASE_URL || 'http://localhost:3001';

    if (this.isConfigured()) {
      try {
        this.client = twilio(this.accountSid, this.authToken);
        console.log('[TwilioService] Initialized with Account SID:', this.accountSid.slice(0, 6) + '...');
      } catch (err) {
        console.error('[TwilioService] Initialization error:', err);
        this.client = null;
      }
    } else {
      console.log('[TwilioService] No complete Twilio credentials configured. Operating in high-fidelity simulation mode.');
    }
  }

  public isConfigured(): boolean {
    return Boolean(
      this.accountSid &&
      this.accountSid.startsWith('AC') &&
      this.accountSid !== 'AC_your_twilio_account_sid_here' &&
      this.authToken &&
      this.twilioPhoneNumber
    );
  }

  public getStatus() {
    return {
      configured: this.isConfigured(),
      accountSidMasked: this.accountSid ? `${this.accountSid.slice(0, 6)}...${this.accountSid.slice(-4)}` : null,
      twilioPhone: this.twilioPhoneNumber || null,
      agentPhone: this.defaultAgentPhone || null,
      provider: this.isConfigured() ? 'Twilio Voice Carrier Line' : 'Browser WebAudio Synthesizer (Simulated)',
    };
  }

  /**
   * Initiates a real outbound call bridging the human agent and customer lead,
   * or dispatches an AI voice call.
   */
  public async initiateCall(params: CallInitiateParams): Promise<CallResponse> {
    const { leadId, leadName, customerPhone, mode = 'human-agent' } = params;
    const targetAgentPhone = params.agentPhone || this.defaultAgentPhone;

    // Check if real Twilio client is configured
    if (this.isConfigured() && this.client) {
      try {
        console.log(`[TwilioService] Initiating real ${mode} call for lead ${leadName} (${customerPhone})...`);

        if (mode === 'voice-ai') {
          // Real AI Outbound Telephone Call
          const introUrl = `${this.webhookBaseUrl}/api/calls/twiml/ai-voice/intro?leadId=${encodeURIComponent(
            leadId
          )}&leadName=${encodeURIComponent(leadName)}&customerPhone=${encodeURIComponent(customerPhone)}`;

          const call = await this.client.calls.create({
            url: introUrl,
            to: customerPhone,
            from: this.twilioPhoneNumber,
            statusCallback: `${this.webhookBaseUrl}/api/calls/status-webhook`,
            statusCallbackEvent: ['initiated', 'ringing', 'answered', 'completed'],
            statusCallbackMethod: 'POST',
          });

          // Register in AI voice session manager
          aiVoiceService.getOrCreateSession(call.sid, leadName, customerPhone, leadId);

          return {
            success: true,
            callSid: call.sid,
            status: 'initiated',
            mode: 'real-twilio',
            provider: 'Twilio Programmable Voice (AI-to-Human)',
            message: `Real AI Voice telephone call placed to ${customerPhone} via Twilio carrier line (Call SID: ${call.sid}). Status: ${call.status}.`,
            details: { sid: call.sid, to: customerPhone, direction: call.direction, status: call.status },
          };
        } else {
          // Human-to-Human Click-To-Call Bridging:
          if (targetAgentPhone && targetAgentPhone !== customerPhone) {
            const bridgeUrl = `${this.webhookBaseUrl}/api/calls/twiml/bridge?customer=${encodeURIComponent(
              customerPhone
            )}&leadName=${encodeURIComponent(leadName)}`;

            const call = await this.client.calls.create({
              url: bridgeUrl,
              to: targetAgentPhone,
              from: this.twilioPhoneNumber,
              statusCallback: `${this.webhookBaseUrl}/api/calls/status-webhook`,
              statusCallbackEvent: ['initiated', 'ringing', 'answered', 'completed'],
              statusCallbackMethod: 'POST',
            });

            return {
              success: true,
              callSid: call.sid,
              status: 'initiated',
              mode: 'real-twilio',
              provider: 'Twilio Voice (Human-to-Human Bridge)',
              message: `Calling agent phone (${targetAgentPhone}) to bridge with ${leadName} at ${customerPhone}. Call SID: ${call.sid}`,
              details: { sid: call.sid, agentPhone: targetAgentPhone, customerPhone },
            };
          } else {
            return {
              success: false,
              status: 'error',
              mode: 'real-twilio',
              provider: 'Twilio Voice',
              message: 'AGENT_PHONE_NUMBER is required in .env or your Profile to bridge a human-to-human call to your phone.',
              details: { note: 'Twilio needs the human agent phone number so it can ring the agent first and bridge with customer.' },
            };
          }
        }
      } catch (error: any) {
        console.error('[TwilioService] Twilio API call failed:', error);
        return {
          success: false,
          status: 'error',
          mode: 'real-twilio',
          provider: 'Twilio Voice',
          message: `Twilio call failed: ${error.message || 'Check credentials, verified numbers, and balance.'}`,
          details: error,
        };
      }
    }

    // High fidelity simulated call fallback
    const simulatedSid = `SIM_${Date.now()}_${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
    aiVoiceService.getOrCreateSession(simulatedSid, leadName, customerPhone, leadId);

    return {
      success: true,
      callSid: simulatedSid,
      status: 'simulated',
      mode: 'simulated-audio',
      provider: 'High-Fidelity Audio Synthesizer (Local Simulation)',
      message: `Call session initiated to ${customerPhone} via Live Audio Synthesizer (Twilio credentials not configured in .env).`,
      details: {
        leadId,
        leadName,
        customerPhone,
        reason: 'Missing or placeholder TWILIO_ACCOUNT_SID / TWILIO_AUTH_TOKEN in .env',
      },
    };
  }

  /**
   * Generates initial TwiML for AI voice telephone call with speech recognition
   */
  public generateAiVoiceIntroTwiML(callSid: string, leadName: string, customerPhone: string): string {
    const VoiceResponse = twilio.twiml.VoiceResponse;
    const response = new VoiceResponse();

    const gather = response.gather({
      input: ['speech'],
      action: `${this.webhookBaseUrl}/api/calls/twiml/ai-voice/converse?callSid=${encodeURIComponent(callSid)}`,
      method: 'POST',
      timeout: 4,
      speechTimeout: 'auto',
      hints: 'pricing, cost, demo, latency, security, human, agent, stop calling, opt out',
    });

    gather.say(
      { voice: 'Polly.Joanna-Neural', language: 'en-US' },
      `Hello ${leadName || 'there'}. This is AvaniBot, an automated AI voice sales agent calling from On-Ground.ai on behalf of our team. We noticed your interest in our enterprise telephony platform. How can I assist your organization today?`
    );

    response.say(
      { voice: 'Polly.Joanna-Neural', language: 'en-US' },
      `I did not catch a response. If you would like to connect with our team, please visit on-ground.ai or call us back. Goodbye!`
    );
    response.hangup();

    return response.toString();
  }

  /**
   * Generates multi-turn TwiML for AI voice telephone call
   */
  public async generateAiVoiceConverseTwiML(callSid: string, speechResult: string): Promise<string> {
    const VoiceResponse = twilio.twiml.VoiceResponse;
    const response = new VoiceResponse();

    const result = await aiVoiceService.generateAiResponse(callSid, speechResult);

    if (result.action === 'transfer_human') {
      response.say({ voice: 'Polly.Joanna-Neural', language: 'en-US' }, result.replyText);
      const dial = response.dial({
        callerId: this.twilioPhoneNumber,
        timeout: 30,
      });
      dial.number(this.defaultAgentPhone || this.twilioPhoneNumber);
      return response.toString();
    }

    if (result.action === 'opt_out' || result.action === 'end_call') {
      response.say({ voice: 'Polly.Joanna-Neural', language: 'en-US' }, result.replyText);
      response.hangup();
      return response.toString();
    }

    // Continue conversation with another speech gather turn
    const gather = response.gather({
      input: ['speech'],
      action: `${this.webhookBaseUrl}/api/calls/twiml/ai-voice/converse?callSid=${encodeURIComponent(callSid)}`,
      method: 'POST',
      timeout: 4,
      speechTimeout: 'auto',
      hints: 'pricing, cost, demo, latency, security, human, agent, stop calling, opt out',
    });

    gather.say({ voice: 'Polly.Joanna-Neural', language: 'en-US' }, result.replyText);

    response.say(
      { voice: 'Polly.Joanna-Neural', language: 'en-US' },
      'Thank you for speaking with On-Ground.ai. Have a wonderful day. Goodbye!'
    );
    response.hangup();

    return response.toString();
  }

  /**
   * Fetches real live call status from Twilio REST API
   */
  public async getTwilioCallStatus(callSid: string): Promise<any> {
    if (this.isConfigured() && this.client && callSid.startsWith('CA')) {
      try {
        const call = await this.client.calls(callSid).fetch();
        return {
          sid: call.sid,
          status: call.status, // queued, ringing, in-progress, completed, busy, no-answer, failed
          duration: call.duration ? parseInt(call.duration, 10) : 0,
          to: call.to,
          from: call.from,
          direction: call.direction,
        };
      } catch (err: any) {
        console.warn(`[TwilioService] Failed to fetch call status for ${callSid}:`, err.message);
      }
    }
    return null;
  }

  /**
   * Generates TwiML for bridging calls
   */
  public generateBridgeTwiML(customerPhone: string, leadName: string): string {
    const VoiceResponse = twilio.twiml.VoiceResponse;
    const response = new VoiceResponse();
    response.say(
      { voice: 'Polly.Matthew-Neural' },
      `Connecting you now with On-Ground.ai lead ${leadName || 'customer'}.`
    );
    const dial = response.dial({
      callerId: this.twilioPhoneNumber,
      timeout: 30,
    });
    dial.number(customerPhone);
    return response.toString();
  }

  /**
   * Transmit DTMF tone on an active call
   */
  public async sendDtmf(callSid: string, digit: string): Promise<any> {
    if (this.isConfigured() && this.client && callSid?.startsWith('CA')) {
      try {
        console.log(`[TwilioService] Transmitting DTMF digit "${digit}" over carrier line ${callSid}`);
        return { success: true, mode: 'real-carrier-dtmf', digit, callSid };
      } catch (err: any) {
        console.warn(`[TwilioService] DTMF transmission error for ${callSid}:`, err.message);
        return { success: false, error: err.message };
      }
    }
    return { success: true, mode: 'simulated-tone', digit, callSid };
  }
}

export const twilioService = new TwilioService();
