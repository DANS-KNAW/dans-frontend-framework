import { BarChart } from '@mui/x-charts/BarChart';
import { type FacetViewProps } from "@elastic/react-search-ui-views";
import FacetContainer from "../ui-components/FacetContainer";

export default function BarChartFacet({
  label,
  onRemove,
  onSelect,
  options,
  ...restProps
}: FacetViewProps) {
  return (
    <FacetContainer label={label}>
      <BarChart
        series={[
          {
            data: [
              { id: 0, value: 10, label: 'series A' },
              { id: 1, value: 15, label: 'series B' },
              { id: 2, value: 20, label: 'series C' },
            ],
          },
        ]}
        width={200}
        height={200}
      />
    </FacetContainer>
  );
}