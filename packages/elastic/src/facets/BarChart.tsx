import { BarChart } from '@mui/x-charts/BarChart';
import { type FacetViewProps } from "@elastic/react-search-ui-views";
import { colors } from '../utils/colors';

export default function BarChartFacet({
  onRemove,
  onSelect,
  options,
}: FacetViewProps) {
  
  const hasSelection = options.some(item => item.selected);
  
  const chartData = options.map((item) => ({
    id: String(item.value),
    count: item.count,
    label: String(item.value),
    selected: item.selected,
  }));

  const onBarClick = (bar: string | number | Date) => {
    const index = options.findIndex(item => String(item.value) === String(bar));
    
    if (index === -1) return;
    
    const data = options[index];
    
    if (data.selected) {
      onRemove(data.value as any);
      return;
    }
    onSelect(data.value as any);
  }

  return (
    <BarChart
      dataset={chartData}
      xAxis={[{ 
        scaleType: 'band', 
        dataKey: 'label',
        label: ''
      }]}
      series={[{ 
        dataKey: 'count', 
        label: '',
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
          onBarClick(data.axisValue);
        }
      }}
      grid={{ horizontal: true }}
    />
  );
}