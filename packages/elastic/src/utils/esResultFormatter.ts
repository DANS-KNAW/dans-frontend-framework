import type { ResultViewConfig } from "../utils/configConverter";

interface FormattedResult {
  title?: string;
  subTitle?: string;
  description?: string;
  listItems?: Array<{
    label: string;
    value: string;
  }>;
}

function getNestedValue(obj: any, path: string): any {
  return path.split('.').reduce((current, key) => {
    if (current == null) return undefined;

    // unwrap ES { raw: ... }
    if (typeof current === 'object' && 'raw' in current) {
      current = current.raw;
    }

    // map over arrays
    if (Array.isArray(current)) {
      return current
        .map(item => item?.[key])
        .filter(v => v !== undefined);
    }

    return current[key];
  }, obj);
}

function formatValue(value: any): string | undefined {
  if (value == null) return undefined;

  if (Array.isArray(value)) {
    const parts = value
      .map(v => formatValue(v))
      .filter((v): v is string => Boolean(v));

    return parts.length ? parts.join(', ') : undefined;
  }

  if (typeof value === 'object') {
    return undefined;
  }

  return String(value);
}

export function formatESResult(
  result: any,
  config: ResultViewConfig
): FormattedResult {
  const formatted: FormattedResult = {
    listItems: []
  };

  // Get title, subtitle, description (these expect .raw)
  const titleValue = getNestedValue(result, config.title);
  formatted.title = formatValue(titleValue?.raw ?? titleValue);

  const subTitleValue = config.subTitle ? getNestedValue(result, config.subTitle) : undefined;
  formatted.subTitle = formatValue(subTitleValue?.raw ?? subTitleValue);

  const descriptionValue = getNestedValue(result, config.description);
  formatted.description = formatValue(descriptionValue?.raw ?? descriptionValue);

  // Process list items
  config.list?.forEach(({ field, label }) => {
    const value = getNestedValue(result, field);
    const formattedValue = formatValue(value?.raw ?? value);

    if (formattedValue) {
      formatted.listItems?.push({
        label,
        value: formattedValue
      });
    }
  });

  return formatted;
}