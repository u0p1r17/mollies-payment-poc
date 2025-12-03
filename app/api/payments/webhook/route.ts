import { NextResponse } from "next/server";
import { mollieClient } from "@/lib/mollie";

/**
 * Webhook appelé par Mollie pour notifier les changements de statut de paiement.
 * Mollie envoie un body form-encoded: id=tr_xxx
 */
export async function POST(request: Request) {
  return request
  // try {
  //   const bodyText = await request.text();
  //   const params = new URLSearchParams(bodyText);
  //   const paymentId = params.get("id");

  //   if (!paymentId) {
  //     return NextResponse.json(
  //       { error: "Webhook reçu sans ID de paiement" },
  //       { status: 400 }
  //     );
  //   }

  //   const payment = await mollieClient.payments.get(paymentId);
  //   console.log(
  //     `🔔 Webhook Mollie reçu pour ${payment.id} - statut: ${payment.status}`
  //   );

  //   // TODO: Persister le statut en BDD / déclencher votre logique métier ici

  //   return NextResponse.json(
  //     { id: payment.id, status: payment.status },
  //     { status: 200 }
  //   );
  // } catch (error) {
  //   console.error("❌ Erreur webhook Mollie:", error);
  //   return NextResponse.json(
  //     { error: "Erreur lors du traitement du webhook" },
  //     { status: 500 }
  //   );
  // }
}

// Jean Neymar
// 5169 2010 9191 7534
// 2223 0000 1047 9399
// 12/28
// 123