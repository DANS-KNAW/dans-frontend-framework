import { Add, Delete, HelpOutline } from "@mui/icons-material";
import {
  Alert,
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
import { ChangeEvent, DragEvent, useMemo, useRef, useState } from "react";
import { Tooltip } from "@mui/material";

/**
 * AttributeEditor
 * It will be implemented as a FAIRiCat Linkset editor for the services
 */

export type LinkTarget = {
  href: URL;
  type?: string;
  title?: string;
};

export type ServiceDescLinkRelation = {
  id: "service-desc";
  targets: LinkTarget[];
};

export type ServiceDocLinkRelation = {
  id: "service-doc";
  targets: LinkTarget[];
};


export type ServiceMetaLinkRelation = {
  id: "service-meta";
  targets: LinkTarget[];
};

export type LinkContext = {
  anchor: URL;
  serviceDescLinkRelation?: ServiceDescLinkRelation;
  serviceDocLinkRelation?: ServiceDocLinkRelation;
  serviceMetaLinkRelation?: ServiceMetaLinkRelation;
};

export type LinkSet = {
  contexts: LinkContext[];
};

type LinkRelationId = "service-desc" | "service-doc" | "service-meta";

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
  serviceDescLinkRelation?: LinkRelationDraft;
  serviceDocLinkRelation?: LinkRelationDraft;
  serviceMetaLinkRelation?: LinkRelationDraft;
};

type LinkSetDraft = {
  contexts: LinkContextDraft[];
};

// The 'Exchangeable' types are needed to translate the internal JSON structure to a FAIRiCat Linkset JSON structure

type ExchangeableLink = {
  href: string;
  type?: string;
  title?: string;
};

type ExchangeableLinkContext = {
  anchor: string;
  "service-desc"?: ExchangeableLink[];
  "service-doc"?: ExchangeableLink[];
  "service-meta"?: ExchangeableLink[];
};

type ExchangeableLinkSet = {
  linkset: ExchangeableLinkContext[];
};

