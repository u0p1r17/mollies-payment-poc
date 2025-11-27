import { CaptureMethod, PaymentMethod } from "@mollie/api-client";
import z from "zod";
import { EnumPaymentMethod } from "./server-actions";

export async function validateFormData(formData: FormData) {
  const form = Object.fromEntries(formData.entries());

  const formSchema = z.object({
    firstname: z
      .string()
      .min(1, { error: "Must be at lest 1 character long," }),
    lastname: z.string().min(1, { error: "Must be at lest 1 character long," }),
    company: z.string().optional(),
    email: z.email({ error: "Must Be valid email adress." }),
    address: z
      .string()
      .min(1, { message: "Must be at least 1 character long." }),
    city: z.string().min(1, { message: "Must be at least 1 character long." }),
    zip_code: z
      .string()
      .min(1, { message: "Must be at least 1 character long." }),
    country: z.string().toUpperCase().length(2),
    payment_method: EnumPaymentMethod,
    cardToken: z.string().startsWith("tkn_").optional(),
    captureMode: z.nativeEnum(CaptureMethod).optional(),
    currency: z.string().length(3),
    officeId: z.string().optional(),
  });

  return formSchema.parse(form);
}

export async function validateUrl(url: string) {
    const urlSchema = z.url();
    try {
        const result = urlSchema.parse(url);
        return result;
    } catch (error) {
        throw new Error(`No valid URL.`);
    }
}
