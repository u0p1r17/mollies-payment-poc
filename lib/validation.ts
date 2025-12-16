import z from "zod";

// Schéma Zod pour les métadonnées
export const MetadataSchema = z.object({
  officeId: z.string().min(1, { message: "Please select a valid office." }),
  tenantId: z.string().min(1, { message: "Please select a valid tenant." }),
  productId: z.string().min(1, { message: "Please select a valid product." }),
});

export async function validateFormData(formData: FormData) {
  const form = Object.fromEntries(formData.entries());
  console.log("---- zod ----", form);

  // Normaliser le montant (remplacer "," par ".")
  if (form.amount && typeof form.amount === "string") {
    form.amount = form.amount.replace(",", ".");
  }

  const formSchema = z
    .object({
      amount: z.string()
        .min(1, { message: "Amount is required." })
        .refine((val) => !isNaN(parseFloat(val)), { message: "Amount must be a valid number." })
        .refine((val) => parseFloat(val) > 0, { message: "Amount must be greater than 0." }),
      firstname: z
        .string()
        .min(2, { message: "Must be at least 2 characters long." }),
      lastname: z
        .string()
        .min(2, { message: "Must be at least 2 characters long." }),
      company: z.string().optional(),
      email: z.string().email({ message: "Must be a valid email address." }),
      address: z.string().min(1, { message: "Must be at least 1 character long." }),
      city: z.string().min(1, { message: "Must be at least 1 character long." }),
      zipCode: z.string().min(1, { message: "Must be at least 1 character long." }),
      country: z.string().toUpperCase().length(2, { message: "Country code must be 2 characters." }),
      officeId: z.string().min(1, { message: "Please select a valid office." }),
      tenantId: z.string().min(1, { message: "Please select a valid tenant." }),
      productId: z.string().min(1, { message: "Please select a valid product." }),
    })
    .transform((data) => {
      // Valider les métadonnées avec le schéma dédié
      const metadata = MetadataSchema.parse({
        officeId: data.officeId,
        tenantId: data.tenantId,
        productId: data.productId,
      });

      return {
        amount: data.amount,
        firstname: data.firstname,
        lastname: data.lastname,
        company: data.company,
        email: data.email,
        address: data.address,
        city: data.city,
        zipCode: data.zipCode,
        country: data.country,
        metadata,
      };
    });

  const result =  formSchema.safeParse(form);
  if (!result.success) {
    return { success: false, errors: result.error.flatten().fieldErrors };
  }
  return { success: true, data: result.data };
}

// Validation d'un seul champ pour la validation en temps réel
export function validateSingleField(fieldName: string, value: string): string | null {
  // Validation spéciale pour le montant
  if (fieldName === "amount") {
    if (!value || value.trim() === "") {
      return "Amount is required.";
    }

    // Normaliser : remplacer "," par "."
    const normalized = value.replace(",", ".");
    const parsed = parseFloat(normalized);

    if (isNaN(parsed)) {
      return "Amount must be a valid number.";
    }

    if (parsed <= 0) {
      return "Amount must be greater than 0.";
    }

    return null;
  }

  const fieldSchemas: Record<string, z.ZodString> = {
    firstname: z.string().min(2, { message: "Must be at least 2 characters long." }),
    lastname: z.string().min(2, { message: "Must be at least 2 characters long." }),
    email: z.string().email(),
    address: z.string().min(1, { message: "Must be at least 1 character long." }),
    city: z.string().min(1, { message: "Must be at least 1 character long." }),
    zipCode: z.string().min(1, { message: "Must be at least 1 character long." }),
    country: z.string().toUpperCase().length(2, { message: "Country code must be 2 characters." }),
    officeId: z.string().min(1, { message: "Please select a valid office." }),
    tenantId: z.string().min(1, { message: "Please select a valid tenant." }),
    productId: z.string().min(1, { message: "Please select a valid product." }),
  };

  const schema = fieldSchemas[fieldName];
  if (!schema) return null;

  const result = schema.safeParse(value);
  if (!result.success) {
    return result.error.issues[0].message;
  }
  return null;
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
