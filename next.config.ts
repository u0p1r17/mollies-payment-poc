import type { NextConfig } from "next";

// Force Turbopack/Next to consider this directory as the root of the app.
// Évite que Next aille chercher un package-lock/env à un niveau parent,
// ce qui peut casser le chargement des variables NEXT_PUBLIC_* pour Mollie.
const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
