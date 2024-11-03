import { useEffect } from "react";

const WIDGET_URL = "https://euc-widget.freshworks.com/widgets/";

export interface FreshworksSettings {
  widget_id: number;
}

export interface FreshworksWidgetFunction {
  (...args: any[]): void;
  q?: any[];
}

export const useFreshworksWidget = (widgetId: number) => {
  useEffect(() => {
    const w = window as unknown as {
      fwSettings?: FreshworksSettings;
      FreshworksWidget?: FreshworksWidgetFunction;
    };

    w.fwSettings = {
      widget_id: widgetId,
    };

    if (typeof w.FreshworksWidget !== "function") {
      const n = function (this: any, ...args: any[]) {
        n.q?.push(args);
      } as FreshworksWidgetFunction;
      n.q = [];
      w.FreshworksWidget = n;
    }

    const script = document.createElement("script");
    script.src = WIDGET_URL + widgetId + ".js";
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
      delete w.FreshworksWidget;
      delete w.fwSettings;
    };
  }, [widgetId]);
};
