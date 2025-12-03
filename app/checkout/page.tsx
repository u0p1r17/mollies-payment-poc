"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { NullableCreatePaymentParams } from "@/lib/types";
import Select from "../components/Select";
import CheckoutButton from "../components/checkoutButton";

export default function CheckoutPage() {
  const router = useRouter();
  const [error, _] = useState<string | null>(null);
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
        />
      );
    }
  );

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

        <form id="form_payment" className="space-y-6">
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
                type="number"
                id="amount"
                name="amount"
                step="0.01"
                min="0.01"
                required
                value={formData.amount ?? ""}
                onChange={(e) =>
                  setFormData({ ...formData, amount: e.target.value })
                }
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition"
                placeholder="10.00"
              />
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
                required
                value={formData.firstname ?? ""}
                onChange={(e) =>
                  setFormData({ ...formData, firstname: e.target.value })
                }
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition"
              />
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
                required
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
              required
              value={formData.email ?? ""}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition"
            />
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
              required
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
                required
                value={formData.city ?? ""}
                onChange={(e) =>
                  setFormData({ ...formData, city: e.target.value })
                }
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition"
              />
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
                required
                value={formData.zipCode ?? ""}
                onChange={(e) =>
                  setFormData({ ...formData, zipCode: e.target.value })
                }
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition"
              />
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
                required
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

          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}
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
