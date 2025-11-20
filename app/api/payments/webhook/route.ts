import { NextRequest, NextResponse } from 'next/server';
import { mollieClient } from '@/lib/mollie';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const paymentId = body.id;

    if (!paymentId) {
      return NextResponse.json(
        { error: 'ID de paiement manquant' },
        { status: 400 }
      );
    }

    // Vérifier le statut du paiement
    const payment = await mollieClient.payments.get(paymentId);

    console.log('Webhook reçu pour le paiement:', {
      id: payment.id,
      status: payment.status,
      amount: payment.amount,
      description: payment.description,
      paidAt: payment.paidAt,
      metadata: payment.metadata,
    });

    // Ici, vous pouvez ajouter votre logique business:
    // - Mettre à jour votre base de données
    // - Envoyer un email de confirmation
    // - Déclencher la livraison du produit/service
    // - etc.

    switch (payment.status) {
      case 'paid':
        console.log('✅ Paiement confirmé:', payment.id);
        // Traiter la commande
        break;
      case 'failed':
        console.log('❌ Paiement échoué:', payment.id);
        // Gérer l'échec
        break;
      case 'canceled':
        console.log('🚫 Paiement annulé:', payment.id);
        // Gérer l'annulation
        break;
      case 'expired':
        console.log('⏰ Paiement expiré:', payment.id);
        // Gérer l'expiration
        break;
      default:
        console.log('ℹ️ Statut du paiement:', payment.status);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Erreur lors du traitement du webhook:', error);
    return NextResponse.json(
      { error: 'Erreur lors du traitement du webhook' },
      { status: 500 }
    );
  }
}
