"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useMollie } from "@/lib/MollieContext";

interface ComponentErrors {
  cardNumber?: string;
  cardHolder?: string;
  expiryDate?: string;
  verificationCode?: string;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { mollie } = useMollie();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cardMounted, setCardMounted] = useState(false);
  const [componentErrors, setComponentErrors] = useState<ComponentErrors>({});

  const cardNumberRef = useRef<any>(null);
  const cardHolderRef = useRef<any>(null);
  const expiryDateRef = useRef<any>(null);
  const verificationCodeRef = useRef<any>(null);

  const [formData, setFormData] = useState({
    amount: "10.00",
    description: "Achat de test",
    firstname: "Jean",
    lastname: "Neymar",
    email: "jean@neymar.com",
    address: "Rue de Test 123",
    city: "Bruxelles",
    zipCode: "1000",
    country: "BE",
  });

  useEffect(() => {
    console.log("📋 CheckoutPage useEffect - mollie:", mollie);

    if (mollie && !cardMounted) {
      try {
        console.log("🎨 Création des composants Mollie...");

        // Créer les composants
        const cardNumber = mollie.createComponent("cardNumber");
        const cardHolder = mollie.createComponent("cardHolder");
        const expiryDate = mollie.createComponent("expiryDate");
        const verificationCode = mollie.createComponent("verificationCode");

        // Monter les composants
        cardNumber.mount("#card-number");
        cardHolder.mount("#card-holder");
        expiryDate.mount("#expiry-date");
        verificationCode.mount("#verification-code");

        // Ajouter les event listeners pour la validation
        cardNumber.addEventListener("change", (event: any) => {
          if (event.error && event.touched) {
            setComponentErrors((prev) => ({
              ...prev,
              cardNumber: event.error,
            }));
          } else {
            setComponentErrors((prev) => ({
              ...prev,
              cardNumber: undefined,
            }));
          }
        });

        cardHolder.addEventListener("change", (event: any) => {
          if (event.error && event.touched) {
            setComponentErrors((prev) => ({
              ...prev,
              cardHolder: event.error,
            }));
          } else {
            setComponentErrors((prev) => ({
              ...prev,
              cardHolder: undefined,
            }));
          }
        });

        expiryDate.addEventListener("change", (event: any) => {
          if (event.error && event.touched) {
            setComponentErrors((prev) => ({
              ...prev,
              expiryDate: event.error,
            }));
          } else {
            setComponentErrors((prev) => ({
              ...prev,
              expiryDate: undefined,
            }));
          }
        });

        verificationCode.addEventListener("change", (event: any) => {
          if (event.error && event.touched) {
            setComponentErrors((prev) => ({
              ...prev,
              verificationCode: event.error,
            }));
          } else {
            setComponentErrors((prev) => ({
              ...prev,
              verificationCode: undefined,
            }));
          }
        });

        // Sauvegarder les refs
        cardNumberRef.current = cardNumber;
        cardHolderRef.current = cardHolder;
        expiryDateRef.current = expiryDate;
        verificationCodeRef.current = verificationCode;

        setCardMounted(true);
        console.log("✅ Tous les composants montés avec event listeners");
      } catch (err) {
        console.error("❌ Erreur lors du montage:", err);
        setError(
          err instanceof Error
            ? err.message
            : "Impossible de charger le formulaire de paiement"
        );
      }
    }

    return () => {
      try {
        if (cardNumberRef.current) cardNumberRef.current.unmount();
        if (cardHolderRef.current) cardHolderRef.current.unmount();
        if (expiryDateRef.current) expiryDateRef.current.unmount();
        if (verificationCodeRef.current)
          verificationCodeRef.current.unmount();
      } catch (err) {
        console.error("Erreur lors du démontage:", err);
      }
    };
  }, [mollie, cardMounted]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (!mollie) {
        throw new Error("Mollie n'est pas encore chargé");
      }

      // Créer le token de carte
      console.log("🔐 Création du token de carte...");
      const { token, error: tokenError } = await mollie.createToken();

      if (tokenError || !token) {
        throw new Error(tokenError || "Erreur lors de la création du token");
      }

      console.log("✅ Token créé:", token);

      // Envoyer le paiement au serveur
      const response = await fetch("/api/payments/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: parseFloat(formData.amount),
          description: formData.description,
          firstname: formData.firstname,
          lastname: formData.lastname,
          email: formData.email,
          address: formData.address,
          city: formData.city,
          zipCode: formData.zipCode,
          country: formData.country,
          cardToken: token,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erreur lors de la création du paiement");
      }

      console.log("✅ Paiement créé!");

      // Rediriger vers la page de statut
      router.push(`/payment/status?id=${data.id}`);
    } catch (err) {
      console.error("❌ Erreur:", err);
      setError(err instanceof Error ? err.message : "Une erreur est survenue");
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

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Montant et Description */}
          <div className="grid grid-cols-2 gap-4">
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
                step="0.01"
                min="0.01"
                required
                value={formData.amount}
                onChange={(e) =>
                  setFormData({ ...formData, amount: e.target.value })
                }
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition"
              />
            </div>

            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Description
              </label>
              <input
                type="text"
                id="description"
                required
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition"
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
                required
                value={formData.firstname}
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
                required
                value={formData.lastname}
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
              required
              value={formData.email}
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
              required
              value={formData.address}
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
                required
                value={formData.city}
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
                required
                value={formData.zipCode}
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
                required
                value={formData.country}
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

          {/* Composants de carte Mollie */}
          <div className="space-y-4">
            <div>
              <label
                htmlFor="card-number"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Numéro de carte
              </label>
              <div
                id="card-number"
                className="border-2 border-gray-300 rounded-lg p-3 min-h-[50px] bg-white"
              ></div>
              {componentErrors.cardNumber && (
                <p className="mt-1 text-sm text-red-600">
                  {componentErrors.cardNumber}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="card-holder"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Nom du titulaire
              </label>
              <div
                id="card-holder"
                className="border-2 border-gray-300 rounded-lg p-3 min-h-[50px] bg-white"
              ></div>
              {componentErrors.cardHolder && (
                <p className="mt-1 text-sm text-red-600">
                  {componentErrors.cardHolder}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="expiry-date"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  Date d&apos;expiration
                </label>
                <div
                  id="expiry-date"
                  className="border-2 border-gray-300 rounded-lg p-3 min-h-[50px] bg-white"
                ></div>
                {componentErrors.expiryDate && (
                  <p className="mt-1 text-sm text-red-600">
                    {componentErrors.expiryDate}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="verification-code"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  Code de sécurité (CVV)
                </label>
                <div
                  id="verification-code"
                  className="border-2 border-gray-300 rounded-lg p-3 min-h-[50px] bg-white"
                ></div>
                {componentErrors.verificationCode && (
                  <p className="mt-1 text-sm text-red-600">
                    {componentErrors.verificationCode}
                  </p>
                )}
              </div>
            </div>

            {!cardMounted && !error && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                Chargement du formulaire de carte...
              </p>
            )}
          </div>

          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !cardMounted}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-6 rounded-lg transition duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Traitement...
              </span>
            ) : (
              "Payer maintenant"
            )}
          </button>
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
