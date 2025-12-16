"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { NullableCreatePaymentParams } from "@/lib/types";
import Select from "../components/Select";
import CheckoutButton from "../components/checkoutButton";
import { validateFormData, validateSingleField } from "@/lib/validation";

export default function CheckoutPage() {
  const router = useRouter();
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<NullableCreatePaymentParams>({
    amount: "10.00",
    firstname: "Jean",
    lastname: "Neymar",
    email: "jean@neymar.com",
    address: "Rue de Test 123",
    city: "Bruxelles",
    zipCode: "1000",
    country: "BE",
    company: "",
    metadata: {
      officeId: "",
      tenantId: "",
      productId: "",
    },
  });

  const handleSelectChange = (value: string, subject: string) => {
    setFormData((prev) => ({
      ...prev,
      metadata: {
        ...prev.metadata,
        [subject]: value,
      },
    }));
  };

  // Scroll vers le premier champ en erreur
  useEffect(() => {
    if (Object.keys(fieldErrors).length > 0) {
      const firstErrorField = Object.keys(fieldErrors)[0];
      const errorElement = document.getElementById(firstErrorField);

      if (errorElement) {
        errorElement.scrollIntoView({ behavior: "smooth", block: "center" });
        errorElement.focus();
      }
    }
  }, [fieldErrors]);

  // Normaliser le montant : remplacer "," par "."
  const normalizeAmount = (value: string): string => {
    return value.replace(",", ".");
  };

  // Formater le montant avec 2 décimales
  const formatAmount = (value: string): string => {
    const normalized = normalizeAmount(value);
    const parsed = parseFloat(normalized);

    if (isNaN(parsed)) {
      return value; // Garder la valeur originale si invalide
    }

    return parsed.toFixed(2);
  };

  // Handler spécifique pour le champ amount
  const handleAmountBlur = (value: string) => {
    setTouchedFields((prev) => ({ ...prev, amount: true }));

    // Normaliser et formater
    const normalized = normalizeAmount(value);
    const formatted = formatAmount(normalized);

    // Mettre à jour le formData avec la valeur formatée
    setFormData((prev) => ({ ...prev, amount: formatted }));

    // Valider avec la valeur normalisée
    const error = validateSingleField("amount", normalized);
    if (error) {
      setFieldErrors((prev) => ({ ...prev, amount: [error] }));
    } else {
      setFieldErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.amount;
        return newErrors;
      });
    }
  };

  // Validation en temps réel au onBlur
  const handleBlur = (fieldName: string, value: string) => {
    setTouchedFields((prev) => ({ ...prev, [fieldName]: true }));

    const error = validateSingleField(fieldName, value);
    if (error) {
      setFieldErrors((prev) => ({ ...prev, [fieldName]: [error] }));
    } else {
      setFieldErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[fieldName];
        return newErrors;
      });
    }
  };

  // Fonction pour générer les classes CSS conditionnelles
  const getInputClassName = (fieldName: string) => {
    const baseClasses = "w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent dark:bg-gray-700 dark:text-white transition";
    const hasError = touchedFields[fieldName] && fieldErrors[fieldName];
    const isValid = touchedFields[fieldName] && !fieldErrors[fieldName];

    if (hasError) {
      return `${baseClasses} border-red-500 dark:border-red-400 focus:ring-red-500`;
    }
    if (isValid) {
      return `${baseClasses} border-green-500 dark:border-green-400 focus:ring-green-500`;
    }
    return `${baseClasses} border-gray-300 dark:border-gray-600 focus:ring-blue-500`;
  };

  const displaySelectTags = Object.keys(formData.metadata).map(
    (key: string) => {
      return (
        <Select
          key={key}
          subject={key}
          onChange={handleSelectChange}
          valueOptions={["1", "2", "3"]}
          fieldErrors={fieldErrors[key] ? fieldErrors[key][0] : undefined}
          value={formData.metadata[key as keyof typeof formData.metadata] ?? ""}
          onBlur={(value) => handleBlur(key, value)}
          touched={touchedFields[key] || false}
        />
      );
    }
  );
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);

    try {
      setLoading(true);
      setGeneralError(null);

      // Marquer tous les champs comme touchés pour afficher les erreurs
      const allFields = {
        amount: true,
        firstname: true,
        lastname: true,
        email: true,
        address: true,
        city: true,
        zipCode: true,
        country: true,
        officeId: true,
        tenantId: true,
        productId: true,
      };
      setTouchedFields(allFields);

      // Validation avec Zod
      const validatedData = await validateFormData(data);

      if (!validatedData.success) {
        setFieldErrors({ ...validatedData.errors });
        setGeneralError("Veuillez corriger les erreurs dans le formulaire.");
        return;
      }

      // Réinitialiser les erreurs si tout est valide
      setFieldErrors({});

      const fetchData = await fetch("/api/mollie/payments/create", {
        method: "POST",
        body: JSON.stringify(validatedData.data),
      });

      if (fetchData.ok) {
        const resData = await fetchData.json();
        if (resData.url && resData.paymentId) {
          router.push(resData.url);
        }
      } else {
        const errorData = await fetchData.json();
        setGeneralError(errorData.error || "Erreur lors de la création du paiement.");
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      setGeneralError("Erreur lors de la création du paiement : " + message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 max-w-2xl w-full">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Paiement sécurisé
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Propulsé par Mollie Components
          </p>
        </div>

        {generalError && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-sm text-red-800 dark:text-red-200 font-medium">
              ❌ {generalError}
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} id="form_payment" className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            {displaySelectTags ?? null}

            <div>
              <label
                htmlFor="amount"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Montant (EUR)
              </label>
              <input
                type="text"
                id="amount"
                name="amount"
                value={formData.amount ?? ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    amount: e.target.value,
                  })
                }
                onBlur={(e) => handleAmountBlur(e.target.value)}
                className={getInputClassName("amount")}
                placeholder="10.00 ou 10,00"
              />
              {fieldErrors.amount && touchedFields.amount && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {fieldErrors.amount[0]}
                </p>
              )}
            </div>
          </div>

          {/* Nom et Prénom */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="firstname"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Prénom
              </label>
              <input
                type="text"
                id="firstname"
                name="firstname"
                value={formData.firstname ?? ""}
                onChange={(e) =>
                  setFormData({ ...formData, firstname: e.target.value })
                }
                onBlur={(e) => handleBlur("firstname", e.target.value)}
                className={getInputClassName("firstname")}
              />
              {fieldErrors.firstname && touchedFields.firstname && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {fieldErrors.firstname[0]}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="lastname"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Nom
              </label>
              <input
                type="text"
                id="lastname"
                name="lastname"
                value={formData.lastname ?? ""}
                onChange={(e) =>
                  setFormData({ ...formData, lastname: e.target.value })
                }
                onBlur={(e) => handleBlur("lastname", e.target.value)}
                className={getInputClassName("lastname")}
              />
              {fieldErrors.lastname && touchedFields.lastname && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {fieldErrors.lastname[0]}
                </p>
              )}
            </div>
          </div>

          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email ?? ""}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              onBlur={(e) => handleBlur("email", e.target.value)}
              className={getInputClassName("email")}
            />
            {fieldErrors.email && touchedFields.email && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {fieldErrors.email[0]}
              </p>
            )}
          </div>

          {/* Adresse */}
          <div>
            <label
              htmlFor="address"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Adresse
            </label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address ?? ""}
              onChange={(e) =>
                setFormData({ ...formData, address: e.target.value })
              }
              onBlur={(e) => handleBlur("address", e.target.value)}
              className={getInputClassName("address")}
            />
            {fieldErrors.address && touchedFields.address && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {fieldErrors.address[0]}
              </p>
            )}
          </div>

          {/* Ville, Code postal, Pays */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label
                htmlFor="city"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Ville
              </label>
              <input
                type="text"
                id="city"
                name="city"
                value={formData.city ?? ""}
                onChange={(e) =>
                  setFormData({ ...formData, city: e.target.value })
                }
                onBlur={(e) => handleBlur("city", e.target.value)}
                className={getInputClassName("city")}
              />
              {fieldErrors.city && touchedFields.city && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {fieldErrors.city[0]}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="zipCode"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Code postal
              </label>
              <input
                type="text"
                id="zipCode"
                name="zipCode"
                value={formData.zipCode ?? ""}
                onChange={(e) =>
                  setFormData({ ...formData, zipCode: e.target.value })
                }
                onBlur={(e) => handleBlur("zipCode", e.target.value)}
                className={getInputClassName("zipCode")}
              />
              {fieldErrors.zipCode && touchedFields.zipCode && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {fieldErrors.zipCode[0]}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="country"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Pays
              </label>
              <select
                id="country"
                name="country"
                value={formData.country ?? ""}
                onChange={(e) =>
                  setFormData({ ...formData, country: e.target.value })
                }
                onBlur={(e) => handleBlur("country", e.target.value)}
                className={getInputClassName("country")}
              >
                <option value="BE">Belgique</option>
                <option value="FR">France</option>
                <option value="NL">Pays-Bas</option>
                <option value="DE">Allemagne</option>
              </select>
              {fieldErrors.country && touchedFields.country && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {fieldErrors.country[0]}
                </p>
              )}
            </div>
          </div>
          <CheckoutButton isLoading={loading} />
        </form>

        <button
          onClick={() => router.push("/")}
          className="mt-6 w-full text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition"
        >
          ← Retour à l&apos;accueil
        </button>
      </div>
    </div>
  );
}
