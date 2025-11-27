import { CaptureMethod, PaymentMethod } from "@mollie/api-client";

export type MollieComponent = {
  mount: (selector: string) => void;
  unmount: () => void;
  addEventListener: (event: string, callback: (event: any) => void) => void;
};

export type MollieInstance = {
  createComponent: (type: string) => MollieComponent;
  createToken: () => Promise<{ token: string; error?: string }>;
};

export interface MollieContextType {
  mollie: MollieInstance | null;
}

export type CreatePaymentParams = {
  firstname: string;
  lastname: string;
  company?: string;
  email: string;
  address: string;
  city: string;
  zip_code: string;
  country: string;
  payment_method: PaymentMethod;
  cardToken?: string;
  captureMode?: CaptureMethod;
  currency: string;
  officeId?: string;
};
