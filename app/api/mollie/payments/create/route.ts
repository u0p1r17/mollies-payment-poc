import { mollieCreatePayment } from "@/lib/mollie";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const rqst = await request.json();
  const { checkoutUrl, paymentId } = await mollieCreatePayment(rqst);
  return new NextResponse(JSON.stringify({ url: checkoutUrl, paymentId }));
}
