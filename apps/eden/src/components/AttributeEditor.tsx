import { Add, Delete } from "@mui/icons-material";
import {
  Box,
  Button,
  Divider,
  IconButton,
  Paper,
  Stack,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import { useMemo, useState } from "react";

/**
 * AttributeEditor 
 * It will be implemented as a FAIRiCat Linkset editor for the services
 * 
 */


export type LinkTarget = {
    href: URL; // not sure it is mandatory... but it would be strange to not have it
    type?: string; // actually we would like mime types here
    title?: string;
    // officially there is more, but we skip it for now
}

// For FAIRiCat, we have three types of link relations: 
// service-doc, service-desc, and service-meta. 

export type ServiceDocLinkRelation = {
    id: "service-doc";
    targets: LinkTarget[];
}

export type ServiceDescLinkRelation = {
    id: "service-desc";
    targets: LinkTarget[];
}

export type ServiceMetaLinkRelation = {
    id: "service-meta";
    targets: LinkTarget[];
}

// LinkContext as specified for FAIRiCat
// Note that a general LinkContext (for a general linkset) would have an array of LinkRelation
// but the id's would have to be unique, so we can only have one of each relation in the context.
export type LinkContext = {
    anchor: URL; // the service URL
    //relations: (ServiceDocLinkRelation | ServiceDescLinkRelation | ServiceMetaLinkRelation)[];
    // my guess is that is can only be one of each
    serviceDocLinkRelation?: ServiceDocLinkRelation;
    serviceDescLinkRelation?: ServiceDescLinkRelation;
    serviceMetaLinkRelation?: ServiceMetaLinkRelation;
    // Note that the JSON representation must be an array with these relations in it
}

// A LinkSet is an array of LinkContexts; for a specific repository in our case?
export type LinkSet = {
    contexts: LinkContext[];
}

type LinkRelationId = "service-doc" | "service-desc" | "service-meta";

type LinkTargetDraft = {
  href: string;
  type: string;
  title: string;
};

type LinkRelationDraft = {
  id: LinkRelationId;
  targets: LinkTargetDraft[];
};

type LinkContextDraft = {
  anchor: string;
  serviceDocLinkRelation?: LinkRelationDraft;
  serviceDescLinkRelation?: LinkRelationDraft;
  serviceMetaLinkRelation?: LinkRelationDraft;
};

type LinkSetDraft = {
  contexts: LinkContextDraft[];
};

const RELATION_CONFIG: {
  key: keyof Omit<LinkContextDraft, "anchor">;
  id: LinkRelationId;
  label: string;
}[] = [
  { key: "serviceDocLinkRelation", id: "service-doc", label: "Service documentation" },
  { key: "serviceDescLinkRelation", id: "service-desc", label: "Service description" },
  { key: "serviceMetaLinkRelation", id: "service-meta", label: "Service metadata" },
];

const createEmptyTarget = (): LinkTargetDraft => ({
  href: "",
  type: "",
  title: "",
});

const createRelation = (id: LinkRelationId): LinkRelationDraft => ({
  id,
  targets: [createEmptyTarget()],
});

const createEmptyContext = (): LinkContextDraft => ({
  anchor: "",
});

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

function parseDraftToLinkSet(draft: LinkSetDraft): { parsed?: LinkSet; errors: string[] } {
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

function AttributeEditor() {
  const [draft, setDraft] = useState<LinkSetDraft>({
    contexts: [createEmptyContext()],
  });

  const conversionResult = useMemo(() => parseDraftToLinkSet(draft), [draft]);

  const updateContext = (contextIndex: number, updater: (context: LinkContextDraft) => LinkContextDraft) => {
    setDraft((previous) => ({
      contexts: previous.contexts.map((context, currentIndex) =>
        currentIndex === contextIndex ? updater(context) : context,
      ),
    }));
  };

  const addContext = () => {
    setDraft((previous) => ({
      contexts: [...previous.contexts, createEmptyContext()],
    }));
  };

  const removeContext = (contextIndex: number) => {
    setDraft((previous) => {
      const nextContexts = previous.contexts.filter((_, currentIndex) => currentIndex !== contextIndex);
      return {
        contexts: nextContexts.length > 0 ? nextContexts : [createEmptyContext()],
      };
    });
  };

  const toggleRelation = (
    contextIndex: number,
    relationKey: keyof Omit<LinkContextDraft, "anchor">,
    relationId: LinkRelationId,
    enabled: boolean,
  ) => {
    updateContext(contextIndex, (context) => ({
      ...context,
      [relationKey]: enabled ? createRelation(relationId) : undefined,
    }));
  };

  const updateRelationTarget = (
    contextIndex: number,
    relationKey: keyof Omit<LinkContextDraft, "anchor">,
    targetIndex: number,
    field: keyof LinkTargetDraft,
    value: string,
  ) => {
    updateContext(contextIndex, (context) => {
      const relation = context[relationKey];
      if (!relation) {
        return context;
      }

      return {
        ...context,
        [relationKey]: {
          ...relation,
          targets: relation.targets.map((target, currentTargetIndex) =>
            currentTargetIndex === targetIndex ? { ...target, [field]: value } : target,
          ),
        },
      };
    });
  };

  const addRelationTarget = (
    contextIndex: number,
    relationKey: keyof Omit<LinkContextDraft, "anchor">,
  ) => {
    updateContext(contextIndex, (context) => {
      const relation = context[relationKey];
      if (!relation) {
        return context;
      }

      return {
        ...context,
        [relationKey]: {
          ...relation,
          targets: [...relation.targets, createEmptyTarget()],
        },
      };
    });
  };

  const removeRelationTarget = (
    contextIndex: number,
    relationKey: keyof Omit<LinkContextDraft, "anchor">,
    targetIndex: number,
  ) => {
    updateContext(contextIndex, (context) => {
      const relation = context[relationKey];
      if (!relation) {
        return context;
      }

      const nextTargets = relation.targets.filter((_, currentTargetIndex) => currentTargetIndex !== targetIndex);

      return {
        ...context,
        [relationKey]: {
          ...relation,
          targets: nextTargets.length > 0 ? nextTargets : [createEmptyTarget()],
        },
      };
    });
  };

  return (
    <Stack spacing={3} sx={{ maxWidth: 1000, mx: "auto", px: 2, py: 3 }}>
      <Typography variant="h4">Attribute Editor</Typography>
      <Typography variant="body1">
        Edit FAIRiCat LinkSet values using input fields. A valid absolute URL is required for each
        context anchor and target href.
      </Typography>

      {draft.contexts.map((context, contextIndex) => (
        <Paper key={`context-${contextIndex}`} sx={{ p: 2 }} variant="outlined">
          <Stack spacing={2}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography variant="h6">Context {contextIndex + 1}</Typography>
              <IconButton
                aria-label={`Remove context ${contextIndex + 1}`}
                color="error"
                onClick={() => removeContext(contextIndex)}
              >
                <Delete />
              </IconButton>
            </Stack>

            <TextField
              fullWidth
              label="Anchor URL"
              value={context.anchor}
              onChange={(event) => {
                const value = event.target.value;
                updateContext(contextIndex, (currentContext) => ({
                  ...currentContext,
                  anchor: value,
                }));
              }}
              placeholder="https://service.example.org"
            />

            <Divider />

            {RELATION_CONFIG.map((relationConfig) => {
              const relation = context[relationConfig.key];

              return (
                <Stack key={relationConfig.id} spacing={1.5} sx={{ pl: 0.5 }}>
                  <Stack direction="row" alignItems="center" justifyContent="space-between">
                    <Typography variant="subtitle1">{relationConfig.label}</Typography>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Typography variant="body2">Enabled</Typography>
                      <Switch
                        checked={Boolean(relation)}
                        onChange={(_, enabled) =>
                          toggleRelation(
                            contextIndex,
                            relationConfig.key,
                            relationConfig.id,
                            enabled,
                          )
                        }
                      />
                    </Stack>
                  </Stack>

                  {relation && (
                    <Stack spacing={1.5}>
                      {relation.targets.map((target, targetIndex) => (
                        <Paper key={`${relation.id}-${targetIndex}`} sx={{ p: 1.5 }} variant="outlined">
                          <Stack spacing={1.5}>
                            <Stack direction="row" justifyContent="space-between" alignItems="center">
                              <Typography variant="body2">Target {targetIndex + 1}</Typography>
                              <IconButton
                                aria-label={`Remove ${relation.id} target ${targetIndex + 1}`}
                                color="error"
                                onClick={() =>
                                  removeRelationTarget(contextIndex, relationConfig.key, targetIndex)
                                }
                              >
                                <Delete fontSize="small" />
                              </IconButton>
                            </Stack>

                            <TextField
                              fullWidth
                              label="Href URL"
                              value={target.href}
                              onChange={(event) =>
                                updateRelationTarget(
                                  contextIndex,
                                  relationConfig.key,
                                  targetIndex,
                                  "href",
                                  event.target.value,
                                )
                              }
                              placeholder="https://service.example.org/openapi"
                            />
                            <TextField
                              fullWidth
                              label="Type (optional)"
                              value={target.type}
                              onChange={(event) =>
                                updateRelationTarget(
                                  contextIndex,
                                  relationConfig.key,
                                  targetIndex,
                                  "type",
                                  event.target.value,
                                )
                              }
                              placeholder="application/json"
                            />
                            <TextField
                              fullWidth
                              label="Title (optional)"
                              value={target.title}
                              onChange={(event) =>
                                updateRelationTarget(
                                  contextIndex,
                                  relationConfig.key,
                                  targetIndex,
                                  "title",
                                  event.target.value,
                                )
                              }
                              placeholder="OpenAPI document"
                            />
                          </Stack>
                        </Paper>
                      ))}

                      <Box>
                        <Button
                          size="small"
                          startIcon={<Add />}
                          onClick={() => addRelationTarget(contextIndex, relationConfig.key)}
                        >
                          Add target
                        </Button>
                      </Box>
                    </Stack>
                  )}
                </Stack>
              );
            })}
          </Stack>
        </Paper>
      ))}

      <Box>
        <Button variant="outlined" startIcon={<Add />} onClick={addContext}>
          Add context
        </Button>
      </Box>

      <Paper variant="outlined" sx={{ p: 2 }}>
        <Stack spacing={1.5}>
          <Typography variant="h6">Validation</Typography>
          {conversionResult.errors.length === 0 ? (
            <Typography color="success.main">LinkSet draft is valid.</Typography>
          ) : (
            <Stack spacing={0.5}>
              {conversionResult.errors.map((error) => (
                <Typography key={error} color="error">
                  {error}
                </Typography>
              ))}
            </Stack>
          )}
        </Stack>
      </Paper>

      <Paper variant="outlined" sx={{ p: 2 }}>
        <Stack spacing={1.5}>
          <Typography variant="h6">LinkSet JSON preview</Typography>
          <Box
            component="pre"
            sx={{
              m: 0,
              p: 1.5,
              borderRadius: 1,
              backgroundColor: "grey.100",
              overflowX: "auto",
              fontSize: 13,
            }}
          >
            {JSON.stringify(
              conversionResult.parsed
                ? conversionResult.parsed
                : {
                    contexts: draft.contexts,
                  },
              null,
              2,
            )}
          </Box>
        </Stack>
      </Paper>
    </Stack>
  );
}

export default AttributeEditor;
