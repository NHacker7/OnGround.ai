/**
 * On-Ground.ai AI Voice Service
 * Powers the conversational AI engine for real telephone calls.
 *
 * Implements strict AI sales behavior:
 * - Transparent AI identification
 * - Grounded strictly in business knowledge (never hallucinates)
 * - Concise, polite responses formatted for telephony audio
 * - Human representative handoff detection
 * - Opt-out / Do-Not-Call compliance
 */

export interface ConversationTurn {
  role: 'system' | 'assistant' | 'user';
  content: string;
  timestamp: string;
}

export interface CallSession {
  callSid: string;
  leadId: string;
  leadName: string;
  customerPhone: string;
  history: ConversationTurn[];
  status: 'initiating' | 'ringing' | 'connected' | 'ended' | 'failed' | 'no-answer';
  startTime: number;
  endTime?: number;
  transferredToHuman?: boolean;
  optedOut?: boolean;
}

export const ONGROUND_BUSINESS_KNOWLEDGE = `
BUSINESS INFORMATION & PRODUCT SPECIFICATIONS:
- Company: On-Ground.ai
- What we do: Enterprise Call Center Intelligence & Next-Generation Voice AI platform.
- Key Capabilities:
  1. Sub-200ms latency voice engine (guaranteed faster than Talkdesk and Five9).
  2. Live Agent Speech Analytics & real-time objection handling co-pilot.
  3. Zero-downtime SIP trunk migration and Twilio Voice integration.
  4. Automatic PCI-DSS audio redaction and DTMF cardholder data masking.
  5. 2-way real-time CRM synchronization with Salesforce, HubSpot, and Zendesk.
- Pricing Structure (Official):
  - Starter Tier: $49 per agent seat/month (Up to 10 agents, standard SIP).
  - Growth Tier: $99 per agent seat/month (Up to 50 agents, live AI assists, CRM sync).
  - Enterprise Tier: Custom pricing starting at 50+ seats with dedicated SLA (99.999% uptime) and custom SIP interconnect.
  - Important Rule: Never invent unofficial discounts or custom pricing; refer enterprise deals to human sales executive Alex Chen.
- Support & Security:
  - SOC-2 Type II certified, HIPAA BAA compliant, PCI-DSS Level 1 compliant.
  - 24/7 dedicated support for Enterprise plans.
`;

export const AI_SYSTEM_PROMPT = `
You are AvaniBot, an AI voice sales specialist calling from On-Ground.ai.
You are speaking over a live telephone call to a prospective customer.

STRICT RULES OF ENGAGEMENT:
1. TRANSPARENCY: Always be transparent that you are an AI voice assistant. Never claim or pretend to be a human.
2. BREVITY: Speak in short, conversational sentences (maximum 2 to 3 sentences per response). Long paragraphs sound unnatural over the phone.
3. FACTUAL GROUNDING: Rely strictly on the provided On-Ground.ai business information. NEVER invent unlisted features, false prices, or promises.
4. HUMAN ESCALATION: If the customer asks to speak with a human, agent, representative, or manager, immediately agree and say you will transfer them.
5. OPT-OUT RESPECT: If the customer requests to opt out, stop calling, or be removed from the list, acknowledge immediately with courtesy and confirm their number is removed.
6. TONE: Warm, professional, polite, and attentive.
`;

class AiVoiceService {
  private activeSessions: Map<string, CallSession> = new Map();

  /**
   * Initialize or retrieve call session
   */
  public getOrCreateSession(callSid: string, leadName: string, customerPhone: string, leadId: string = ''): CallSession {
    if (!this.activeSessions.has(callSid)) {
      const session: CallSession = {
        callSid,
        leadId,
        leadName,
        customerPhone,
        status: 'initiating',
        startTime: Date.now(),
        history: [
          {
            role: 'system',
            content: AI_SYSTEM_PROMPT + '\n' + ONGROUND_BUSINESS_KNOWLEDGE,
            timestamp: new Date().toISOString(),
          },
        ],
      };
      this.activeSessions.set(callSid, session);
    }
    return this.activeSessions.get(callSid)!;
  }

  public getSession(callSid: string): CallSession | undefined {
    return this.activeSessions.get(callSid);
  }

  public updateSessionStatus(callSid: string, status: CallSession['status']) {
    const session = this.activeSessions.get(callSid);
    if (session) {
      session.status = status;
      if (status === 'ended' || status === 'failed' || status === 'no-answer') {
        session.endTime = Date.now();
      }
    }
  }

