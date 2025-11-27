import { CaptureMethod, PaymentMethod } from "@mollie/api-client";
import { validateFormData, validateUrl } from "./validation";
// import { mollieCreatePayment } from "@/types/mollie";
import z from "zod";
import { redirect } from "next/navigation";

export const EnumPaymentMethod = z.enum([
  ...Object.values(PaymentMethod),
] as const);

export type EnumPaymentMethodType = z.infer<typeof EnumPaymentMethod>;

export async function createPayment(formData: FormData) {
  const validatedForm: {
    firstname: string;
    lastname: string;
    company?: string;
    email: string;
    address: string;
    city: string;
    zip_code: string;
    country: string;
    payment_method: EnumPaymentMethodType;
    cardToken?: string;
    captureMode?: CaptureMethod;
    currency: string;
    officeId?: string;
  } = await validateFormData(formData);

  // const mollieRedirectUrl: string | null = await mollieCreatePayment(
  //   validatedForm
  // );
  
  // if (!mollieRedirectUrl) {
  //   throw new Error("Failed to create Mollie payment");
  // }

  // const validatedRedirectUrl = await validateUrl(mollieRedirectUrl);

  // redirect(validatedRedirectUrl);
}
