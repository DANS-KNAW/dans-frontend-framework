"use client";

import { createContext, useCallback, useContext, useState } from "react";

interface SupportDrawerContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
  targetTopic: string | null;
  setTargetTopic: (topic: string | null) => void;
}

export const SupportDrawerContext =
  createContext<SupportDrawerContextValue | null>(null);

export function SupportDrawerProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [targetTopic, setTargetTopic] = useState<string | null>(null);
  return (
    <SupportDrawerContext.Provider
      value={{ open, setOpen, targetTopic, setTargetTopic }}
    >
      {children}
    </SupportDrawerContext.Provider>
  );
}

export function useSupportDrawerControl() {
  const ctx = useContext(SupportDrawerContext);

  const openDrawer = useCallback(
    (topic?: string) => {
      if (ctx) {
        if (topic) {
          ctx.setTargetTopic(topic);
        }
        ctx.setOpen(true);
      } else {
        console.warn(
          "SupportDrawerProvider is not mounted. Wrap your app with <SupportDrawerProvider>.",
        );
      }
    },
    [ctx],
  );

  const closeDrawer = useCallback(() => {
    if (ctx) {
      ctx.setOpen(false);
      ctx.setTargetTopic(null);
    } else {
      console.warn(
        "SupportDrawerProvider is not mounted. Wrap your app with <SupportDrawerProvider>.",
      );
    }
  }, [ctx]);

  const toggleDrawer = useCallback(() => {
    if (ctx) {
      if (ctx.open) {
        ctx.setTargetTopic(null);
      }
      ctx.setOpen(!ctx.open);
    } else {
      console.warn(
        "SupportDrawerProvider is not mounted. Wrap your app with <SupportDrawerProvider>.",
      );
    }
  }, [ctx]);

  return { openDrawer, closeDrawer, toggleDrawer };
}
