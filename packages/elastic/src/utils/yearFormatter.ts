export default function yearFormatter(startYear: number | string, endYear: number | string) {
  const start = typeof startYear === 'string' ? parseInt(startYear) : startYear;
  const end = endYear === 'now' ? new Date().getFullYear() : (typeof endYear === 'string' ? parseInt(endYear) : endYear);
  
  const ranges = [];
  for (let year = start; year <= end; year++) {
    ranges.push({
      from: `${year}-01-01`,
      to: `${year}-12-31`,
      name: `${year}`
    });
  }
  
  return ranges;
}