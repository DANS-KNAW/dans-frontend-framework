import type { ResultViewConfig } from "../utils/configConverter";

interface FormattedResult {
  title?: string;
  tags?: string[];
  description?: string;
}

function getRaw(result: any, configKey: string): string | string[] | undefined {
  const [resultKey, ...rest] = configKey.split(".");
  const raw = result[resultKey]?.raw;
  if (raw == null || raw === "") return undefined;

  const dig = (obj: any) => rest.reduce((cur, k) => cur?.[k], obj);

  if (Array.isArray(raw)) {
    const values = raw.map(dig).filter(Boolean).map(String);
    return values.length ? values : undefined;
  }

  const value = rest.length ? dig(raw) : raw;
  if (value == null || value === "") return undefined;
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