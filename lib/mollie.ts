import createMollieClient, {
  Locale,
  Payment,
  PaymentMethod,
} from "@mollie/api-client";
import { CreatePaymentParams } from "./types";

const apiKey = process.env.MOLLIE_API_KEY;
const domain = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
const webhookUrl = process.env.NEXT_PUBLIC_MOLLIE_WEBHOOK || "http://not.provided";

if (!apiKey) {
  throw new Error("MOLLIE_API_KEY is not defined");
}

export const mollieClient = createMollieClient({ apiKey: apiKey });

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

function getLocaleForCountry(country: string): Locale {
  let locale = countryToLocale[country];
  if (!locale) {
    locale = Locale.fr_BE;
  }
  return locale;
}

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
export async function mollieGetAllPayments() {
  const payments = await mollieClient.payments.page();
  return payments;
}
export async function mollieGetPayment(id: string) {
  const payment = await mollieClient.payments.get(id);
  return payment;
}
