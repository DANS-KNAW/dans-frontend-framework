import { PieChart } from '@mui/x-charts/PieChart';
import { type FacetViewProps } from "@elastic/react-search-ui-views";
import FacetContainer from "../ui-components/FacetContainer";
import { legendClasses } from '@mui/x-charts/ChartsLegend';

export default function PieChartFacet({
  label,
  onRemove,
  onSelect,
  options,
  ...restProps
}: FacetViewProps) {
  console.log(options)
  const chartData = options.map((option) => ({
    id: option.value,
    value: option.count,
    label: option.value,
  }));
  return (
    <FacetContainer label={label}>
      <PieChart
        series={[
          {
            data: chartData,
          },
        ]}
        // width={300}
        // height={300}
        slotProps={{
        legend: {
          direction: "horizontal",
          position: { 
            vertical: 'bottom',
            horizontal: 'center',
          },
          sx: {
            mt: 3,
            gap: '0.5rem',
            // CSS-in-JS
            [`.${legendClasses.mark}`]: {
              height: 15,
              width: 15,
            },
            // CSS class
            ['.MuiChartsLegend-series']: {
              gap: '0.25rem',
            },
          },
        },
      }}
      />
    </FacetContainer>
  );
}