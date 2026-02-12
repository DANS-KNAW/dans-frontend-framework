import { BarChart } from '@mui/x-charts/BarChart';
import Slider from '@mui/material/Slider';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { type FacetViewProps } from "@elastic/react-search-ui-views";
import type { FilterValueRange } from "@elastic/search-ui";
import { colors } from '../utils/colors';
import { useState, useMemo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

// Type guard to check if value is FilterValueRange
function isFilterValueRange(value: any): value is FilterValueRange {
  return value && typeof value === 'object' && 'name' in value;
}

interface TimeRangeFacetProps extends FacetViewProps {
  showEmptyBuckets?: boolean;
}

export default function TimeRangeFacet({
  onRemove,
  onSelect,
  options,
  showEmptyBuckets,
}: TimeRangeFacetProps) {
  const { t } = useTranslation('elastic');
  const hasSelection = options.some(item => item.selected);
  
  const chartData = useMemo(() => {
    const filteredData = options
      .filter(item => {
        const hasData = showEmptyBuckets || item.count > 0;
        return hasData && isFilterValueRange(item.value);
      })
      .map(item => {
        const value = item.value as FilterValueRange;
        return {
          year: value.name,
          count: item.count,
          from: value.from,
          to: value.to,
          selected: item.selected,
        };
      })
      .sort((a, b) => parseInt(a.year) - parseInt(b.year));

    // Find first and last non-zero indices
    const firstNonZero = filteredData.findIndex(item => item.count > 0);
    const lastNonZero = filteredData.findLastIndex(item => item.count > 0);

    // If no data at all, return empty array
    if (firstNonZero === -1) return [];

    // Slice from first to last non-zero (inclusive)
    return filteredData.slice(firstNonZero, lastNonZero + 1);
  }, [options, showEmptyBuckets]);

  // Get available years (only those with data)
  const availableYears = useMemo(() => 
    chartData.map(d => parseInt(d.year)),
    [chartData]
  );

  const minYearIndex = 0;
  const maxYearIndex = availableYears.length - 1;
  
  // Calculate initial slider range based on selected filters
  const initialSliderRange = useMemo(() => {
    const selectedYears = chartData
      .filter(d => d.selected)
      .map(d => parseInt(d.year))
      .sort((a, b) => a - b);
    
    if (selectedYears.length === 0) {
      return [minYearIndex, maxYearIndex];
    }
    
    const minSelectedYear = selectedYears[0];
    const maxSelectedYear = selectedYears[selectedYears.length - 1];
    
    const minIndex = availableYears.indexOf(minSelectedYear);
    const maxIndex = availableYears.indexOf(maxSelectedYear);
    
    return [
      minIndex !== -1 ? minIndex : minYearIndex,
      maxIndex !== -1 ? maxIndex : maxYearIndex
    ];
  }, [chartData, availableYears, minYearIndex, maxYearIndex]);
  
  const [sliderRange, setSliderRange] = useState<number[]>(initialSliderRange);

  // Update slider when filters change externally
  useEffect(() => {
    const selectedYears = chartData
      .filter(d => d.selected)
      .map(d => parseInt(d.year))
      .sort((a, b) => a - b);
    
    if (selectedYears.length > 0) {
      const minSelectedYear = selectedYears[0];
      const maxSelectedYear = selectedYears[selectedYears.length - 1];
      
      const minIndex = availableYears.indexOf(minSelectedYear);
      const maxIndex = availableYears.indexOf(maxSelectedYear);
      
      if (minIndex !== -1 && maxIndex !== -1) {
        setSliderRange([minIndex, maxIndex]);
      }
    } else {
      setSliderRange([minYearIndex, maxYearIndex]);
    }
  }, [chartData, availableYears, minYearIndex, maxYearIndex]);

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

  const handleSliderChange = (_event: Event, newValue: number | number[]) => {
    setSliderRange(newValue as number[]);
  };

  const handleSliderCommit = (_event: Event | React.SyntheticEvent, newValue: number | number[]) => {
    const [startIndex, endIndex] = newValue as number[];
    
    // Remove all currently selected year filters first
    options.forEach(item => {
      if (item.selected && isFilterValueRange(item.value)) {
        onRemove(item.value as any);
      }
    });

    // Add all years in the selected range
    chartData.forEach((item, index) => {
      if (index >= startIndex && index <= endIndex) {
        const matchingOption = options.find(opt => 
          isFilterValueRange(opt.value) && opt.value.name === item.year
        );
        if (matchingOption) {
          onSelect(matchingOption.value as any);
        }
      }
    });
  };

  // Create marks for slider (show year labels at intervals)
  const marks = useMemo(() => {
    const count = availableYears.length;
    if (count === 0) return [];

    const lastIndex = count - 1;
    const innerMarks = 3;
    const totalMarks = innerMarks + 2;
    const step = lastIndex / (totalMarks - 1);

    return Array.from({ length: totalMarks }, (_, i) => {
      const index = Math.round(step * i);

      return {
        value: index,
        label: availableYears[index].toString(),
      };
    });
  }, [availableYears]);

  if (chartData.length === 0) {
    return (
      <Typography variant="body2" color="textSecondary" sx={{ my: 2 }}>
        {t('noOptionsFound')}
      </Typography>
    );
  }

  return (
    <Box>
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
      
      <Box sx={{ pr: 2.5, pl: 8 }}>
        <Slider
          value={sliderRange}
          onChange={handleSliderChange}
          onChangeCommitted={handleSliderCommit}
          valueLabelDisplay="auto"
          valueLabelFormat={(value) => availableYears[value]?.toString() || ''}
          min={minYearIndex}
          max={maxYearIndex}
          step={1}
          marks={marks}
          sx={{
            '& .MuiSlider-thumb': {
              color: colors[0],
            },
            '& .MuiSlider-track': {
              color: colors[0],
            },
            '& .MuiSlider-rail': {
              color: `${colors[0]}40`,
            },
          }}
        />
      </Box>
    </Box>
  );
}