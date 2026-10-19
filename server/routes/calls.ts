import { Router, Request, Response } from 'express';
import { twilioService } from '../services/twilioService.js';
import { aiVoiceService } from '../services/aiVoiceService.js';
import { livekitService } from '../services/livekitService.js';

const router = Router();

// In-memory call logs store to persist across server session
const callHistoryLogs: any[] = [];

/**
 * GET /api/calls/status
 * Returns Twilio configuration status and provider info
 */
router.get('/status', (req: Request, res: Response) => {
  const status = twilioService.getStatus();
  res.json({
    ok: true,
    data: status,
    timestamp: new Date().toISOString(),
  });
});

/**
 * GET /api/calls/webrtc/status
 * Returns LiveKit WebRTC status
 */
router.get('/webrtc/status', (req: Request, res: Response) => {
  const status = livekitService.getStatus();
  res.json({
    ok: true,
    data: status,
    timestamp: new Date().toISOString(),
  });
});

/**
 * POST /api/calls/webrtc/token
 * Generate secure LiveKit access token for browser-to-browser or AI room
 */
router.post('/webrtc/token', async (req: Request, res: Response) => {
  try {
    const { roomName, participantName, identity, metadata } = req.body;
    if (!roomName) {
      return res.status(400).json({ ok: false, error: 'roomName is required.' });
    }

    const tokenData = await livekitService.generateToken({
      roomName,
      participantName: participantName || 'Agent',
      identity: identity || `user_${Date.now()}`,
      metadata,
    });

    res.json({ ok: true, data: tokenData });
  } catch (err: any) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

/**
 * POST /api/calls/ai-agent/converse-text
 * REST endpoint for processing customer speech recognized in browser
 */
router.post('/ai-agent/converse-text', async (req: Request, res: Response) => {
  try {
    const { callSid, speechText } = req.body;
    if (!speechText) {
      return res.status(400).json({ ok: false, error: 'speechText is required.' });
    }

    const sid = callSid || `WEBRTC_${Date.now()}`;
    const response = await aiVoiceService.generateAiResponse(sid, speechText);
    res.json({ ok: true, data: response });
  } catch (err: any) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

/**
 * POST /api/calls/initiate
 * Initiate a call (human-to-human bridge or direct)
 */
router.post('/initiate', async (req: Request, res: Response) => {
  try {
    const { leadId, leadName, customerPhone, agentPhone, mode } = req.body;

    if (!customerPhone) {
      return res.status(400).json({
        ok: false,
        error: 'customerPhone is required to place a call.',
      });
    }

    const result = await twilioService.initiateCall({
      leadId,
      leadName: leadName || 'Customer Lead',
      customerPhone,
      agentPhone,
      mode: mode || 'human-agent',
    });

    res.json({
      ok: result.success,
      data: result,
    });
  } catch (err: any) {
    console.error('Call initiate endpoint error:', err);
    res.status(500).json({
      ok: false,
      error: err.message || 'Internal server error while initiating call.',
    });
  }
});

/**
 * POST /api/calls/ai-agent
 * Initiate genuine AI Voice Telephone Call
 */
router.post('/ai-agent', async (req: Request, res: Response) => {
  try {
    const { leadId, leadName, customerPhone } = req.body;
    if (!customerPhone) {
      return res.status(400).json({ ok: false, error: 'customerPhone is required.' });
    }

    const result = await twilioService.initiateCall({
      leadId,
      leadName: leadName || 'Customer',
      customerPhone,
      mode: 'voice-ai',
    });

    res.json({
      ok: result.success,
      data: result,
    });
  } catch (err: any) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

/**
 * GET/POST /api/calls/twiml/ai-voice/intro
 * Serves initial TwiML with transparent AI disclosure and speech gather
 */
router.all('/twiml/ai-voice/intro', (req: Request, res: Response) => {
  const callSid = (req.body.CallSid || req.query.callSid || 'CALL_' + Date.now()) as string;
  const leadName = (req.query.leadName || req.body.leadName || 'Customer') as string;
  const customerPhone = (req.query.customerPhone || req.body.customerPhone || req.body.To || '') as string;

  const twiml = twilioService.generateAiVoiceIntroTwiML(callSid, leadName, customerPhone);
  res.type('text/xml').send(twiml);
});

/**
 * POST /api/calls/twiml/ai-voice/converse
 * Handles customer SpeechResult from Twilio, evaluates AI response, returns next speech turn
 */
router.post('/twiml/ai-voice/converse', async (req: Request, res: Response) => {
  const callSid = (req.query.callSid || req.body.CallSid || '') as string;
  const speechResult = req.body.SpeechResult || req.body.Digits || '';
  const confidence = req.body.Confidence;

  console.log(`[Twilio Speech Result] SID: ${callSid} | Spoken: "${speechResult}" (Confidence: ${confidence})`);

  try {
    const twiml = await twilioService.generateAiVoiceConverseTwiML(callSid, speechResult);
    res.type('text/xml').send(twiml);
  } catch (err: any) {
    console.error('Error in AI converse TwiML:', err);
    res.type('text/xml').send(
      '<Response><Say voice="Polly.Joanna-Neural">Thank you for calling On-Ground.ai. Goodbye!</Say><Hangup/></Response>'
    );
  }
});

/**
 * GET /api/calls/live-status/:callSid
 * Returns real-time provider status and transcript for active call
 */
router.get('/live-status/:callSid', async (req: Request, res: Response) => {
  const callSid = String(req.params.callSid);

  // 1. Check Twilio live status if real call
  const twilioStatus = await twilioService.getTwilioCallStatus(callSid);

  // 2. Check AI voice session
  const aiSession = aiVoiceService.getSession(callSid);

  res.json({
    ok: true,
    data: {
      callSid,
      provider: twilioService.isConfigured() ? 'Twilio Voice (Real Carrier)' : 'Local Audio Synthesizer (Simulated)',
      twilioStatus,
      status: twilioStatus?.status || aiSession?.status || 'initiating',
      duration: twilioStatus?.duration || (aiSession ? Math.floor((Date.now() - aiSession.startTime) / 1000) : 0),
      transferredToHuman: aiSession?.transferredToHuman || false,
      optedOut: aiSession?.optedOut || false,
      history: aiSession?.history.filter((h) => h.role !== 'system') || [],
    },
  });
});

/**
 * GET /api/calls/twiml/bridge
 * Serves TwiML instruction to Twilio when the human agent answers
 */
router.get('/twiml/bridge', (req: Request, res: Response) => {
  const customer = req.query.customer as string;
  const leadName = (req.query.leadName as string) || 'Customer';

  if (!customer) {
    res.type('text/xml').send('<Response><Say>Error: No customer phone provided.</Say></Response>');
    return;
  }

  const twiml = twilioService.generateBridgeTwiML(customer, leadName);
  res.type('text/xml').send(twiml);
});

/**
 * POST /api/calls/status-webhook
 * Twilio status webhook callbacks
 */
router.post('/status-webhook', (req: Request, res: Response) => {
  const { CallSid, CallStatus, CallDuration, From, To } = req.body;
  console.log('[Twilio Status Callback]', { CallSid, CallStatus, CallDuration, From, To });

  // Map Twilio status to internal status
  let mappedStatus: any = 'initiating';
  if (CallStatus === 'ringing') mappedStatus = 'ringing';
  else if (CallStatus === 'in-progress') mappedStatus = 'connected';
  else if (CallStatus === 'completed') mappedStatus = 'ended';
  else if (CallStatus === 'busy' || CallStatus === 'no-answer') mappedStatus = 'no-answer';
  else if (CallStatus === 'failed' || CallStatus === 'canceled') mappedStatus = 'failed';

  aiVoiceService.updateSessionStatus(CallSid, mappedStatus);

  // Automatically record completed calls into history
  if (CallStatus === 'completed' || CallStatus === 'busy' || CallStatus === 'no-answer') {
    const session = aiVoiceService.getSession(CallSid);
    const durationSec = CallDuration ? parseInt(CallDuration, 10) : 45;

    let outcome = 'Connected & Qualified';
    if (CallStatus === 'no-answer') outcome = 'No Answer';
    else if (CallStatus === 'busy') outcome = 'Busy';
    else if (session?.optedOut) outcome = 'Opted Out';
    else if (session?.transferredToHuman) outcome = 'Transferred to Agent';

    const callRecord = {
      id: `call_${CallSid}`,
      callSid: CallSid,
      leadId: session?.leadId || '',
      leadName: session?.leadName || 'Customer Lead',
      company: 'Direct Telephone Contact',
      phone: To || '',
      direction: 'outbound',
      duration: durationSec,
      outcome,
      notes: `Real Twilio Voice call completed. Outcome: ${outcome}. Turns: ${session?.history.length || 0}.`,
      timestamp: 'Just now',
      hasRecording: true,
      sentiment: session?.optedOut ? 'Hesitant' : 'Positive',
      transcriptSnippet:
        session?.history.filter((h) => h.role !== 'system').map((h) => `${h.role === 'assistant' ? 'AvaniBot' : 'Customer'}: "${h.content}"`).join(' | ') ||
        'Real voice call completed via Twilio carrier line.',
    };

    callHistoryLogs.unshift(callRecord);
  }

  res.status(200).send('<Response/>');
});

/**
 * POST /api/calls/log
 * Persist completed call records from client
 */
router.post('/log', (req: Request, res: Response) => {
  const callRecord = {
    id: `call_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    timestamp: new Date().toISOString(),
    ...req.body,
  };
  callHistoryLogs.unshift(callRecord);
  res.json({ ok: true, data: callRecord });
});

/**
 * GET /api/calls/logs
 * Retrieve all call history logs
 */
router.get('/logs', (req: Request, res: Response) => {
  res.json({ ok: true, data: callHistoryLogs });
});

/**
 * POST /api/calls/send-dtmf
 * Dispatches DTMF tone to carrier or simulation provider
 */
router.post('/send-dtmf', async (req: Request, res: Response) => {
  try {
    const { callSid, digit } = req.body;
    if (!digit) {
      return res.status(400).json({ ok: false, error: 'digit is required.' });
    }

    const result = await twilioService.sendDtmf(callSid, digit);
    res.json({ ok: true, data: result });
  } catch (err: any) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

export default router;
