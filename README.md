# Mollie Payment POC - Next.js

Un proof of concept (POC) complet pour l'intégration de l'API Mollie dans une application Next.js 16 avec TypeScript et React 19.

## 🚀 Fonctionnalités

- ✅ Création de paiements sécurisés via Mollie
- ✅ Vérification du statut des paiements en temps réel
- ✅ Gestion des webhooks pour les notifications automatiques
- ✅ Interface moderne et responsive avec Tailwind CSS
- ✅ TypeScript pour une meilleure sécurité du code
- ✅ Support du mode sombre

## 📋 Prérequis

- Node.js 18+
- Un compte Mollie (https://www.mollie.com)
- Une clé API Mollie (test ou production)

## 🛠️ Installation

1. **Cloner le projet et installer les dépendances**

```bash
npm install
```

2. **Configurer les variables d'environnement**

Copier le fichier `.env.example` vers `.env.local` :

```bash
cp .env.example .env.local
```

Éditer `.env.local` et remplacer les valeurs :

```env
# Obtenez votre clé API depuis: https://www.mollie.com/dashboard/developers/api-keys
MOLLIE_API_KEY=test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# URL de base de votre application
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

3. **Lancer le serveur de développement**

```bash
npm run dev
```

L'application sera accessible sur [http://localhost:3000](http://localhost:3000)

## 📁 Structure du projet

```
mollies-payment-poc/
├── app/
│   ├── api/
│   │   └── payments/
│   │       ├── create/
│   │       │   └── route.ts       # Création de paiements
│   │       ├── status/
│   │       │   └── route.ts       # Vérification du statut
│   │       └── webhook/
│   │           └── route.ts       # Réception des webhooks
│   ├── checkout/
│   │   └── page.tsx               # Page de formulaire de paiement
│   ├── payment/
│   │   └── status/
│   │       └── page.tsx           # Page de statut du paiement
│   ├── page.tsx                   # Page d'accueil
│   └── layout.tsx
├── lib/
│   └── mollie.ts                  # Configuration du client Mollie
├── types/
│   └── mollie.ts                  # Types TypeScript pour Mollie
└── .env.local                     # Variables d'environnement (à créer)
```

## 🔄 Flux de paiement

1. **Création du paiement**
   - L'utilisateur remplit le formulaire sur `/checkout`
   - L'application appelle `/api/payments/create`
   - L'API crée un paiement Mollie et retourne l'URL de checkout
   - L'utilisateur est redirigé vers la page de paiement Mollie

2. **Traitement du paiement**
   - L'utilisateur effectue le paiement sur Mollie
   - Mollie redirige l'utilisateur vers `/payment/status?id={payment_id}`
   - L'application affiche le statut du paiement

3. **Notification webhook**
   - Mollie envoie une notification à `/api/payments/webhook`
   - Votre application traite la notification (mise à jour BDD, emails, etc.)

## 🔌 API Routes

### POST `/api/payments/create`

Créer un nouveau paiement Mollie.

**Body:**
```json
{
  "amount": 10.00,
  "description": "Achat de produit",
  "customerEmail": "client@exemple.fr",
  "customerName": "Jean Dupont"
}
```

**Response:**
```json
{
  "id": "tr_xxxxx",
  "status": "open",
  "checkoutUrl": "https://www.mollie.com/checkout/...",
  "amount": {
    "value": "10.00",
    "currency": "EUR"
  }
}
```

### GET `/api/payments/status?id={payment_id}`

Vérifier le statut d'un paiement.

**Response:**
```json
{
  "id": "tr_xxxxx",
  "status": "paid",
  "amount": {
    "value": "10.00",
    "currency": "EUR"
  },
  "description": "Achat de produit",
  "paidAt": "2025-01-20T10:30:00Z"
}
```

### POST `/api/payments/webhook`

Endpoint pour recevoir les webhooks de Mollie (appelé automatiquement par Mollie).

## 🧪 Tests avec Mollie

Mollie fournit des clés API de test qui permettent de simuler des paiements sans argent réel.

### Obtenir une clé de test

1. Créer un compte sur https://www.mollie.com
2. Aller dans Dashboard → Developers → API keys
3. Copier votre clé de test (commence par `test_`)

### Tester les webhooks localement

Pour tester les webhooks en local, vous devez exposer votre serveur local à Internet. Utilisez un outil comme **ngrok** :

```bash
# Installer ngrok
npm install -g ngrok

# Lancer ngrok sur le port 3000
ngrok http 3000
```

Ngrok vous donnera une URL publique (ex: `https://abc123.ngrok.io`).

Mettez à jour votre `.env.local` :
```env
NEXT_PUBLIC_BASE_URL=https://abc123.ngrok.io
```

Maintenant, Mollie pourra envoyer des webhooks à votre application locale !

## 💳 Statuts de paiement Mollie

- **`open`** : Le paiement a été créé mais pas encore commencé
- **`pending`** : Le paiement est en cours de traitement
- **`paid`** : Le paiement a été complété avec succès ✅
- **`failed`** : Le paiement a échoué ❌
- **`canceled`** : Le paiement a été annulé par l'utilisateur 🚫
- **`expired`** : Le paiement a expiré ⏰

## 🔐 Sécurité

- ✅ Les clés API ne sont **jamais** exposées côté client
- ✅ Toutes les opérations Mollie se font côté serveur
- ✅ Validation des données en entrée
- ✅ Gestion des erreurs appropriée

## 🚀 Passage en production

1. **Obtenir une clé API de production**
   - Compléter la vérification de votre compte Mollie
   - Récupérer la clé de production (commence par `live_`)

2. **Mettre à jour les variables d'environnement**
   ```env
   MOLLIE_API_KEY=live_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   NEXT_PUBLIC_BASE_URL=https://votre-domaine.com
   ```

3. **Vérifier les webhooks**
   - Assurez-vous que votre webhook URL est accessible publiquement
   - Testez avec des paiements réels

4. **Implémenter votre logique métier**
   - Dans `/api/payments/webhook/route.ts`, ajoutez :
     - Mise à jour de votre base de données
     - Envoi d'emails de confirmation
     - Déclenchement de la livraison du produit/service

## 📚 Ressources

- [Documentation Mollie](https://docs.mollie.com/)
- [Mollie API Client (Node.js)](https://github.com/mollie/mollie-api-node)
- [Next.js Documentation](https://nextjs.org/docs)
- [Dashboard Mollie](https://www.mollie.com/dashboard)

## 📝 Licence

Ce projet est un POC à des fins éducatives.
