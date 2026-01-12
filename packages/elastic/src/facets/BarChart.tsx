import { BarChart } from '@mui/x-charts/BarChart';
import { type FacetViewProps } from "@elastic/react-search-ui-views";
// import { lookupLanguageString } from "@dans-framework/utils";
// import { useTranslation } from "react-i18next";
import { colors } from '../utils/colors';

export default function BarChartFacet({
  onRemove,
  onSelect,
  options,
}: FacetViewProps) {
  // const { i18n } = useTranslation();

  console.log(options)

  const hasSelection = options.some(item => item.selected);

  const chartData = options.map((item) => ({
    id: item.value,
    value: item.count,
    label: item.value,
    selected: item.selected,
  }));

  const onBarClick = (bar: string) => {
    const data = options.find(item => item.value.name === bar);
    if (data.selected) {
      onRemove(data.value);
      return;
    }
    onSelect(data.value);
  }

  return (
    <BarChart
      dataset={chartData}
      xAxis={[{ 
        scaleType: 'band', 
        dataKey: '',
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