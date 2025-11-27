import { NextRequest, NextResponse } from "next/server";
import { mollieClient } from "@/lib/mollie";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const paymentId = searchParams.get("id");

    if (!paymentId) {
      return NextResponse.json(
        { error: "ID de paiement manquant" },
        { status: 400 }
      );
    }

    // Vérifier que ce n'est pas le placeholder {id}
    if (paymentId === "{id}") {
      return NextResponse.json(
        { error: "ID de paiement est un placeholder, utilisez l'ID réel" },
        { status: 400 }
      );
    }

    // Vérifier le format de l'ID
    if (!paymentId.startsWith("tr_")) {
      return NextResponse.json(
        { error: "Format d'ID de paiement invalide" },
        { status: 400 }
      );
    }

    // Récupérer le paiement depuis Mollie
    const payment = await mollieClient.payments.get(paymentId);

    return NextResponse.json({
      id: payment.id,
      status: payment.status,
      amount: {
        value: payment.amount.value,
        currency: payment.amount.currency,
      },
      description: payment.description,
      paidAt: payment.paidAt || undefined,
    });
  } catch (error: any) {
    console.error("❌ Erreur lors de la récupération du paiement:", error);

    // Gérer les erreurs 404 de Mollie
    if (error.statusCode === 404) {
      return NextResponse.json(
        { error: "Paiement non trouvé" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Erreur lors de la récupération du statut",
      },
      { status: 500 }
    );
  }
}
