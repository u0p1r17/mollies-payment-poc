import { PaymentMethod } from "@mollie/api-client";
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

export type NullableCreateFormPayment = Omit<
  NullableCreatePaymentParams,
  "currency" | "description" | "payment_method" | "captureMode"
>;

import type { PaymentStatus } from '@mollie/api-client';

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

