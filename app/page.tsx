import Link from "next/link";
import { getBaseUrl, isLocalhost } from "@/lib/url";

export default function Home() {
  const baseUrl = getBaseUrl();
  const isProduction = !isLocalhost(baseUrl);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 font-sans">
      <div className="text-center max-w-2xl px-4">
        {/* Indicateur d'environnement */}
        <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium mb-4 ${
          isProduction
            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
            : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
        }`}>
          {isProduction ? '🌐 Production' : '🛠️ Développement'}
        </div>

        <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-4">
          Intégration Mollie
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
          Proof of Concept - Système de paiement sécurisé avec Next.js
        </p>

        {/* Info Base URL */}
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-8">
          Base URL: {baseUrl}
        </p>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 mb-8">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              Fonctionnalités
            </h2>
            <ul className="text-left space-y-3 text-gray-600 dark:text-gray-300">
              <li className="flex items-start">
                <span className="text-green-500 mr-3 text-xl">✓</span>
                <span>Création de paiements sécurisés via Mollie</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-3 text-xl">✓</span>
                <span>Vérification du statut des paiements en temps réel</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-3 text-xl">✓</span>
                <span>Webhooks pour les notifications automatiques</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-3 text-xl">✓</span>
                <span>Interface moderne et responsive avec Tailwind CSS</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-3 text-xl">✓</span>
                <span>TypeScript pour une meilleure sécurité du code</span>
              </li>
            </ul>
          </div>

          <Link
            href="/checkout"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-8 rounded-lg transition duration-200 shadow-lg hover:shadow-xl text-lg"
          >
            Tester un paiement →
          </Link>
        </div>

        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6">
          <p className="text-sm text-yellow-800 dark:text-yellow-300">
            <strong>Note:</strong> N&apos;oubliez pas de configurer votre clé API Mollie dans le fichier{" "}
            <code className="bg-yellow-100 dark:bg-yellow-900/40 px-2 py-1 rounded">
              .env.local
            </code>
          </p>
        </div>
      </div>
    </div>
  );
}
