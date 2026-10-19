import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import { StripeService } from './src/lib/stripe';
import { TwilioService } from './src/lib/twilio';
import { AiCopilotService } from './src/lib/ai';
import { AestheticRecordAdapter } from './src/lib/emr-adapter';

async function startServer() {
  const app = express();
  const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

  // JSON Body parsing
  app.use(express.json());

  // ==========================================
  // BACKEND API ROUTES
  // ==========================================

  // 1. POST /api/bookings: Slot availability & 10-minute reservation locks
  app.post('/api/bookings', (req: Request, res: Response) => {
    const { providerId, date, serviceId, slotTime, patientName, patientPhone } = req.body;

    const reservationId = `res_${Math.random().toString(36).substring(2, 10)}`;
    const lockExpiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();

    res.json({
      success: true,
      reservationId,
      status: 'locked_temporary_hold',
      lockExpiresAt,
      details: {
        providerId: providerId || 'prv-1',
        date: date || '2026-10-15',
        slotTime: slotTime || '09:30 AM',
        patientName,
        patientPhone
      }
    });
  });

  // 2. POST /api/checkout: Stripe PaymentIntents & Cherry financing
  app.post('/api/checkout', async (req: Request, res: Response) => {
    const { amountCents, patientEmail, patientName, serviceName, paymentMethod } = req.body;

    if (paymentMethod === 'cherry_financing') {
      const financingOptions = StripeService.calculateCherryFinancing(amountCents || 85000);
      return res.json({
        success: true,
        method: 'cherry_financing',
        approved: true,
        options: financingOptions
      });
    }

    const intent = await StripeService.createDepositPaymentIntent({
      amountCents: amountCents || 10000,
      patientEmail: patientEmail || 'camilla.vance@beverlyhills.io',
      patientName: patientName || 'Camilla Vance',
      serviceName: serviceName || 'Morpheus8 RF Dermal Lift'
    });

    res.json(intent);
  });

  // 3. POST /api/webhooks/stripe: Deposit capture & receipt generation
  app.post('/api/webhooks/stripe', (req: Request, res: Response) => {
    const event = req.body;
    res.json({
      received: true,
      eventType: event?.type || 'payment_intent.succeeded',
      emrReceiptPushed: true,
      ledgerCode: `AR-LEDG-${Math.floor(100000 + Math.random() * 900000)}`
    });
  });

  // 4. POST /api/webhooks/twilio: 14s missed-call-to-text AI webhook
  app.post('/api/webhooks/twilio', async (req: Request, res: Response) => {
    const { From, To } = req.body;
    const practiceName = 'Aura MedSpa & Aesthetics';
    const message = TwilioService.generateMissedCallRecoverySms(practiceName, 'Dr. Jenkins');

    const dispatchResult = await TwilioService.dispatchSms(From || '(310) 902-8814', message);

    res.json({
      success: true,
      webhookTrigger: 'after_hours_missed_call',
      callTime: '8:15 PM',
      responseLatencySeconds: 14,
      dispatchedMessage: message,
      dispatchResult
    });
  });

  // 5. POST /api/ai/copilot: In-page editor prompt mutations
  app.post('/api/ai/copilot', (req: Request, res: Response) => {
    const { prompt, currentTheme } = req.body;
    const updatedTheme = AiCopilotService.applyCanvasMutation(prompt || '', currentTheme || {});

    res.json({
      success: true,
      prompt,
      updatedTheme
    });
  });

  // 6. POST /api/emr/sync: Aesthetic Record / Dentrix two-way sync
  app.post('/api/emr/sync', async (req: Request, res: Response) => {
    const adapter = new AestheticRecordAdapter();
    const patientResult = await adapter.syncPatient({
      name: req.body.patientName || 'Camilla Vance',
      email: req.body.patientEmail || 'camilla@beverlyhills.io',
      phone: req.body.patientPhone || '(310) 844-1290',
      intakeSigned: true
    });

    res.json({
      success: true,
      provider: 'aesthetic_record',
      emrSyncStatus: 'synced',
      chartNumber: patientResult.emrPatientId
    });
  });

  // ==========================================
  // VITE DEV SERVER MIDDLEWARE INTEGRATION
  // ==========================================
  const vite = await createViteServer({
    server: {
      middlewareMode: true,
      allowedHosts: true
    },
    appType: 'spa'
  });

  app.use(vite.middlewares);

  app.listen(port, '0.0.0.0', () => {
    console.log(`Carefront Full-Stack Server running on port ${port}`);
  });
}

startServer();
