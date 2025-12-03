import createMollieClient, {
  Locale,
  Payment,
  PaymentMethod,
} from "@mollie/api-client";
import { CreatePaymentParams } from "./types";

const apiKey = process.env.MOLLIE_API_KEY;
const domain = process.env.DOMAIN || "http://localhost:3000";
const webhookUrl = process.env.WEBHOOK_URL || "http://not.provided";

if (!apiKey) {
  throw new Error("MOLLIE_API_KEY is not defined");
}

// Set up Mollie API client
export const mollieClient = createMollieClient({ apiKey: apiKey });

// translate countries to locales
const countryToLocale: Record<string, Locale> = {
  DE: Locale.de_DE,
  AT: Locale.de_AT,
  NL: Locale.nl_NL,
  FR: Locale.fr_FR,
  UK: Locale.en_US,
  SE: Locale.sv_SE,
  PT: Locale.pt_PT,
  IT: Locale.it_IT,
  CH: Locale.de_CH,
  ES: Locale.es_ES,
  BEFR: Locale.fr_BE,
  BENL: Locale.fr_BE,
};

// function to get the locale for a given country
function getLocaleForCountry(country: string): Locale {
  let locale = countryToLocale[country];
  if (!locale) {
    locale = Locale.fr_BE; // default to French (Belgium) if country is not found
  }
  return locale;
}

// Create a payment using data gathered from the checkout form
export async function mollieCreatePayment({
  amount,
  firstname,
  lastname,
  company,
  address,
  email,
  zipCode,
  city,
  country,
  metadata,
}: CreatePaymentParams) {
  // Note: We allow beta payment methods to be sent to the API
  // The Mollie API will handle validation and return appropriate errors if needed
  // This allows testing of beta payment methods that aren't in the TypeScript client yet

  // set up the actual payment with mollie library
  const payment: Payment = await mollieClient.payments.create({
    amount: {
      currency: "EUR",
      value: amount,
    },
    billingAddress: {
      givenName: firstname,
      familyName: lastname,
      organizationName: company,
      streetAndNumber: address,
      postalCode: zipCode,
      city: city,
      country: country,
      email: email,
    },
    metadata: {
      internal_payment_id: "mollie-next-" + Date.now(),
      ...metadata,
    },
    description: "Demo payment from " + firstname,
    redirectUrl: domain + "/",
    cancelUrl: domain,
    webhookUrl: webhookUrl,
    method: PaymentMethod.bancontact,
    locale: getLocaleForCountry(country),
  });
  const redirectUrl = payment.getCheckoutUrl();
  return redirectUrl;
}
export async function mollieGetPayments() {
    const payments = await mollieClient.payments.page();
    return payments;
}
