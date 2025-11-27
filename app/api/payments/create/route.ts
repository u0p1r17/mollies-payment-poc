import { NextRequest, NextResponse } from "next/server";
import { mollieClient } from "@/lib/mollie";
import { PaymentMethod } from "@mollie/api-client";
import { getBaseUrl } from "@/lib/url";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      amount,
      description,
      firstname,
      lastname,
      email,
      address,
      city,
      zipCode,
      country,
      cardToken,
    } = body;

    // Validation basique
    const parsedAmount = Number.parseFloat(String(amount));

    if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      return NextResponse.json(
        { error: "Le montant doit être supérieur à 0" },
        { status: 400 }
      );
    }

    // Limiter l'exposition du backend : montant max 10 000 € pour éviter les abus.
    if (parsedAmount > 10000) {
      return NextResponse.json(
        { error: "Montant trop élevé" },
        { status: 400 }
      );
    }

    if (!description) {
      return NextResponse.json(
        { error: "La description est requise" },
        { status: 400 }
      );
    }

    if (!cardToken || !cardToken.startsWith("tkn_")) {
      return NextResponse.json(
        { error: "Token de carte invalide" },
        { status: 400 }
      );
    }

    const baseUrl = getBaseUrl();

    // Créer le paiement avec Mollie
    const payment = await mollieClient.payments.create({
      amount: {
        currency: "EUR",
        value: parsedAmount.toFixed(2),
      },
      description: description,
      billingAddress: {
        givenName: firstname,
        familyName: lastname,
        email: email,
        streetAndNumber: address,
        city: city,
        postalCode: zipCode,
        country: country,
      },
      cardToken: cardToken,
      method: PaymentMethod.creditcard,
      redirectUrl: `${baseUrl}/payment/status`,
      webhookUrl: `${baseUrl}/api/payments/webhook`,
    });

    console.log("✅ Paiement créé:", payment.id);

    return NextResponse.json({
      id: payment.id,
      status: payment.status,
      amount: {
        value: payment.amount.value,
        currency: payment.amount.currency,
      },
      checkoutUrl: payment._links?.checkout?.href ?? null,
    });
  } catch (error) {
    console.error("❌ Erreur lors de la création du paiement:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Erreur lors de la création du paiement",
      },
      { status: 500 }
    );
  }
}
