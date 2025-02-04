"use client";

import { ReactNode, useCallback, useEffect, useState } from "react";
import React from "react";
import { FlagMap, FlagValue } from "../lib/featureFlags";
import * as Sentry from "@sentry/nextjs";

interface Props {
  children?: ReactNode;
}

// Create a React context to provide the useFFAdapter function to the ToolbarProvider
export const FFAdapterContext = React.createContext<{ overrides: FlagMap }>({
  overrides: {},
});

//debugger;

const flagsIntegration =
  Sentry.getClient()?.getIntegrationByName<Sentry.FeatureFlagsIntegration>(
    "FeatureFlags"
  );

if (flagsIntegration) {
  flagsIntegration.addFeatureFlag("invoices-sentry", true);
  flagsIntegration.addFeatureFlag("revenue-sentry", true);
} else {
  // Something went wrong, check your DSN and/or integrations
}
//Sentry.captureException(new Error("Something went wrong!"));

const mockFlagsFromProvider = {
  invoices: false,
  revenue: true,
};
const LOCALSTORAGE_KEY = "feature-flag-overrides";

export default function ToolbarProvider({ children }: Props) {
  const [overrides, setOverrides] = useState<FlagMap>({});

  const getLocalStorage = useCallback(() => {
    const stored = localStorage.getItem(LOCALSTORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  }, []);

  const setLocalStorage = useCallback((overrides: FlagMap) => {
    try {
      localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify(overrides));
    } catch {
      return;
    }
  }, []);

  const clearLocalStorage = useCallback(() => {
    localStorage.setItem(LOCALSTORAGE_KEY, "{}");
  }, []);

  useEffect(() => {
    // @ts-ignore
    if (typeof window !== "undefined" && window.SentryToolbar) {
      // @ts-ignore
      window.SentryToolbar.init({
        mountPoint: () => document.body,

        // FeatureFlagsConfig
        featureFlags: {
          getFlagMap(): FlagMap {
            return mockFlagsFromProvider;
          },
          getOverrides(): FlagMap {
            return getLocalStorage() ?? mockFlagsFromProvider;
          },
          setOverride(name: string, value: FlagValue) {
            const prev = getLocalStorage() ?? mockFlagsFromProvider;
            const updated: FlagMap = { ...prev, [name]: value };
            setLocalStorage(updated);
            setOverrides(updated);
          },
          clearOverrides: clearLocalStorage,
          urlTemplate: undefined,
        },

        // OrgConfig
        organizationSlug:
          process.env.NEXT_PUBLIC_SENTRY_ORGANIZATION ?? "sentry-devrel",
        projectIdOrSlug:
          process.env.NEXT_PUBLIC_SENTRY_PROJECT ?? "nextjs-demo",

        // RenderConfig
        domId: "sentry-toolbar",
        placement: "right-edge",
        theme: "light",
      });
      setOverrides(getLocalStorage() ?? mockFlagsFromProvider);
    }
  }, []);

  return (
    <FFAdapterContext.Provider value={{ overrides }}>
      {" "}
      {children}{" "}
    </FFAdapterContext.Provider>
  );
}
