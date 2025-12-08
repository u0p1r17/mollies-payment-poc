import { mollieCreatePayment } from "@/lib/mollie";
import { NextRequest } from "next/server"

export async function POST(request: NextRequest){
  const rqst = await request.json();
  const mollieRedirectUrl = await mollieCreatePayment(rqst) 
  return new Response(JSON.stringify({url: mollieRedirectUrl}));
}