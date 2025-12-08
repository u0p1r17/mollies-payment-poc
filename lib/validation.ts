import z from "zod";

export async function validateFormData(formData: FormData) {
  const form = Object.fromEntries(formData.entries());
  console.log("---- zod ----", form);

  const formSchema = z
    .object({
      amount: z.string().min(1, { message: "Amount is required." }),
      firstname: z
        .string()
        .min(2, { message: "Must be at least 2 characters long." }),
      lastname: z
        .string()
        .min(2, { message: "Must be at least 2 characters long." }),
      company: z.string().optional(),
      email: z.string().email({ message: "Must be a valid email address." }),
      address: z.string("Must be at least 1 character long."),
      city: z.string("Must be at least 1 character long."),
      zipCode: z.string("Must be at least 1 character long."),
      country: z.string().toUpperCase().length(2),
      officeId: z.string("Please select a valid office."),
      tenantId: z.string("Please select a valid tenant."),
      productId: z.string("Please select a valid product."),
    })
    .transform((data) => {
      return {
        ...data,
        metadata: {
          officeId: data.officeId,
          tenantId: data.tenantId,
          productId: data.productId,
        },
      };
    });

  const result =  formSchema.safeParse(form);
  if (!result.success) {
    return { success: false, errors: result.error.flatten().fieldErrors };
  }
  return { success: true, data: result.data };
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
