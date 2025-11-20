import { NextRequest, NextResponse } from 'next/server';
import { mollieClient } from '@/lib/mollie';
import type { PaymentRequest, PaymentResponse } from '@/types/mollie';
import type { PaymentCreateParams } from '@mollie/api-client';

export async function POST(request: NextRequest) {
  try {
    const body: PaymentRequest = await request.json();

    const { amount, description, customerEmail, customerName } = body;

    // Validation
    if (!amount || amount <= 0) {
      return NextResponse.json(
        { error: 'Le montant doit être supérieur à 0' },
        { status: 400 }
      );
    }

    if (!description) {
      return NextResponse.json(
        { error: 'La description est requise' },
        { status: 400 }
      );
    }

    // Créer le paiement Mollie
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const isLocalhost = baseUrl.includes('localhost') || baseUrl.includes('127.0.0.1');

    const paymentData: PaymentCreateParams = {
      amount: {
        currency: 'EUR',
        value: amount.toFixed(2),
      },
      description,
      redirectUrl: `${baseUrl}/payment/status?id={id}`,
      metadata: {
        customerEmail: customerEmail || '',
        customerName: customerName || '',
      },
    };

    // Only add webhook in production (not on localhost)
    if (!isLocalhost) {
      paymentData.webhookUrl = `${baseUrl}/api/payments/webhook`;
    }

    const payment = await mollieClient.payments.create(paymentData);

    // Debug: afficher les détails du paiement
    console.log('Payment créé:', {
      id: payment.id,
      status: payment.status,
      checkoutUrl: payment.getCheckoutUrl(),
      _links: payment._links
    });

    const checkoutUrl = payment.getCheckoutUrl();
    if (!checkoutUrl) {
      console.error('❌ Pas de checkout URL dans la réponse Mollie!');
      console.error('Payment object:', JSON.stringify(payment, null, 2));
    }

    const response: PaymentResponse = {
      id: payment.id,
      status: payment.status,
      checkoutUrl: checkoutUrl || '',
      amount: {
        value: payment.amount.value,
        currency: payment.amount.currency,
      },
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Erreur lors de la création du paiement:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la création du paiement' },
      { status: 500 }
    );
  }
}
