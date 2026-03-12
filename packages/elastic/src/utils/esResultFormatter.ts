import type { ResultViewConfig } from "../utils/configConverter";

interface FormattedResult {
  title?: string;
  tags?: string[];
  description?: string;
}

function getRaw(result: any, key: string): string | string[] | undefined {
  const value = result[key]?.raw;
  if (value == null || value === "") return undefined;
  if (Array.isArray(value)) return value.filter(Boolean).map(String);
  return String(value);
}

export function formatESResult(
  result: any,
  config: ResultViewConfig
): FormattedResult {
  return {
    title: config.title ? getRaw(result, config.title) as string : undefined,
    description: config.description ? getRaw(result, config.description) as string  : undefined,
    tags: config.tags?.flatMap(key => {
      const v = getRaw(result, key);
      return v == null ? [] : Array.isArray(v) ? v : [v];
    }),
  };
}