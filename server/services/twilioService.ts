import twilio from 'twilio';
import dotenv from 'dotenv';

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
      provider: this.isConfigured() ? 'Twilio Programmable Voice' : 'Browser WebAudio Synthesizer (Simulated)',
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
        console.log(`[TwilioService] Initiating real call for lead ${leadName} (${customerPhone})...`);

        if (mode === 'voice-ai') {
          // AI Outbound Voice Call using TwiML Polly voice
          const twiml = `
            <Response>
              <Say voice="Polly.Joanna-Neural" language="en-US">
                Hello ${leadName}. This is AvaniBot from On-Ground.ai following up on your call center intelligence platform demonstration. Our team noticed your recent evaluation of our automated workflows.
              </Say>
              <Pause length="1"/>
              <Say voice="Polly.Joanna-Neural" language="en-US">
                We have reserved priority onboarding for your organization. Please press 1 to connect immediately with senior lead Alex Chen, or press 2 to schedule a follow-up briefing.
              </Say>
              <Gather numDigits="1" action="${this.webhookBaseUrl}/api/calls/handle-gather" method="POST">
                <Say voice="Polly.Joanna-Neural">We look forward to speaking with you.</Say>
              </Gather>
            </Response>
          `;

          const call = await this.client.calls.create({
            twiml,
            to: customerPhone,
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
            provider: 'Twilio Voice (AI-to-Human)',
            message: `Real AI Voice call placed to ${customerPhone} (Call SID: ${call.sid}). Status: ${call.status}.`,
            details: { sid: call.sid, to: customerPhone, direction: call.direction },
          };
        } else {
          // Human-to-Human Click-To-Call Bridging:
          // If agent phone is defined, dial agent phone first, then bridge to customer.
          // Otherwise, dial customer phone directly with agent greeting.
          if (targetAgentPhone && targetAgentPhone !== customerPhone) {
            const bridgeUrl = `${this.webhookBaseUrl}/api/calls/twiml/bridge?customer=${encodeURIComponent(customerPhone)}&leadName=${encodeURIComponent(leadName)}`;

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
            // Direct call to customer
            const directTwiml = `
              <Response>
                <Say voice="Polly.Matthew-Neural">Hello ${leadName}, connecting your call with On-Ground.ai specialist Alex Chen.</Say>
                <Dial callerId="${this.twilioPhoneNumber}">${targetAgentPhone || this.twilioPhoneNumber}</Dial>
              </Response>
            `;

            const call = await this.client.calls.create({
              twiml: directTwiml,
              to: customerPhone,
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
              provider: 'Twilio Voice Outbound',
              message: `Direct outbound call placed to ${customerPhone}. SID: ${call.sid}`,
              details: { sid: call.sid, customerPhone },
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
    return {
      success: true,
      callSid: simulatedSid,
      status: 'simulated',
      mode: 'simulated-audio',
      provider: 'High-Fidelity Audio Synthesizer',
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
}

export const twilioService = new TwilioService();
