import { BarChart } from '@mui/x-charts/BarChart';
import { type FacetViewProps } from "@elastic/react-search-ui-views";
import { colors } from '../utils/colors';
import FilterFacet from "../ui-components/FilterFacet";
import type { FilterType } from "@elastic/search-ui";
import { useTranslation } from "react-i18next";

interface BarChartFacetProps extends FacetViewProps {
  setFilterType: (type: FilterType) => void;
  customFilterType: FilterType;
  orientation?: "horizontal" | "vertical";
  legend?: boolean;
}

export default function BarChartFacet({
  onRemove,
  onSelect,
  options,
  orientation,
  legend,
  setFilterType,
  customFilterType, 
}: BarChartFacetProps) { 
  const { t } = useTranslation('elastic');
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
    <>
      <FilterFacet
        customFilterType={customFilterType}
        setFilterType={setFilterType}
      />
      <BarChart
        borderRadius={2}
        dataset={chartData}
        {...( orientation !== 'horizontal' ? { xAxis:[{ 
          scaleType: 'band', 
          dataKey: 'label',
          label: '',
        }]} : {})}
        {...( orientation === 'horizontal' ? { yAxis:[{ 
          scaleType: 'band', 
          dataKey: 'label',
          label: '',
          width: 70,
        }]} : {})}
        layout={orientation === "horizontal" ? "horizontal" : "vertical"}
        series={[{ 
          dataKey: 'count', 
          label: t('amountOfDocuments'),
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
        grid={{ horizontal: orientation !== "horizontal", vertical: orientation === "horizontal" }}
        hideLegend={!legend}
      />
    </>
  );
}