import { mollieClient } from "@/lib/mollie";
import { updatePaymentFromDB } from "@/lib/server-actions";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const textBody = await req.text();
  const params = new URLSearchParams(textBody);
  const paymentId = params.get("id");

  console.log("Mollie webhook received for payment ID:");
  if (!paymentId) {
    return new NextResponse(null, { status: 200 });
  }

  try {
    const payment = await mollieClient.payments.get(paymentId);

    updatePaymentFromDB(payment);

    return new NextResponse(null, { status: 200 });
  } catch (error) {
    console.error("Mollie webhook error:", error);
    return new NextResponse(null, { status: 200 });
  }
}
