import z from "zod";

export async function validateFormData(formData: FormData) {
  const form = Object.fromEntries(formData.entries());

  const formSchema = z.object({
    amount: z.string().min(1, { message: "Amount is required." }),
    firstname: z
      .string()
      .min(1, { message: "Must be at least 1 character long." }),
    lastname: z.string().min(1, { message: "Must be at least 1 character long." }),
    company: z.string().optional(),
    email: z.string().email({ message: "Must be a valid email address." }),
    address: z
      .string()
      .min(1, { message: "Must be at least 1 character long." }),
    city: z.string().min(1, { message: "Must be at least 1 character long." }),
    zipCode: z
      .string()
      .min(1, { message: "Must be at least 1 character long." }),
    country: z.string().toUpperCase().length(2),
    officeId: z
      .string()
      .min(1, { message: "Office ID is required." })
      .refine((val) => val !== "no_selection", {
        message: "Please select a valid office.",
      }),
    tenantId: z
      .string()
      .min(1, { message: "Tenant ID is required." })
      .refine((val) => val !== "no_selection", {
        message: "Please select a valid tenant.",
      }),
    productId: z
      .string()
      .min(1, { message: "Product ID is required." })
      .refine((val) => val !== "no_selection", {
        message: "Please select a valid product.",
      }),
  }).transform((data) => {
    // Regrouper officeId, tenantId, productId dans metadata
    return {
      ...data,
      metadata: {
        officeId: data.officeId,
        tenantId: data.tenantId,
        productId: data.productId,
      },
    };
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