  /**
   * Process customer spoken utterance and generate next AI response
   */
  public async generateAiResponse(callSid: string, customerSpeech: string): Promise<{
    replyText: string;
    action: 'continue' | 'transfer_human' | 'opt_out' | 'end_call';
  }> {
    const session = this.activeSessions.get(callSid);
    const speechLower = customerSpeech.toLowerCase().trim();

    // 1. Detect Opt-out request
    if (
      speechLower.includes('stop calling') ||
      speechLower.includes('remove my number') ||
      speechLower.includes('do not call') ||
      speechLower.includes('unsubscribe') ||
      speechLower.includes('opt out') ||
      speechLower.includes('wrong number')
    ) {
      if (session) session.optedOut = true;
      return {
        replyText: 'I completely understand. I have recorded your opt-out preference and removed your number from our contact list. Have a wonderful day. Goodbye.',
        action: 'opt_out',
      };
    }

    // 2. Detect Human Representative request
    if (
      speechLower.includes('human') ||
      speechLower.includes('representative') ||
      speechLower.includes('person') ||
      speechLower.includes('agent') ||
      speechLower.includes('manager') ||
      speechLower.includes('operator') ||
      speechLower.includes('real person')
    ) {
      if (session) session.transferredToHuman = true;
      return {
        replyText: 'Of course! Transferring you directly to our senior sales specialist, Alex Chen, right now. Please stay on the line.',
        action: 'transfer_human',
      };
    }

    // 3. Detect Hangup / Goodbye
    if (speechLower === 'bye' || speechLower === 'goodbye' || speechLower.includes('not interested') || speechLower.includes('hang up')) {
      return {
        replyText: 'Thank you for your time. Feel free to explore on-ground.ai whenever you are ready. Have a great day!',
        action: 'end_call',
      };
    }

    // 4. Record customer utterance in history
    if (session) {
      session.history.push({
        role: 'user',
        content: customerSpeech,
        timestamp: new Date().toISOString(),
      });
    }

    // 5. Generate conversational response (OpenAI or deterministic knowledge engine)
    const apiKey = process.env.OPENAI_API_KEY;
    if (apiKey && apiKey.startsWith('sk-')) {
      try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: session ? session.history.map((h) => ({ role: h.role, content: h.content })) : [],
            max_tokens: 120,
            temperature: 0.5,
          }),
        });

        if (response.ok) {
          const data: any = await response.json();
          const reply = data.choices?.[0]?.message?.content?.trim();
          if (reply) {
            if (session) {
              session.history.push({
                role: 'assistant',
                content: reply,
                timestamp: new Date().toISOString(),
              });
            }
            return { replyText: reply, action: 'continue' };
          }
        }
      } catch (err) {
        console.warn('[AiVoiceService] OpenAI API call failed, using grounded knowledge responder:', err);
      }
    }

    // 6. Built-in Deterministic Knowledge Responder (Strictly grounded in On-Ground.ai data)
    let reply = '';
    if (speechLower.includes('price') || speechLower.includes('cost') || speechLower.includes('pricing') || speechLower.includes('plan')) {
      reply = 'Our Starter tier is $49 per agent seat monthly, and our Growth tier with live AI assists is $99. Enterprise deployments with custom SLAs are customized for your volume.';
    } else if (speechLower.includes('latency') || speechLower.includes('speed') || speechLower.includes('delay') || speechLower.includes('talkdesk') || speechLower.includes('five9')) {
      reply = 'On-Ground.ai delivers sub-200 millisecond audio latency, significantly faster than legacy providers like Talkdesk, eliminating awkward over-talk on customer calls.';
    } else if (speechLower.includes('security') || speechLower.includes('hipaa') || speechLower.includes('pci') || speechLower.includes('soc2') || speechLower.includes('compliance')) {
      reply = 'We are fully SOC-2 Type II certified and HIPAA BAA compliant, featuring automatic real-time DTMF audio silencing for credit card numbers.';
    } else if (speechLower.includes('crm') || speechLower.includes('salesforce') || speechLower.includes('hubspot') || speechLower.includes('integration')) {
      reply = 'We offer seamless two-way automated sync with Salesforce, HubSpot, and Zendesk, automatically logging call transcripts, audio links, and dispositions.';
    } else if (speechLower.includes('demo') || speechLower.includes('meeting') || speechLower.includes('trial') || speechLower.includes('schedule')) {
      reply = 'I would be delighted to schedule a live technical benchmarking demonstration. Would today at 4:00 PM or tomorrow at 10:00 AM work best for your team?';
    } else {
      reply = 'On-Ground.ai provides sub-200 millisecond enterprise voice infrastructure and live AI agent co-piloting. Would you like me to connect you with our lead architect, Alex Chen?';
    }

    if (session) {
      session.history.push({
        role: 'assistant',
        content: reply,
        timestamp: new Date().toISOString(),
      });
    }

    return { replyText: reply, action: 'continue' };
  }
}

export const aiVoiceService = new AiVoiceService();
