import { Payment, PaymentSchema } from '@riggerhireapp/shared';
import { prisma } from '../../lib/prisma';
import { NotFoundError, ValidationError } from '../../lib/errors';
import Stripe from 'stripe';
import config from '../../config/service.config';

const stripe = new Stripe(config.STRIPE_SECRET_KEY, {
  apiVersion: '2023-08-16',
});

export class PaymentService {
  public async createPaymentIntent(params: {
    jobId: string;
    amount: number;
    currency?: string;
  }): Promise<{
    clientSecret: string;
    payment: Payment;
  }> {
    const { jobId, amount, currency = 'aud' } = params;

    const job = await prisma.job.findUnique({
      where: { id: jobId },
      include: { employer: true },
    });

    if (!job) {
      throw new NotFoundError('Job not found');
    }

    if (job.status !== 'COMPLETED') {
      throw new ValidationError('Can only process payment for completed jobs');
    }

    // Create Stripe PaymentIntent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency,
      metadata: {
        jobId,
        employerId: job.employerId,
      },
      payment_method_types: ['card'],
    });

    // Create payment record
    const payment = await prisma.payment.create({
      data: {
        jobId,
        amount,
        status: 'PENDING',
        stripePaymentId: paymentIntent.id,
      },
    });

    return {
      clientSecret: paymentIntent.client_secret!,
      payment: PaymentSchema.parse(payment),
    };
  }

  public async handleStripeWebhook(
    event: Stripe.Event
  ): Promise<void> {
    switch (event.type) {
      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        await this.handlePaymentSuccess(paymentIntent);
        break;
      }
      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        await this.handlePaymentFailure(paymentIntent);
        break;
      }
    }
  }

  private async handlePaymentSuccess(
    paymentIntent: Stripe.PaymentIntent
  ): Promise<void> {
    const payment = await prisma.payment.findFirst({
      where: { stripePaymentId: paymentIntent.id },
    });

    if (!payment) {
      throw new NotFoundError('Payment not found');
    }

    await prisma.payment.update({
      where: { id: payment.id },
      data: { status: 'COMPLETED' },
    });

    // Additional business logic here (e.g., notifications, commissions)
  }

  private async handlePaymentFailure(
    paymentIntent: Stripe.PaymentIntent
  ): Promise<void> {
    const payment = await prisma.payment.findFirst({
      where: { stripePaymentId: paymentIntent.id },
    });

    if (!payment) {
      throw new NotFoundError('Payment not found');
    }

    await prisma.payment.update({
      where: { id: payment.id },
      data: { status: 'FAILED' },
    });

    // Additional failure handling logic here
  }

  public async getPayment(paymentId: string): Promise<Payment> {
    const payment = await prisma.payment.findUnique({
      where: { id: paymentId },
    });

    if (!payment) {
      throw new NotFoundError('Payment not found');
    }

    return PaymentSchema.parse(payment);
  }

  public async listPayments(params: {
    jobId?: string;
    status?: 'PENDING' | 'COMPLETED' | 'FAILED';
    page?: number;
    limit?: number;
  }): Promise<{ payments: Payment[]; total: number }> {
    const { jobId, status, page = 1, limit = 10 } = params;

    const where = {
      ...(jobId && { jobId }),
      ...(status && { status }),
    };

    const [payments, total] = await Promise.all([
      prisma.payment.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.payment.count({ where }),
    ]);

    return {
      payments: payments.map(payment => PaymentSchema.parse(payment)),
      total,
    };
  }
}
