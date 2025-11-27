"use client"
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { MollieContextType, MollieInstance } from "./types";

export const MollieContext = createContext<MollieContextType>({ mollie: null });

export const MollieProvider = ({ children }: { children: React.ReactNode }) => {
  const mollieRef = useRef<MollieInstance | null>(null);
  const [mollie, setMollie] = useState<MollieInstance | null>(null);

  useEffect(() => {
    const profileId = process.env.NEXT_PUBLIC_MOLLIE_PROFILE_ID;
    const testModeFlag = process.env.NEXT_PUBLIC_MOLLIE_TESTMODE;
    const testmode =
      typeof testModeFlag === "string" ? testModeFlag === "true" : true;

    console.log("🔍 MollieContext: Initialisation...");
    console.log("📋 Profile ID:", profileId);
    console.log("🔍 Test mode:", testmode);

    if (!profileId) {
      console.error("❌ NEXT_PUBLIC_MOLLIE_PROFILE_ID n'est pas défini!");
      return;
    }

    const initMollie = () => {
      if (typeof window === "undefined") {
        return;
      }

      if (mollieRef.current) {
        console.log("ℹ️ Instance Mollie déjà créée");
        return;
      }

      if (!window.Mollie) {
        console.log("⏳ En attente du chargement de Mollie.js...");
        return;
      }

      try {
        console.log("🚀 Création de l'instance Mollie avec profile ID:", profileId);
        console.log("🔍 Type de window.Mollie:", typeof window.Mollie);

        const mollieInstance = window.Mollie(profileId, {
          locale: "fr_BE",
          testmode,
        });

        console.log("🔍 Instance Mollie créée:", mollieInstance);
        console.log("🔍 Type de l'instance:", typeof mollieInstance);
        console.log("🔍 Méthodes disponibles:", Object.keys(mollieInstance || {}));
        console.log("🔍 createComponent existe?", typeof mollieInstance?.createComponent);

        mollieRef.current = mollieInstance;
        setMollie(mollieInstance);
        console.log("✅ Instance Mollie créée avec succès!");
      } catch (error) {
        console.error("❌ Erreur lors de la création de Mollie:", error);
      }
    };

    // Essayer d'initialiser immédiatement
    initMollie();

    // Si Mollie n'est pas encore disponible, attendre avec un interval
    if (!mollieRef.current) {
      const interval = setInterval(() => {
        if (window.Mollie && !mollieRef.current) {
          console.log("✅ Mollie.js détecté, initialisation...");
          initMollie();
          clearInterval(interval);
        }
      }, 100);

      return () => {
        clearInterval(interval);
        mollieRef.current = null;
        setMollie(null);
      };
    }

    return () => {
      mollieRef.current = null;
      setMollie(null);
    };
  }, []);

  return (
    <MollieContext.Provider value={{ mollie }}>
      {children}
    </MollieContext.Provider>
  );
};

export const useMollie = () => {
  return useContext(MollieContext);
};

declare global {
  interface Window {
    Mollie?: (
      profileId: string,
      options: { locale: string; testmode: boolean }
    ) => MollieInstance;
  }
}
