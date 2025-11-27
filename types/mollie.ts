import type { Locale, PaymentStatus } from '@mollie/api-client';

export interface PaymentRequest {
  amount: number;
  description: string;
  customerEmail?: string;
  customerName?: string;
}

export interface PaymentResponse {
  id: string;
  status: PaymentStatus;
  checkoutUrl: string;
  amount: {
    value: string;
    currency: string;
  };
}

export interface PaymentStatusResponse {
  id: string;
  status: PaymentStatus;
  amount: {
    value: string;
    currency: string;
  };
  description: string;
  paidAt?: string;
}

const countryToLocale: Record<string, Locale> = {
    DE: Locale.de_DE,
    AT: Locale.de_AT,
    NL: Locale.nl_NL,
    FR: Locale.fr_FR,
    BE: Locale.fr_BE,
    UK: Locale.en_US,
    SE: Locale.sv_SE,
    PT: Locale.pt_PT,
    IT: Locale.it_IT,
    CH: Locale.de_CH,
    ES: Locale.es_ES,
};

function getLocaleForCountry(country: string): Locale {
    let locale = countryToLocale[country];
    if (!locale) {
        locale = Locale.fr_BE;
    }
    return locale;
}

// export async function mollieCreatePayment({
//     firstname,
//     lastname,
//     company,
//     email,
//     address,
//     city,
//     zip_code,
//     country,
//     payment_method,
//     cardToken,
//     captureMode,
//     currency,
//     officeId,
// }: CreatePaymentParams) {
//     const payment: Payment = await mollieClient.payments.create({
//         amount: {
//             currency: currency,
//             value: '220.00',
//         },
//         billingAddress: {
//             givenName: firstname,
//             familyName: lastname,
//             organizationName: company,
//             streetAndNumber: address,
//             postalCode: zip_code,
//             city: city,
//             country: country,
//             email: email,
//         },
//         metadata: {
//             officeId: officeId,
//             internal_payment_id: 'mollie-next-' + Date.now(),
//         },
//         lines: [
//             {
//                 description: 'An expensive product',
//                 quantity: 1,
//                 unitPrice: {
//                     currency: currency,
//                     value: '200.00',
//                 },
//                 totalAmount: {
//                     currency: currency,
//                     value: '200.00',
//                 },
//             },
//             {
//                 description: 'A cheap product',
//                 quantity: 1,
//                 unitPrice: {
//                     currency: currency,
//                     value: '10.00',
//                 },
//                 totalAmount: {
//                     currency: currency,
//                     value: '10.00',
//                 },
//                 // categories for voucher payments
//                 categories: [PaymentLineCategory.gift, PaymentLineCategory.eco],
//             },
//             {
//                 description: 'Another cheap product',
//                 quantity: 1,
//                 unitPrice: {
//                     currency: currency,
//                     value: '10.00',
//                 },
//                 totalAmount: {
//                     currency: currency,
//                     value: '10.00',
//                 },
//                 // categories for voucher payments
//                 categories: [PaymentLineCategory.gift, PaymentLineCategory.eco],
//             },
//         ],
//         description: 'Demo payment from ' + firstname,
//         redirectUrl: domain + '/success',
//         cancelUrl: domain,
//         webhookUrl: webhookUrl,
//         method: payment_method,
//         cardToken: cardToken,
//         captureMode: captureMode,
//         locale: getLocaleForCountry(country),
//     });
//     const redirectUrl = payment.getCheckoutUrl();
//     return redirectUrl;
// }
