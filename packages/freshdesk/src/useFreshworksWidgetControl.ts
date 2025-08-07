import { useCallback } from "react";

export interface FreshworksWidgetFunction {
  (...args: any[]): void;
  q?: any[];
}

// Hook that only provides control functions (no widget injection)
export const useFreshworksWidgetControl = () => {
  const openWidget = useCallback(() => {
    const w = window as unknown as {
      FreshworksWidget?: FreshworksWidgetFunction;
    };

    if (w.FreshworksWidget) {
      w.FreshworksWidget("open");
    } else {
      console.warn(
        "FreshworksWidget is not yet loaded. Make sure to initialize it first."
      );
    }
  }, []);

  const closeWidget = useCallback(() => {
    const w = window as unknown as {
      FreshworksWidget?: FreshworksWidgetFunction;
    };

    if (w.FreshworksWidget) {
      w.FreshworksWidget("close");
    } else {
      console.warn("FreshworksWidget is not yet loaded");
    }
  }, []);

  const hideWidget = useCallback(() => {
    const w = window as unknown as {
      FreshworksWidget?: FreshworksWidgetFunction;
    };

    if (w.FreshworksWidget) {
      w.FreshworksWidget("hide");
    }
  }, []);

  const showWidget = useCallback(() => {
    const w = window as unknown as {
      FreshworksWidget?: FreshworksWidgetFunction;
    };

    if (w.FreshworksWidget) {
      w.FreshworksWidget("show");
    }
  }, []);

  return {
    openWidget,
    closeWidget,
    hideWidget,
    showWidget,
  };
};
