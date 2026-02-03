import { BarChart } from '@mui/x-charts/BarChart';
import { type FacetViewProps } from "@elastic/react-search-ui-views";
import type { FilterValueRange } from "@elastic/search-ui";
import { colors } from '../utils/colors';

// Type guard to check if value is FilterValueRange
function isFilterValueRange(value: any): value is FilterValueRange {
  return value && typeof value === 'object' && 'name' in value;
}

export default function TimeRangeFacet({
  onRemove,
  onSelect,
  options,
}: FacetViewProps) {
  const hasSelection = options.some(item => item.selected);

  const onBarClick = (year: string | number | Date) => {
    const data = options.find(item => {
      if (isFilterValueRange(item.value)) {
        return item.value.name === year;
      }
      return false;
    });
    
    if (data?.selected) {
      onRemove(data.value as any);
      return;
    }
    if (data) {
      onSelect(data.value as any);
    }
  }

  const chartData = options
    .filter(item => item.count > 0 && isFilterValueRange(item.value))
    .map(item => {
      const value = item.value as FilterValueRange;
      return {
        year: value.name,
        count: item.count,
        from: value.from,
        to: value.to,
        selected: item.selected,
      };
    });

  // todo make more dynamic
  return (
    <BarChart
      borderRadius={2}
      dataset={chartData}
      xAxis={[{ 
        scaleType: 'band', 
        dataKey: 'year',
        label: 'Year',
      }]}
      yAxis={[{
        tickMinStep: 1,
        valueFormatter: (value: number) => value.toFixed(0),
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
      height={400}
      onItemClick={() => null}
      onAxisClick={(_e, data) => {
        if (data?.axisValue) {
          onBarClick(data.axisValue);
        }
      }}
      grid={{ horizontal: true }}
    />
  );
}