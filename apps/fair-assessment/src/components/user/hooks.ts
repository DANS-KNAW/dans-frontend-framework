import { useMemo } from "react";

type Item = { id: string; name: string; };

export function useUniqueUnselectedList<T>(
  source: T[] | undefined,
  selected: Item[] | undefined,
  extractor: (item: T) => Item[] // must return an array of items
): Item[] {
  return useMemo(() => {
  if (!Array.isArray(source)) return [];

  const extracted = source
    .map(extractor) // Use extractor directly
    .flat()
    .filter((item): item is Item => Boolean(item?.id));

  const unique = Array.from(new Map(extracted.map(i => [i.id, i])).values());

  return unique.filter(
    (item) => !selected?.some((sel) => sel.id === item.id)
  );
}, [source, selected, extractor]);
}