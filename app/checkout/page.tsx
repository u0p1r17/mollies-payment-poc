"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { NullableCreatePaymentParams } from "@/lib/types";
import Select from "../components/Select";
import CheckoutButton from "../components/checkoutButton";
import { validateFormData } from "@/lib/validation";

export default function CheckoutPage() {
  const router = useRouter();
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
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

  const displaySelectTags = Object.keys(formData.metadata).map(
    (key: string) => {
      return (
        <Select
          key={key}
          subject={key}
          onChange={handleSelectChange}
          valueOptions={["1", "2", "3"]}
          fieldErrors={fieldErrors[key] ? fieldErrors[key][0] : undefined}
        />
      );
    }
  );
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);

    validateFormData(data).then((result) => {
      if (!result.success) {
        console.log(result);

        setFieldErrors({ ...result.errors });
      } else {
        setFieldErrors({});
        fetch("/api/mollie/payments/create", {
          method: "POST",
          body: JSON.stringify(result.data),
        }).then((res) => {
          if (res.ok) {
            res.json().then((data) => {
              if (data.url) {
                router.push(data.url);
              }
            });
          }
        });
      }
    });
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

        <form onSubmit={handleSubmit} id="form_payment" className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            {displaySelectTags ?? null}

            <div>
              {fieldErrors.amount && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {fieldErrors.amount[0]}
                </p>
              )}
              <label
                htmlFor="amount"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Montant (EUR)
              </label>
              <input
                type="number"
                id="amount"
                name="amount"
                step="0.01"
                min="0.01"
                value={formData.amount ?? ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    amount: e.target.value.toString(),
                  })
                }
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition"
                placeholder="10.00"
              />
            </div>
          </div>

          {/* Nom et Prénom */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              {fieldErrors.firstname && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {fieldErrors.firstname[0]}
                </p>
              )}
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
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition"
              />
            </div>

            <div>
              {fieldErrors.lastname && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {fieldErrors.lastname[0]}
                </p>
              )}
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
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            {fieldErrors.email && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {fieldErrors.email[0]}
              </p>
            )}
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
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition"
            />
          </div>

          {/* Adresse */}
          <div>
            {fieldErrors.address && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {fieldErrors.address[0]}
              </p>
            )}
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
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition"
            />
          </div>

          {/* Ville, Code postal, Pays */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              {fieldErrors.city && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {fieldErrors.city[0]}
                </p>
              )}
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
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition"
              />
            </div>

            <div>
              {fieldErrors.zipCode && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {fieldErrors.zipCode[0]}
                </p>
              )}
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
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition"
              />
            </div>

            <div>
              {fieldErrors.country && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {fieldErrors.country[0]}
                </p>
              )}
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
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition"
              >
                <option value="BE">Belgique</option>
                <option value="FR">France</option>
                <option value="NL">Pays-Bas</option>
                <option value="DE">Allemagne</option>
              </select>
            </div>
          </div>
          <CheckoutButton />
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
