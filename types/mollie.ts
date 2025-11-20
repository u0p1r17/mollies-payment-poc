import { PaymentStatus } from '@mollie/api-client';

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
