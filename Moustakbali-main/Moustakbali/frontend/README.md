# MOUSTAKBALI

MOUSTAKBALI est une plateforme d'éducation financière et de gestion de budget destinée aux étudiants marocains.

## 🚀 Démarrage Rapide

1. Cloner ou télécharger le projet.
2. Installer les dépendances :
   ```bash
   npm install
   ```
3. Lancer le serveur de développement :
   ```bash
   npm run dev
   ```
4. Ouvrir `http://localhost:5173` dans le navigateur.

## 🛠️ Stack Technique
- React.js + Vite
- Tailwind CSS
- Recharts (Graphiques)
- Framer Motion (Animations)
- React Router DOM v6 (Routage)
- Axios (Appels API)
- Lucide React (Icônes)
- React Hot Toast (Notifications)

## 🗄️ Architecture & Données
Cette application fonctionne **100% côté client (Browser)**. 
Aucun backend ou base de données n'est requis.
Toutes les données (utilisateurs, sessions, budgets, points) sont persistées via `localStorage` et `sessionStorage`.

## 🔑 Authentification
- **Inscription** : Les nouveaux comptes sont enregistrés dans `localStorage` sous la clé `mb_users`.
- **Connexion** : La session active est maintenue via `sessionStorage` (`mb_session`).
- **Mot de passe** : Hachage simulé via `btoa()`.

## 🌍 APIs Externes
L'application utilise des appels directs depuis le navigateur vers :
- **NewsAPI.org** : Actualités financières
- **Alpha Vantage** : Données de marché (MASI simulé si pas de clé)

*(Si les clés API ne sont pas configurées dans un `.env`, l'application bascule automatiquement sur des données mockées pour garantir le fonctionnement visuel de la démonstration).*
