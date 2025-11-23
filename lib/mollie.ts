import { createMollieClient } from '@mollie/api-client';

if (!process.env.MOLLIE_API_KEY) {
  throw new Error('MOLLIE_API_KEY is not defined in environment variables');
}

// Initialiser le client Mollie
export const mollieClient = createMollieClient({
  apiKey: process.env.MOLLIE_API_KEY,
});


