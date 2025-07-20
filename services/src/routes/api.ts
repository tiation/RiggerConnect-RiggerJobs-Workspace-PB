import express from 'express';
import { AuthenticationService } from '../services/auth/auth.service';
import { JobService } from '../services/jobs/job.service';
import { PaymentService } from '../services/payments/payment.service';
import { authenticateToken } from '../middleware/auth';
import { handleError } from '../lib/errors';
import { validateRequest } from '../middleware/validation';
import { z } from 'zod';

const router = express.Router();
const authService = new AuthenticationService();
const jobService = new JobService();
const paymentService = new PaymentService();

// Auth routes
router.post(
  '/auth/login',
  validateRequest({
    body: z.object({
      email: z.string().email(),
      password: z.string(),
    }),
  }),
  async (req, res) => {
    try {
      const result = await authService.authenticateUser(
        req.body.email,
        req.body.password
      );

      if (!result) {
        res.status(401).json({
          success: false,
          error: {
            code: 'INVALID_CREDENTIALS',
            message: 'Invalid email or password',
          },
        });
        return;
      }

      res.json({ success: true, data: result });
    } catch (error) {
      const handledError = handleError(error);
      res.status(handledError.statusCode).json({
        success: false,
        error: {
          code: handledError.code,
          message: handledError.message,
        },
      });
    }
  }
);

// Job routes
router.post(
  '/jobs',
  authenticateToken,
  validateRequest({
    body: z.object({
      title: z.string(),
      description: z.string(),
      location: z.string(),
      rate: z.number(),
      employerId: z.string(),
    }),
  }),
  async (req, res) => {
    try {
      const job = await jobService.createJob(req.body);
      res.json({ success: true, data: job });
    } catch (error) {
      const handledError = handleError(error);
      res.status(handledError.statusCode).json({
        success: false,
        error: {
          code: handledError.code,
          message: handledError.message,
        },
      });
    }
  }
);

router.get('/jobs', authenticateToken, async (req, res) => {
  try {
    const { status, employerId, page, limit } = req.query;
    const result = await jobService.listJobs({
      status: status as any,
      employerId: employerId as string,
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
    });
    res.json({ success: true, data: result });
  } catch (error) {
    const handledError = handleError(error);
    res.status(handledError.statusCode).json({
      success: false,
      error: {
        code: handledError.code,
        message: handledError.message,
      },
    });
  }
});

// Payment routes
router.post(
  '/payments/intent',
  authenticateToken,
  validateRequest({
    body: z.object({
      jobId: z.string(),
      amount: z.number(),
      currency: z.string().optional(),
    }),
  }),
  async (req, res) => {
    try {
      const result = await paymentService.createPaymentIntent(req.body);
      res.json({ success: true, data: result });
    } catch (error) {
      const handledError = handleError(error);
      res.status(handledError.statusCode).json({
        success: false,
        error: {
          code: handledError.code,
          message: handledError.message,
        },
      });
    }
  }
);

router.post('/payments/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];

  try {
    const event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      config.STRIPE_WEBHOOK_SECRET
    );

    await paymentService.handleStripeWebhook(event);
    res.json({ received: true });
  } catch (error) {
    const handledError = handleError(error);
    res.status(handledError.statusCode).json({
      success: false,
      error: {
        code: handledError.code,
        message: handledError.message,
      },
    });
  }
});

export default router;
