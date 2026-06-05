import {
  createEmptyContext,
  createEmptyTarget,
  ExchangeableLinkSet,
  LinkContext,
  LinkContextDraft,
  LinkRelationId,
  LinkSet,
  LinkSetDraft,
  LinkTarget,
  LinkTargetDraft,
} from "./types";

function parseUrl(value: string): URL | null {
  if (!value.trim()) {
    return null;
  }

  try {
    return new URL(value);
  } catch {
    return null;
  }
}

export function parseDraftToLinkSet(draft: LinkSetDraft): { parsed?: LinkSet; errors: string[] } {
  const errors: string[] = [];

  const parseRelationTargets = (
    contextIndex: number,
    relationId: LinkRelationId,
    targets: LinkTargetDraft[],
  ): LinkTarget[] => {
    return targets.map((target, targetIndex) => {
      const hrefUrl = parseUrl(target.href);
      if (!hrefUrl) {
        errors.push(
          `Context ${contextIndex + 1}, ${relationId} target ${targetIndex + 1}: href must be a valid absolute URL`,
        );
      }

      return {
        href: hrefUrl ?? new URL("https://invalid.local"),
        type: target.type.trim() || undefined,
        title: target.title.trim() || undefined,
      };
    });
  };

  const contexts: LinkContext[] = draft.contexts.map((context, contextIndex) => {
    const anchorUrl = parseUrl(context.anchor);
    if (!anchorUrl) {
      errors.push(`Context ${contextIndex + 1}: anchor must be a valid absolute URL`);
    }

    return {
      anchor: anchorUrl ?? new URL("https://invalid.local"),
      serviceDescLinkRelation: context.serviceDescLinkRelation
        ? {
            id: "service-desc",
            targets: parseRelationTargets(
              contextIndex,
              "service-desc",
              context.serviceDescLinkRelation.targets,
            ),
          }
        : undefined,
      serviceDocLinkRelation: context.serviceDocLinkRelation
        ? {
            id: "service-doc",
            targets: parseRelationTargets(
              contextIndex,
              "service-doc",
              context.serviceDocLinkRelation.targets,
            ),
          }
        : undefined,
      serviceMetaLinkRelation: context.serviceMetaLinkRelation
        ? {
            id: "service-meta",
            targets: parseRelationTargets(
              contextIndex,
              "service-meta",
              context.serviceMetaLinkRelation.targets,
            ),
          }
        : undefined,
    };
  });

  if (errors.length > 0) {
    return { errors };
  }

  return {
    errors,
    parsed: { contexts },
  };
}

export function toExchangeableLinkSet(linkSet: LinkSet): ExchangeableLinkSet {
  return {
    linkset: linkSet.contexts.map((context) => ({
      anchor: context.anchor.toString(),
      "service-desc": context.serviceDescLinkRelation?.targets.map((target) => ({
        href: target.href.toString(),
        type: target.type,
        title: target.title,
      })),
      "service-doc": context.serviceDocLinkRelation?.targets.map((target) => ({
        href: target.href.toString(),
        type: target.type,
        title: target.title,
      })),
      "service-meta": context.serviceMetaLinkRelation?.targets.map((target) => ({
        href: target.href.toString(),
        type: target.type,
        title: target.title,
      })),
    })),
  };
}

export function toExchangeableLinkSetDraft(draft: LinkSetDraft): ExchangeableLinkSet {
  return {
    linkset: draft.contexts.map((context) => ({
      anchor: context.anchor,
      "service-desc": context.serviceDescLinkRelation?.targets.map((target) => ({
        href: target.href,
        type: target.type.trim() || undefined,
        title: target.title.trim() || undefined,
      })),
      "service-doc": context.serviceDocLinkRelation?.targets.map((target) => ({
        href: target.href,
        type: target.type.trim() || undefined,
        title: target.title.trim() || undefined,
      })),
      "service-meta": context.serviceMetaLinkRelation?.targets.map((target) => ({
        href: target.href,
        type: target.type.trim() || undefined,
        title: target.title.trim() || undefined,
      })),
    })),
  };
}

export function parseExchangeableLinkSetToDraft(input: unknown): { draft?: LinkSetDraft; error?: string } {
  if (!input || typeof input !== "object") {
    return { error: "Invalid JSON structure: expected an object with a linkset array." };
  }

  const rawLinkset = (input as { linkset?: unknown }).linkset;
  if (!Array.isArray(rawLinkset)) {
    return { error: "Invalid JSON structure: linkset must be an array." };
  }

  const buildTargets = (value: unknown, contextIndex: number, relationId: LinkRelationId) => {
    if (!Array.isArray(value)) {
      return {
        error: `Context ${contextIndex + 1}, ${relationId}: relation must be an array of links.`,
      };
    }

    const targets: LinkTargetDraft[] = [];

    for (let targetIndex = 0; targetIndex < value.length; targetIndex += 1) {
      const rawTarget = value[targetIndex];

      if (!rawTarget || typeof rawTarget !== "object") {
        return {
          error: `Context ${contextIndex + 1}, ${relationId} target ${targetIndex + 1}: target must be an object.`,
        };
      }

      const href = (rawTarget as { href?: unknown }).href;
      if (typeof href !== "string") {
        return {
          error: `Context ${contextIndex + 1}, ${relationId} target ${targetIndex + 1}: href must be a string.`,
        };
      }

      const type = (rawTarget as { type?: unknown }).type;
      const title = (rawTarget as { title?: unknown }).title;

      targets.push({
        href,
        type: typeof type === "string" ? type : "",
        title: typeof title === "string" ? title : "",
      });
    }

    return {
      targets: targets.length > 0 ? targets : [createEmptyTarget()],
    };
  };

  const contexts: LinkContextDraft[] = [];

  for (let contextIndex = 0; contextIndex < rawLinkset.length; contextIndex += 1) {
    const rawContext = rawLinkset[contextIndex];

    if (!rawContext || typeof rawContext !== "object") {
      return {
        error: `Context ${contextIndex + 1}: each context must be an object.`,
      };
    }

    const anchor = (rawContext as { anchor?: unknown }).anchor;
    if (typeof anchor !== "string") {
      return {
        error: `Context ${contextIndex + 1}: anchor must be a string.`,
      };
    }

    const contextDraft: LinkContextDraft = { anchor };
    const relationEntries: ["service-desc" | "service-doc" | "service-meta", keyof Omit<LinkContextDraft, "anchor">, LinkRelationId][] = [
      ["service-desc", "serviceDescLinkRelation", "service-desc"],
      ["service-doc", "serviceDocLinkRelation", "service-doc"],
      ["service-meta", "serviceMetaLinkRelation", "service-meta"],
    ];

    for (const [exchangeableKey, draftKey, relationId] of relationEntries) {
      if (Object.prototype.hasOwnProperty.call(rawContext, exchangeableKey)) {
        const parsedTargets = buildTargets(
          (rawContext as Record<string, unknown>)[exchangeableKey],
          contextIndex,
          relationId,
        );

        if (parsedTargets.error) {
          return { error: parsedTargets.error };
        }

        contextDraft[draftKey] = {
          id: relationId,
          targets: parsedTargets.targets ?? [createEmptyTarget()],
        };
      }
    }

    contexts.push(contextDraft);
  }

  return {
    draft: {
      contexts: contexts.length > 0 ? contexts : [createEmptyContext()],
    },
  };
}
