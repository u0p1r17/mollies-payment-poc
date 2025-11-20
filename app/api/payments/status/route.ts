import { NextRequest, NextResponse } from 'next/server';
import { mollieClient } from '@/lib/mollie';
import type { PaymentStatusResponse } from '@/types/mollie';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const paymentId = searchParams.get('id');

    if (!paymentId) {
      return NextResponse.json(
        { error: 'ID de paiement manquant' },
        { status: 400 }
      );
    }

    // Vérifier que l'ID n'est pas le placeholder
    if (paymentId === '{id}') {
      return NextResponse.json(
        {
          error: 'ID de paiement invalide. Utilisez un vrai ID de paiement (ex: tr_xxxxx)',
          hint: 'Le {id} est un placeholder remplacé automatiquement par Mollie lors de la redirection.'
        },
        { status: 400 }
      );
    }

    // Vérifier le format de l'ID Mollie (commence par tr_)
    if (!paymentId.startsWith('tr_')) {
      return NextResponse.json(
        { error: 'Format d\'ID de paiement invalide. L\'ID doit commencer par "tr_"' },
        { status: 400 }
      );
    }

    // Récupérer le statut du paiement depuis Mollie
    const payment = await mollieClient.payments.get(paymentId);

    const response: PaymentStatusResponse = {
      id: payment.id,
      status: payment.status,
      amount: {
        value: payment.amount.value,
        currency: payment.amount.currency,
      },
      description: payment.description,
      paidAt: payment.paidAt || undefined,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Erreur lors de la récupération du statut:', error);

    // Gestion d'erreur plus spécifique pour Mollie
    if (error && typeof error === 'object' && 'statusCode' in error && error.statusCode === 404) {
      return NextResponse.json(
        { error: 'Paiement introuvable. Vérifiez l\'ID du paiement.' },
        { status: 404 }
      );
    }

    const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
    return NextResponse.json(
      {
        error: 'Erreur lors de la récupération du statut du paiement',
        details: errorMessage
      },
      { status: 500 }
    );
  }
}
