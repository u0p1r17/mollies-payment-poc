# Mollie Payment POC (Next.js 16)

Proof of Concept pour intégrer Mollie dans une app Next.js (app router) avec TypeScript, React 19 et Tailwind CSS 4. Le stockage des paiements est simulé via un fichier JSON (`DB/payment.json`) pour illustrer la synchronisation avec Mollie.

## Fonctionnalités clés
- Formulaire de paiement sur `/checkout` avec validation Zod et métadonnées (office/tenant/product).
- Création de paiement via l'API Mollie (`/api/mollie/payments/create`) et redirection vers le checkout Mollie.
- Webhook `/api/mollie/webhook` pour mettre à jour le store local quand Mollie notifie un changement.
- Page d'accueil qui lance une synchronisation serveur→fichier avec les paiements Mollie.
- Pages de visualisation : liste des paiements (`/payment`) et statut (`/payment/status?id={paymentId}`).

## Prérequis
- Node.js 18+
- Compte Mollie et clé API (test ou production).
- Ngrok (ou équivalent) si vous voulez recevoir les webhooks en local.

## Installation
```bash
npm install
```

## Configuration des variables d'environnement
Créer un fichier `.env.local` (ou utiliser `.env`) à la racine :
```env
MOLLIE_API_KEY=test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
NEXT_PUBLIC_BASE_URL=http://localhost:3000
# URL publique pointant vers /api/mollie/webhook (ngrok en local)
NEXT_PUBLIC_MOLLIE_WEBHOOK=https://<votre-tunnel>.ngrok-free.app/api/mollie/webhook
# Optionnel : profil Mollie si vous en avez besoin côté client
NEXT_PUBLIC_MOLLIE_PROFILE_ID=pfl_xxxxxxxxx
```
> La clé `MOLLIE_API_KEY` est l'unique valeur obligatoire pour lancer le POC. Assurez-vous que `NEXT_PUBLIC_BASE_URL` et `NEXT_PUBLIC_MOLLIE_WEBHOOK` correspondent à votre environnement (localhost ou tunnel).

## Lancer le projet
```bash
npm run dev
```
Application disponible sur `http://localhost:3000`.

## Flux de paiement (POC)
1) L'utilisateur remplit le formulaire sur `/checkout` et envoie les métadonnées.  
2) L'API `POST /api/mollie/payments/create` crée un paiement Mollie et renvoie l'URL de checkout.  
3) Mollie redirige l'utilisateur selon vos URLs de redirection et déclenche le webhook `/api/mollie/webhook` pour rafraîchir `DB/payment.json`.  
4) Vous pouvez consulter les données dans `/payment` (liste) et `/payment/status?id={id}` (statut).  
   - La page statut attend l'endpoint `/api/payments/status` (non implémenté dans ce POC) : à compléter si vous voulez afficher le statut en direct.

## API & serveurs
- `POST /api/mollie/payments/create` : attend un JSON conforme à `CreatePaymentParams` (`amount`, `firstname`, `lastname`, `email`, adresse, `metadata.officeId|tenantId|productId`). Réponse `{ url }` pour la redirection.  
- `POST /api/mollie/webhook` : appelé par Mollie, récupère `id` dans le body form-data et met à jour `DB/payment.json`.  
- Server actions dans `lib/server-actions.ts` pour synchroniser le store local avec Mollie (`syncronizePaymentsWithMollie`) et lire/écrire le fichier.

## Points d'entrée UI
- `/` : page d'accueil + synchro de la BDD locale avec Mollie au chargement.
- `/checkout` : formulaire de paiement (validation côté client via Zod).
- `/payment` : liste des paiements issus de `DB/payment.json` avec filtres simples.
- `/payment/status` : affichage du statut d'un paiement (prévu, nécessite l'endpoint de statut côté API).

## Scripts NPM
- `npm run dev` : démarrage en mode développement.
- `npm run build` : build de production.
- `npm run start` : serveur Next en production.
- `npm run lint` : ESLint.

## Notes
- Ce dépôt utilise Tailwind CSS 4 (nouveau pipeline PostCSS) et Next.js 16 (app router, React 19).  
- Les données de paiement sont stockées à des fins de démonstration dans `DB/payment.json`; remplacez par une vraie base pour un usage réel.  
- Pensez à sécuriser et vérifier vos URLs de redirection/webhook avant un passage en production.
