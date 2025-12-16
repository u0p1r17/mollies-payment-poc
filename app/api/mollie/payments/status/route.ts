import { mollieGetPayment } from "@/lib/mollie";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const paymentId = searchParams.get("id");

  if (!paymentId) {
    return NextResponse.json(
      { error: "Payment ID is required" },
      { status: 400 }
    );
  }

  try {
    const payment = await mollieGetPayment(paymentId);

    return NextResponse.json({
      id: payment.id,
      status: payment.status,
      amount: payment.amount,
      description: payment.description,
      createdAt: payment.createdAt,
      paidAt: payment.paidAt,
    });
  } catch (error) {
    console.error("Error fetching payment status:", error);
    return NextResponse.json(
      { error: "Failed to fetch payment status" },
      { status: 500 }
    );
  }
}
