"use client";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { MollieContextType, MollieInstance } from "./types";

export const MollieContext = createContext<MollieContextType>({ mollie: null });

export const MollieProvider = ({ children }: { children: React.ReactNode }) => {
  const mollieRef = useRef<MollieInstance | null>(null);
  const [mollie, setMollie] = useState<MollieInstance | null>(null);

  useEffect(() => {
    const profileId =
      process.env.NEXT_PUBLIC_MOLLIE_PROFILE_ID ||
      process.env.NEXT_PUBLIC_MOLLIE_PROFILE;
    const testModeFlag = process.env.NEXT_PUBLIC_MOLLIE_TESTMODE;
    const testmode =
      typeof testModeFlag === "string" ? testModeFlag === "true" : true;

    // Charge Mollie script et initialise
    const loadMollie = async () => {
      if (!profileId) {
        console.error("❌ NEXT_PUBLIC_MOLLIE_PROFILE_ID (ou _PROFILE) manquant");
        return;
      }

      if (
        !mollieRef.current &&
        typeof window !== "undefined" &&
        window.Mollie
      ) {
        try {
          mollieRef.current = window.Mollie(profileId, {
            locale: "fr_BE",
            testmode,
          });
          setMollie(mollieRef.current);
        } catch (error) {
          console.error("❌ Erreur lors de la création de Mollie:", error);
        }
      }
    };

    if (typeof window !== "undefined" && !window.Mollie) {
      const script = document.createElement("script");
      script.src = "https://js.mollie.com/v1/mollie.js";
      script.async = true;
      script.onload = loadMollie;
      script.onerror = (error) => {
        console.error("Failed to load Mollie script:", error);
      };
      document.body.appendChild(script);

      return () => {
        document.body.removeChild(script);
      };
    } else {
      loadMollie();
    }

    return () => {
      if (mollieRef.current) {
        mollieRef.current = null;
        setMollie(null);
      }
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
