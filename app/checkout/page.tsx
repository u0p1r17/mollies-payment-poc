"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useMollie } from "@/lib/MollieContext";

export default function CheckoutPage() {
  const router = useRouter();
  const { mollie } = useMollie();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cardError, setCardError] = useState<string | null>(null);
  const [cardMounted, setCardMounted] = useState(false);
  const [cardRendered, setCardRendered] = useState(false);

  const cardComponentRef = useRef<{ mount: (selector: string) => void; unmount: () => void } | null>(null);

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
    console.log("📋 CheckoutPage useEffect - cardMounted:", cardMounted);

    if (mollie && !cardMounted) {
      try {
        console.log("🔍 Instance mollie reçue:", mollie);
        console.log("🔍 Type de mollie:", typeof mollie);
        console.log("🔍 Méthodes disponibles:", Object.keys(mollie));
        console.log("🔍 mollie.createComponent:", typeof mollie.createComponent);

        if (typeof mollie.createComponent !== "function") {
          throw new Error("mollie.createComponent n'est pas une fonction!");
        }

        // Créer le composant de carte unique (Option A - Recommandée)
        console.log("🎨 Création du composant de carte Mollie...");
        const cardComponent = mollie.createComponent("card");
        console.log("✅ Composant de carte créé:", cardComponent);

        // Monter le composant dans la div #card-component
        console.log("🎯 Montage du composant dans #card-component...");
        cardComponent.mount("#card-component");

        cardComponentRef.current = cardComponent;
        setCardMounted(true);
        console.log("✅ Composant de carte Mollie monté avec succès");
      } catch (err) {
        console.error("❌ Erreur lors du montage du composant de carte:", err);
        setError(
          err instanceof Error
            ? err.message
            : "Impossible de charger le formulaire de paiement"
        );
      }
    }

    // Cleanup: démonter le composant quand le composant React est démonté
    return () => {
      try {
        if (cardComponentRef.current) {
          cardComponentRef.current.unmount();
        }
      } catch (err) {
        console.error("Erreur lors du démontage:", err);
      }
    };
  }, [mollie, cardMounted]);

  // Surface une erreur claire si Mollie ne s'initialise pas (profile ID manquant ou script bloqué)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!cardMounted && !mollie) {
        setError(
          "Mollie Components ne s'est pas initialisé. Vérifiez NEXT_PUBLIC_MOLLIE_PROFILE_ID et le chargement de https://js.mollie.com/v1/mollie.js."
        );
      }
    }, 2500);

    return () => clearTimeout(timer);
  }, [cardMounted, mollie]);

  // Vérifie que l'iframe Mollie est réellement injectée (origine non whiteliste -> composant vide)
  useEffect(() => {
    if (!cardMounted) return;

    const timer = setTimeout(() => {
      const frame = document.querySelector("#card-component iframe");
      if (!frame) {
        setError(
          "Le composant carte ne s'affiche pas. Ajoutez le domaine actuel dans les origins autorisées de votre profil Mollie (Dashboard > Developers > Website profiles > Origins)."
        );
      } else {
        setCardRendered(true);
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [cardMounted]);

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

      // Envoyer le paiement au serveur avec le token
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

      console.log("✅ Paiement créé avec succès!");
      console.log("📋 ID du paiement:", data.id);

      // Mémoriser l'ID avant de partir vers Mollie
      localStorage.setItem("lastPaymentId", data.id);

      // Priorité au checkout Mollie (3DS)
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
        return;
      }

      // Fallback: page de statut locale
      router.push(`/payment/status?id=${data.id}`);
    } catch (err) {
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
                placeholder="10.00"
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
                placeholder="Achat de produit"
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

          {/* Composant de carte Mollie */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Informations de carte bancaire
            </label>
            <div
              id="card-component"
              className="border-2 border-gray-300 rounded-lg p-4 min-h-[200px] bg-white"
            ></div>
            {!cardMounted && !error && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                Chargement du formulaire de carte...
              </p>
            )}
            {cardError && (
              <p className="text-sm text-red-600 dark:text-red-400 mt-2">
                {cardError}
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
