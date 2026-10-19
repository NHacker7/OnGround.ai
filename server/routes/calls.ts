import { Router, Request, Response } from 'express';
import { twilioService } from '../services/twilioService.js';

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
 * Initiate genuine AI Voice Call
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
  console.log('[Twilio Webhook] Call Status Event:', {
    CallSid: req.body.CallSid,
    CallStatus: req.body.CallStatus,
    Duration: req.body.CallDuration,
    From: req.body.From,
    To: req.body.To,
  });

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

export default router;
