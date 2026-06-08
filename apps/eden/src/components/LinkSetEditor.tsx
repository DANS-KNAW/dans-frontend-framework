import {
  ArrowBackOutlined,
  CheckCircleOutlined,
  CloudUploadOutlined,
  FileUploadOutlined,
  LinkOutlined,
  NoteAddOutlined,
  Add,
} from "@mui/icons-material";
import {
  Alert,
  Box,
  Breadcrumbs,
  Button,
  Card,
  CardActionArea,
  CardContent,
  Chip,
  CircularProgress,
  Paper,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import { useMemo, useState } from "react";
import LinkContextEditorCard from "./linkset-editor/LinkContextEditorCard";
import PreviewPanel from "./linkset-editor/PreviewPanel";
import UploadPanel from "./linkset-editor/UploadPanel";
import ValidationPanel from "./linkset-editor/ValidationPanel";
import {
  createEmptyContext,
  createEmptyTarget,
  createRelation,
  LinkContextDraft,
  LinkContextRelationKey,
  LinkRelationId,
  LinkSetDraft,
  LinkTargetDraft,
} from "./linkset-editor/types";
import {
  parseDraftToLinkSet,
  parseExchangeableLinkSetToDraft,
  toExchangeableLinkSet,
  toExchangeableLinkSetDraft,
} from "./linkset-editor/utils";

export type {
  LinkContext,
  LinkSet,
  LinkTarget,
  ServiceDescLinkRelation,
  ServiceDocLinkRelation,
  ServiceMetaLinkRelation,
} from "./linkset-editor/types";

type Step = "choose" | "import" | "edit";
type ImportTab = "upload" | "url";
type FetchStatus = "idle" | "loading" | "success" | "error";

const createMockFetchedDraft = (urlValue: string): LinkSetDraft => {
  const normalizedUrl = urlValue.trim();
  const anchor = normalizedUrl.length > 0 ? normalizedUrl : "https://service.example.org";

  return {
    contexts: [
      {
        anchor,
        serviceDocLinkRelation: {
          id: "service-doc",
          targets: [
            {
              href: `${anchor.replace(/\/$/, "")}/docs`,
              type: "text/html",
              title: "Service documentation",
            },
          ],
        },
      },
    ],
  };
};

function LinkSetEditor() {
  const [currentStep, setCurrentStep] = useState<Step>("choose");
  const [activeTab, setActiveTab] = useState<ImportTab>("upload");
  const [urlValue, setUrlValue] = useState<string>("");
  const [fetchStatus, setFetchStatus] = useState<FetchStatus>("idle");

  const [draft, setDraft] = useState<LinkSetDraft>({
    contexts: [createEmptyContext()],
  });

  const [importedDraft, setImportedDraft] = useState<LinkSetDraft | null>(null);
  const [importedFilename, setImportedFilename] = useState<string>("");
  const [importSource, setImportSource] = useState<"upload" | "url" | null>(null);
  const [importStepError, setImportStepError] = useState<string>("");

  const [uploadSuccessMessage, setUploadSuccessMessage] = useState<string>("");
  const [uploadError, setUploadError] = useState<string>("");
  const [urlSuccessMessage, setUrlSuccessMessage] = useState<string>("");
  const [urlErrorMessage, setUrlErrorMessage] = useState<string>("");

  const [cameFromImport, setCameFromImport] = useState<boolean>(false);

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
    link.download = "fairicat-linkset.json";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(objectUrl);
  };

  const handleUploadFile = async (file: File) => {
    setUploadError("");
    setUploadSuccessMessage("");
    setImportStepError("");

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

      setImportedDraft(parsedDraft.draft);
      setImportedFilename(file.name);
      setImportSource("upload");
      setUploadSuccessMessage(`Uploaded: ${file.name}`);
    } catch {
      setUploadError("Unable to read the file. Ensure it is valid JSON.");
    }
  };

  const handleFetchFromUrl = async () => {
    setFetchStatus("loading");
    setUrlErrorMessage("");
    setUrlSuccessMessage("");
    setImportStepError("");

    const value = urlValue.trim();
    if (!value) {
      setFetchStatus("error");
      setUrlErrorMessage("Enter a URL before fetching.");
      return;
    }

    await new Promise((resolve) => {
      window.setTimeout(resolve, 1000);
    });

    const safeName = value
      .replace(/^https?:\/\//, "")
      .replace(/[^a-zA-Z0-9.-]/g, "-")
      .slice(0, 48);
    const resolvedFilename = `${safeName || "fairicat-linkset"}.json`;

    setImportedDraft(createMockFetchedDraft(value));
    setImportedFilename(resolvedFilename);
    setImportSource("url");
    setUrlSuccessMessage(`Demo loaded (fake data): ${resolvedFilename}`);
    setFetchStatus("success");
  };

  const startFromScratch = () => {
    setDraft({ contexts: [createEmptyContext()] });
    setCurrentStep("edit");
    setCameFromImport(false);
    setImportStepError("");
  };

  const goToImportStep = () => {
    setCurrentStep("import");
    setImportStepError("");
  };

  const applyImportAndEdit = () => {
    if (!importedDraft) {
      setImportStepError("Import a file or fetch from URL before continuing.");
      return;
    }

    setDraft(importedDraft);
    setCurrentStep("edit");
    setCameFromImport(true);
    setImportStepError("");
  };

  const resetFlow = () => {
    setCurrentStep("choose");
    setActiveTab("upload");
    setUrlValue("");
    setFetchStatus("idle");
    setDraft({ contexts: [createEmptyContext()] });
    setImportedDraft(null);
    setImportedFilename("");
    setImportSource(null);
    setImportStepError("");
    setUploadSuccessMessage("");
    setUploadError("");
    setUrlSuccessMessage("");
    setUrlErrorMessage("");
    setCameFromImport(false);
  };

  const renderBreadcrumbs = () => {
    if (currentStep === "choose") {
      return null;
    }

    return (
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Breadcrumbs aria-label="LinkSet flow breadcrumbs">
          <Typography color="text.primary">New LinkSet</Typography>
          {(currentStep === "import" || cameFromImport) && (
            <Typography color="text.primary">Import</Typography>
          )}
          {currentStep === "edit" && <Typography color="text.primary">Edit</Typography>}
        </Breadcrumbs>
        <Button size="small" onClick={resetFlow} startIcon={<ArrowBackOutlined />}>
          Start over
        </Button>
      </Stack>
    );
  };

  const updateContext = (
    contextIndex: number,
    updater: (context: LinkContextDraft) => LinkContextDraft,
  ) => {
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
      const nextContexts = previous.contexts.filter(
        (_, currentIndex) => currentIndex !== contextIndex,
      );
      return {
        contexts: nextContexts.length > 0 ? nextContexts : [createEmptyContext()],
      };
    });
  };

  const toggleRelation = (
    contextIndex: number,
    relationKey: LinkContextRelationKey,
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
    relationKey: LinkContextRelationKey,
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

  const addRelationTarget = (contextIndex: number, relationKey: LinkContextRelationKey) => {
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
    relationKey: LinkContextRelationKey,
    targetIndex: number,
  ) => {
    updateContext(contextIndex, (context) => {
      const relation = context[relationKey];
      if (!relation) {
        return context;
      }

      const nextTargets = relation.targets.filter(
        (_, currentTargetIndex) => currentTargetIndex !== targetIndex,
      );

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
      {renderBreadcrumbs()}

      {currentStep === "choose" && (
        <>
          <Typography variant="h4">Edit or create your LinkSet</Typography>
          <Typography variant="body1">
            Choose how to edit or create your FAIRiCat LinkSet.
            <br/>
            With a {" "}
            <a href="https://signposting.org/FAIRiCat" target="_blank" rel="noreferrer">
              FAIRiCat LinkSet
            </a>
            {" "} repositories can advertise the interoperability affordances (services)
            they provide.
          </Typography>

          <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
            <Card variant="outlined" sx={{ flex: 1 }}>
              <CardActionArea onClick={startFromScratch} sx={{ height: "100%" }}>
                <CardContent>
                  <Stack spacing={1.5}>
                    <NoteAddOutlined color="primary" />
                    <Typography variant="h6">Start new from scratch</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Open an empty editor and create a new LinkSet manually.
                    </Typography>
                  </Stack>
                </CardContent>
              </CardActionArea>
            </Card>

            <Card variant="outlined" sx={{ flex: 1 }}>
              <CardActionArea onClick={goToImportStep} sx={{ height: "100%" }}>
                <CardContent>
                  <Stack spacing={1.5}>
                    <FileUploadOutlined color="primary" />
                    <Typography variant="h6">Import a file</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Import an existing LinkSet from upload or URL, then continue editing.
                    </Typography>
                  </Stack>
                </CardContent>
              </CardActionArea>
            </Card>
          </Stack>
        </>
      )}

      {currentStep === "import" && (
        <>
          <Typography variant="h4">Import LinkSet</Typography>

          <Paper variant="outlined" sx={{ p: 2 }}>
            <Stack spacing={2}>
              <Tabs
                value={activeTab}
                onChange={(_, value: ImportTab) => {
                  setActiveTab(value);
                  setImportStepError("");
                }}
              >
                <Tab
                  value="upload"
                  icon={<CloudUploadOutlined fontSize="small" />}
                  iconPosition="start"
                  label="Upload"
                />
                <Tab
                  value="url"
                  icon={<LinkOutlined fontSize="small" />}
                  iconPosition="start"
                  label="URL"
                />
              </Tabs>

              {activeTab === "upload" ? (
                <UploadPanel
                  onFileSelected={handleUploadFile}
                  uploadSuccessMessage={uploadSuccessMessage}
                  uploadError={uploadError}
                />
              ) : (
                <Stack spacing={2}>
                  <Alert severity="info">
                    Demo mode: URL import currently uses fake data and does not fetch remote JSON yet.
                  </Alert>
                  <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
                    <TextField
                      fullWidth
                      label="LinkSet URL"
                      placeholder="https://example.org/linkset.json"
                      value={urlValue}
                      onChange={(event) => {
                        setUrlValue(event.target.value);
                        if (fetchStatus !== "idle") {
                          setFetchStatus("idle");
                        }
                        setUrlErrorMessage("");
                        setUrlSuccessMessage("");
                      }}
                    />
                    <Button
                      variant="outlined"
                      onClick={handleFetchFromUrl}
                      disabled={fetchStatus === "loading"}
                    >
                      {fetchStatus === "loading" ? (
                        <Stack direction="row" spacing={1} alignItems="center">
                          <CircularProgress size={16} />
                          <span>Fetching</span>
                        </Stack>
                      ) : (
                        "Fetch"
                      )}
                    </Button>
                  </Stack>

                  {urlSuccessMessage && <Alert severity="success">{urlSuccessMessage}</Alert>}
                  {urlErrorMessage && <Alert severity="error">{urlErrorMessage}</Alert>}
                </Stack>
              )}

              {importedFilename && importSource && (
                <Alert severity="success">
                  Ready to import: {importedFilename} ({importSource === "upload" ? "upload" : "URL demo"})
                </Alert>
              )}

              {importStepError && <Alert severity="error">{importStepError}</Alert>}
            </Stack>
          </Paper>

          <Stack direction="row" justifyContent="space-between">
            <Button onClick={resetFlow} startIcon={<ArrowBackOutlined />}>
              Cancel
            </Button>
            <Button variant="contained" onClick={applyImportAndEdit}>
              Import & edit
            </Button>
          </Stack>
        </>
      )}

      {currentStep === "edit" && (
        <>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Typography variant="h4">FAIRiCat LinkSet Editor</Typography>
            {cameFromImport && (
              <Chip
                color="success"
                icon={<CheckCircleOutlined />}
                label="Imported"
                size="small"
              />
            )}
          </Stack>

          <Typography variant="body1">
            A valid absolute URL (link anchor) is required for each service and its added links.
          </Typography>

          <Paper variant="outlined" sx={{ p: 2 }}>
            <Stack spacing={2}>
              {draft.contexts.map((context, contextIndex) => (
                <LinkContextEditorCard
                  key={`context-${contextIndex}`}
                  context={context}
                  contextIndex={contextIndex}
                  onRemoveContext={removeContext}
                  onUpdateAnchor={(index, value) =>
                    updateContext(index, (currentContext) => ({
                      ...currentContext,
                      anchor: value,
                    }))
                  }
                  onToggleRelation={toggleRelation}
                  onUpdateRelationTarget={updateRelationTarget}
                  onAddRelationTarget={addRelationTarget}
                  onRemoveRelationTarget={removeRelationTarget}
                />
              ))}

              <Box>
                <Button variant="outlined" startIcon={<Add />} onClick={addContext}>
                  Add service
                </Button>
              </Box>
            </Stack>
          </Paper>

          <ValidationPanel errors={conversionResult.errors} />

          <PreviewPanel preview={exchangeablePreview} onDownload={downloadExchangeableJson} />

          <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" spacing={1.5}>
            <Button onClick={resetFlow} startIcon={<ArrowBackOutlined />}>
              Start over
            </Button>
            <Stack direction="row" spacing={1}>
              {/* Disabled until persistence endpoints are implemented. */}
              <Button variant="outlined" disabled>
                Save draft
              </Button>
              <Button variant="contained" disabled>
                Store
              </Button>
            </Stack>
          </Stack>
        </>
      )}
    </Stack>
  );
}

export default LinkSetEditor;