const RELATION_CONFIG: {
  key: keyof Omit<LinkContextDraft, "anchor">;
  id: LinkRelationId;
  label: string;
  helpText: string;
}[] = [
  { key: "serviceDescLinkRelation", id: "service-desc", label: "Description", helpText: "Provide a machine-readable description of the service" },
  { key: "serviceDocLinkRelation", id: "service-doc", label: "Documentation", helpText: "Provide human-readable information about the service's documentation" },
  { key: "serviceMetaLinkRelation", id: "service-meta", label: "Metadata", helpText: "Provide further information about the service" },
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

function toExchangeableLinkSet(linkSet: LinkSet): ExchangeableLinkSet {
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

function toExchangeableLinkSetDraft(draft: LinkSetDraft): ExchangeableLinkSet {
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

function parseExchangeableLinkSetToDraft(input: unknown): { draft?: LinkSetDraft; error?: string } {
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

function LinkSetEditor() {
  const [draft, setDraft] = useState<LinkSetDraft>({
    contexts: [createEmptyContext()],
  });
  const [uploadSuccessMessage, setUploadSuccessMessage] = useState<string>("");
  const [uploadError, setUploadError] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const conversionResult = useMemo(() => parseDraftToLinkSet(draft), [draft]);
  const exchangeablePreview = useMemo(
    () =>
      conversionResult.parsed
        ? toExchangeableLinkSet(conversionResult.parsed)
        : toExchangeableLinkSetDraft(draft),
    [conversionResult.parsed, draft],
  );

  const downloadExchangeableJson = () => {
    const payload = JSON.stringify(exchangeablePreview, null, 2);
    const blob = new Blob([payload], { type: "application/json" });
    const objectUrl = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = objectUrl;
    link.download = "exchangeable-linkset.json";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(objectUrl);
  };

  const handleUploadFile = async (file: File) => {
    setUploadError("");
    setUploadSuccessMessage("");

    if (!file.name.toLowerCase().endsWith(".json")) {
      setUploadError("Please upload a .json file.");
      return;
    }

    try {
      const text = await file.text();
      const parsedJson: unknown = JSON.parse(text);
      const parsedDraft = parseExchangeableLinkSetToDraft(parsedJson);

      if (parsedDraft.error || !parsedDraft.draft) {
        setUploadError(parsedDraft.error ?? "Unable to parse the uploaded JSON file.");
        return;
      }

      setDraft(parsedDraft.draft);
      setUploadSuccessMessage(`Uploaded: ${file.name}`);
    } catch {
      setUploadError("Unable to read the file. Ensure it is valid JSON.");
    }
  };

  const onFileInputChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    await handleUploadFile(file);
    event.target.value = "";
  };

  const onDropUpload = async (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files?.[0];
    if (!file) {
      return;
    }

    await handleUploadFile(file);
  };

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
      <Typography variant="h4">FAIRiCat LinkSet Editor</Typography>
      <Typography variant="body1">
        Create or Edit a <a href="https://signposting.org/FAIRiCat" target="_blank" rel="noreferrer">FAIRiCat LinkSet</a> 
        , which repositories can use to advertise the interoperability affordances (services)they provide. 
        <br />
        A valid absolute URL is required for each service and its added links. 
      </Typography>

      <Paper variant="outlined" sx={{ p: 2 }}>
        <Stack spacing={1.5}>
          <Typography variant="h6">Upload FAIRiCat LinkSet JSON</Typography>
          <Box
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(event) => event.preventDefault()}
            onDrop={onDropUpload}
            sx={{
              border: "2px dashed",
              borderColor: "divider",
              borderRadius: 1,
              p: 3,
              textAlign: "center",
              cursor: "pointer",
              backgroundColor: "grey.50",
            }}
          >
            <Typography variant="body1">Drag and drop a .json file here, or click to browse.</Typography>
          </Box>
          <input
            ref={fileInputRef}
            type="file"
            hidden
            accept=".json,application/json"
            onChange={onFileInputChange}
          />
          {uploadSuccessMessage && <Alert severity="success">{uploadSuccessMessage}</Alert>}
          {uploadError && <Alert severity="error">{uploadError}</Alert>}
        </Stack>
      </Paper>

      {draft.contexts.map((context, contextIndex) => (
        <Paper key={`context-${contextIndex}`} sx={{ p: 2 }} variant="outlined">
          <Stack spacing={2}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography variant="h6">Service {contextIndex + 1}</Typography>
              <IconButton
                aria-label={`Remove service ${contextIndex + 1}`}
                color="error"
                onClick={() => removeContext(contextIndex)}
              >
                <Delete />
              </IconButton>
            </Stack>

            <Stack direction="row" alignItems="center" spacing={1}>
              <TextField
                fullWidth
                label="URL"
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
              <Tooltip title="Enter the service's base URL; the LinkSet 'anchor' (e.g., https://example.org)">
                <HelpOutline fontSize="small" sx={{ ml: 1, cursor: "pointer" }} />
              </Tooltip>
            </Stack>

            <Divider />

            {RELATION_CONFIG.map((relationConfig) => {
              const relation = context[relationConfig.key];

              return (
                <Stack key={relationConfig.id} spacing={1.5} sx={{ pl: 0.5 }}>
                  <Stack direction="row" alignItems="center" justifyContent="space-between">
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Typography variant="subtitle1">{relationConfig.label}</Typography>
                      <Tooltip title={`${relationConfig.helpText}`}>
                        <HelpOutline fontSize="small" sx={{ cursor: "pointer" }} />
                      </Tooltip>
                    </Stack>
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
                              <Typography variant="body2">Link {targetIndex + 1}</Typography>
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

                            <Stack direction="row" alignItems="center" spacing={1}>
                              <TextField
                                fullWidth
                                label="URL"
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
                              <Tooltip title="Provide the link's URL (e.g., https://example.org/openapi)">
                                <HelpOutline fontSize="small" sx={{ ml: 1, cursor: "pointer" }} />
                              </Tooltip>
                            </Stack>

                            <Stack direction="row" alignItems="center" spacing={1}>
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
                              <Tooltip title="Specify the MIME type (e.g., application/json)">
                                <HelpOutline fontSize="small" sx={{ ml: 1, cursor: "pointer" }} />
                              </Tooltip>
                            </Stack>

                            <Stack direction="row" alignItems="center" spacing={1}>
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
                              <Tooltip title="Provide a descriptive title for the link (e.g., OpenAPI document)">
                                <HelpOutline fontSize="small" sx={{ ml: 1, cursor: "pointer" }} />
                              </Tooltip>
                            </Stack>
                          </Stack>
                        </Paper>
                      ))}

                      <Box>
                        <Button
                          size="small"
                          startIcon={<Add />}
                          onClick={() => addRelationTarget(contextIndex, relationConfig.key)}
                        >
                          Add Link
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
          Add service 
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
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">Linkset preview; Exchangeable as FAIRiCat Linkset JSON</Typography>
            <Button variant="outlined" onClick={downloadExchangeableJson}>
              Download Linkset JSON
            </Button>
          </Stack>
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
            {JSON.stringify(exchangeablePreview, null, 2)}
          </Box>
        </Stack>
      </Paper>
    </Stack>
  );
}

export default LinkSetEditor;
