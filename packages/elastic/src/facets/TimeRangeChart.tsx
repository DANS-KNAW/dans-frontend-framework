import { BarChart } from '@mui/x-charts/BarChart';
import { type FacetViewProps } from "@elastic/react-search-ui-views";
import { colors } from '../utils/colors';

export default function TimeRangeFacet({
  onRemove,
  onSelect,
  options,
}: FacetViewProps) {
  const hasSelection = options.some(item => item.selected);

  const onYearClick = (year) => {
    const data = options.find(item => item.value.name === year);
    if (data.selected) {
      onRemove(data.value);
      return;
    }
    onSelect(data.value);
  }

  const chartData = options
    .filter(item => item.count > 0)
    .map(item => ({
      year: item.value.name,
      count: item.count,
      from: item.value.from,
      to: item.value.to,
      selected: item.selected,
    }));

  return (
    <BarChart
      dataset={chartData}
      xAxis={[{ 
        scaleType: 'band', 
        dataKey: 'year',
        label: 'Year'
      }]}
      series={[{ 
        dataKey: 'count', 
        label: 'Documents',
        color: colors[0],
        colorGetter: (data) => {
          const item = chartData[data.dataIndex];
          return item.selected || !hasSelection ? colors[0] : `${colors[0]}40`
        },
        highlightScope: {
          highlight: 'item',
        },
      }]}
      height={300}
      onItemClick={() => null}
      onAxisClick={(_e, data) => {
        if (data?.axisValue) {
          onYearClick(data.axisValue);
        }
      }}
      grid={{ horizontal: true }}
    />
  );
}