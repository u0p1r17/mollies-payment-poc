
import { addToDB } from "@/lib/server-actions";

export async function POST(request: Request) {
  try {
    // Parse the incoming webhook payload and log it
    const payload = await request.text();
    console.log("Received webhook payload:", payload);
    // Every time a webhook comes in, we revalidate the /payments page
    // revalidatePath('/payments');

    await addToDB(payload);
    return new Response("Webhook successfully received", {
      status: 200,
    });
  } catch (error: any) {
    return new Response(`Webhook error: ${error.message}`, {
      status: 403,
    });
  }
}
