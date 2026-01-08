import { BarChart } from '@mui/x-charts/BarChart';
import { type FacetViewProps } from "@elastic/react-search-ui-views";
import { lookupLanguageString } from "@dans-framework/utils";
import { useTranslation } from "react-i18next";

export default function BarChartFacet({
  // onRemove,
  // onSelect,
  options,
}: FacetViewProps) {
  const { i18n } = useTranslation();

  console.log(options)

  const chartData = options.map((option) => ({
    id: option.value,
    value: option.count,
    label: option.value,
  }));

  const chartSetting = {
    yAxis: [
      {
        label: lookupLanguageString({ en: "Count", nl: "Aantal" }, i18n.language),
        width: 60,
      },
    ],
    height: 300,
    margin: { left: 0 },
  };

  return (
    <BarChart
      series={[
        {
          data: chartData,
        },
      ]}
      height={300}
    />
  );
}