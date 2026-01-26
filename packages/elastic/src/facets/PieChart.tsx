import { PieChart } from '@mui/x-charts/PieChart';
import { type FacetViewProps } from "@elastic/react-search-ui-views";
import { legendClasses } from '@mui/x-charts/ChartsLegend';
import { colors } from '../utils/colors';

export default function PieChartFacet({
  onRemove,
  onSelect,
  options,
}: FacetViewProps) {
  const hasSelection = options.some(item => item.selected);

  const chartData = options.map((option, i) => ({
    id: String(option.value),
    value: option.count,
    label: String(option.value),
    selected: option.selected,
    color: option.selected || !hasSelection ? colors[i] : `${colors[i]}40`,
  }));

  const onPieceClick = (piece: number) => {
    const data = chartData[piece];
    if (data.selected) {
      onRemove(data.id);
      return;
    }
    onSelect(data.id);
  }

  return (
    <PieChart
      series={[
        {
          data: chartData,
          cornerRadius: 3,
          innerRadius: 40,
          highlightScope: {
            highlight: 'item',
          },
        },
      ]}
      height={300}
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
            ['& .MuiChartsLegend-series']: {
              gap: '0.25rem',
            },
          },
        },
      }}
      onItemClick={(_event, d) => onPieceClick(d.dataIndex)}
    />
  );
}