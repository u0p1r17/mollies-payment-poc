import { revalidatePath } from 'next/cache';

export async function POST(request: Request) {
    try {
        // Parse the incoming webhook payload and log it
        const payload = await request.text();
        console.log('Received webhook payload:', payload);
        // Every time a webhook comes in, we revalidate the /payments page
        revalidatePath('/payments');
        return new Response('Webhook successfully received', {
            status: 200,
        });
    } catch (error: unknown) {
        return new Response(`Webhook error: ${error instanceof Error ? error.message : 'Unknown error'}`, {
            status: 403,
        });
    }
}
