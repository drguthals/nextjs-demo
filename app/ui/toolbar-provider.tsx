"use client";

import { ReactNode, useEffect, useState } from "react";
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

const LOCALSTORAGE_KEY = "feature-flag-overrides";

const getLocalStorage = () => {
  const stored = localStorage.getItem(LOCALSTORAGE_KEY);
  if (stored) {
    return JSON.parse(stored);
  }
};

const setLocalStorage = (overrides: FlagMap) => {
  try {
    localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify(overrides));
  } catch {
    return;
  }
};

const clearLocalStorage = () => {
  localStorage.setItem(LOCALSTORAGE_KEY, "{}");
};

const flagsIntegration =
  Sentry.getClient()?.getIntegrationByName<Sentry.FeatureFlagsIntegration>(
    "FeatureFlags"
  );

function fetchFlags() {
  return {
    invoices: false,
    revenue: false,
  };
}

export default function ToolbarProvider({ children }: Props) {
  const [overrides, setOverrides] = useState<FlagMap>({});

  useEffect(() => {
    // @ts-ignore
    if (typeof window !== "undefined" && window.SentryToolbar) {
      const flagsFromProvider = getLocalStorage() ?? fetchFlags();

      if (flagsIntegration) {
        Object.entries(flagsFromProvider).forEach(([flagName, flagValue]) => {
          flagsIntegration.addFeatureFlag(flagName, flagValue);
        });
      }

      // @ts-ignore
      window.SentryToolbar.init({
        mountPoint: () => document.body,

        // FeatureFlagsConfig
        featureFlags: {
          getFlagMap(): FlagMap {
            return flagsFromProvider;
          },
          getOverrides(): FlagMap {
            return getLocalStorage() ?? flagsFromProvider;
          },
          setOverride(name: string, value: FlagValue) {
            const prev = getLocalStorage() ?? flagsFromProvider;
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
      setOverrides(getLocalStorage() ?? flagsFromProvider);
    }
  }, []);

  return (
    <FFAdapterContext.Provider value={{ overrides }}>
      {" "}
      {children}{" "}
    </FFAdapterContext.Provider>
  );
}
