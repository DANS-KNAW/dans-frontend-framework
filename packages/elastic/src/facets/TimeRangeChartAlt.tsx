import { BarChart } from '@mui/x-charts/BarChart';
import { Slider, Box } from '@mui/material';
import { type FacetViewProps } from "@elastic/react-search-ui-views";
import type { FilterValueRange } from "@elastic/search-ui";
import { colors } from '../utils/colors';
import { useState, useMemo, useEffect } from 'react';
import { useSearch } from "@elastic/react-search-ui";

// Type guard to check if value is FilterValueRange
function isFilterValueRange(value: any): value is FilterValueRange {
  return value && typeof value === 'object' && 'name' in value;
}

interface TimeRangeFacetProps extends FacetViewProps {
  showEmptyYears?: boolean;
}

export default function TimeRangeFacet({
  field,
}: TimeRangeFacetProps) {
  const { rawResponse, filters, removeFilter, addFilter } = useSearch();

  console.log(rawResponse)

  const options = rawResponse?.aggregations?.facet_bucket_all?.[field]?.buckets || [];

  const showEmptyYears = false;

  const hasSelection = options.some(item => item.selected);
  
  const chartData = useMemo(() => 
    options
      .filter(item => {
        // Only filter by count if we're NOT showing empty years
        const hasData = showEmptyYears || item.doc_count > 0;
        return hasData && item.key_as_string;
      })
      .map(item => {
        return {
          year: item.key_as_string,
          count: item.doc_count,
          selected: item.selected,
        };
      }),
    [options, showEmptyYears]
  );

  console.log(chartData)

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
      .map(d => parseInt(d.year));
    
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
      .map(d => parseInt(d.year));
    
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

  // Create filter value for a year
  const createYearFilter = (year: string): FilterValueRange => ({
    from: `${year}-01-01`,
    to: `${year}-12-31`,
    name: year
  });

  const onBarClick = (year: string | number | Date) => {
    const yearStr = year.toString();
    const isSelected = false;
    const filterValue = createYearFilter(yearStr);

    if (isSelected) {
      removeFilter(field, filterValue, 'any');
    } else {
      addFilter(field, filterValue, 'any');
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
        removeFilter(item.value as any);
      }
    });

    // Add all years in the selected range
    chartData.forEach((item, index) => {
      if (index >= startIndex && index <= endIndex) {
        const matchingOption = options.find(opt => 
          isFilterValueRange(opt.value) && opt.value.name === item.year
        );
        if (matchingOption) {
          addFilter(matchingOption.value as any);
        }
      }
    });
  };

  // Create marks for slider (show year labels at intervals)
  const marks = useMemo(() => {
    if (availableYears.length === 0) return [];
    
    // Show marks at start, end, and every ~10 years or adjust based on range
    const interval = Math.max(1, Math.floor(availableYears.length / 5));
    const marks = [];
    
    for (let i = 0; i < availableYears.length; i += interval) {
      marks.push({
        value: i,
        label: availableYears[i].toString()
      });
    }
    
    // Always add the last year
    if (marks[marks.length - 1]?.value !== maxYearIndex) {
      marks.push({
        value: maxYearIndex,
        label: availableYears[maxYearIndex].toString()
      });
    }
    
    return marks;
  }, [availableYears, maxYearIndex]);

  if (chartData.length === 0) {
    return null;
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