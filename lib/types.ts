import { CaptureMethod, PaymentMethod } from "@mollie/api-client";
import z from "zod";

export type MollieComponent = {
  mount: (selector: string) => void;
  unmount: () => void;
  addEventListener: (event: string, callback: (event: unknown) => void) => void;
};

export type MollieInstance = {
  createComponent: (
    type: string,
    options?: Record<string, unknown>
  ) => MollieComponent;
  createToken: () => Promise<{ token: string; error?: string }>;
};

export interface MollieContextType {
  mollie: MollieInstance | null;
}

export const ExtendedPaymentMethod = z.enum([
  ...Object.values(PaymentMethod),
  // Add beta payment methods here for testing
] as const);

export type ExtendedPaymentMethodType = z.infer<typeof ExtendedPaymentMethod>;

export interface Metadata {
  officeId: string;
  tenantId: string;
  productId: string;
}

export type NullableMetatdata = {
  [K in keyof Metadata]: Metadata[K] | null;
};

export type CreatePaymentParams = {
  amount: string;
  firstname: string;
  lastname: string;
  company?: string;
  address: string;
  zipCode: string;
  city: string;
  country: string;
  email: string;
  metadata: Metadata;
};

export type NullableCreatePaymentParams = {
  amount: string | null;
  firstname: string | null;
  lastname: string | null;
  company?: string | null;
  address: string | null;
  zipCode: string | null;
  city: string | null;
  country: string | null;
  email: string | null;
  metadata: NullableMetatdata;
};
export type CreateFormPayment = Omit<
  CreatePaymentParams,
  "currency" | "description" | "payment_method" | "captureMode"
>;

// export interface CreateFormPayment {
  //   amount: string;
  //   description: string;
//   firstname: string;
//   lastname: string;
//   email: string;
//   address: string;
//   city: string;
//   zipCode: string;
//   country: string;
//   payment_method: PaymentMethod.banktransfer;
//   currency: string;
//   company?: string;
//   captureMode?: CaptureMethod;
//   metadata: Metadata;
// }

export type NullableCreateFormPayment = Omit<
  NullableCreatePaymentParams,
  "currency" | "description" | "payment_method" | "captureMode"
>;

// export interface NullableCreateFormPayment {
  //   amount: string | null;
//   description: string | null;
//   firstname: string | null;
//   lastname: string | null;
//   company?: string | null;
//   email: string | null;
//   address: string | null;
//   city: string | null;
//   zipCode: string | null;
//   country: string | null;
//   payment_method: PaymentMethod | null;
//   captureMode?: CaptureMethod | null;
//   currency: string | null;
//   metadata: NullableMetatdata;
// }
