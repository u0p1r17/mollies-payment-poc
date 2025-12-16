import { syncronizePaymentsWithMollie } from "@/lib/server-actions";
import { NextResponse } from "next/server";

export async function GET() {
  await syncronizePaymentsWithMollie();
  return new NextResponse();
}
