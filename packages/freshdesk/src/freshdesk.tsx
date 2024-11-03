import React from "react";
import { useFreshworksWidget } from "./useFreshworksWidget";

export interface FreshworksWidgetProps {
  widgetId: number;
}

const Freshdesk: React.FC<FreshworksWidgetProps> = ({ widgetId }) => {
  useFreshworksWidget(widgetId);
  return null;
};

export default Freshdesk;
