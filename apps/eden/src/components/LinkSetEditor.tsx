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
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Paper,
  Stack,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import LinkContextEditorCard from "./linkset-editor/LinkContextEditorCard";
import PreviewPanel from "./linkset-editor/PreviewPanel";
import UploadPanel from "./linkset-editor/UploadPanel";
import UrlInput from "./linkset-editor/UrlInput";
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

function LinkSetEditor() {
  const { t } = useTranslation('linkset-editor');
  const [currentStep, setCurrentStep] = useState<Step>("choose");
  const [activeTab, setActiveTab] = useState<ImportTab>("upload");
  const [urlValue, setUrlValue] = useState<string>("");
  const [fetchStatus, setFetchStatus] = useState<FetchStatus>("idle");

  const [draft, setDraft] = useState<LinkSetDraft>({
    contexts: [createEmptyContext()],
  });

  // Could use useReducer grouping all import-related state, but maybe later on after more refactoring
  const [importedDraft, setImportedDraft] = useState<LinkSetDraft | null>(null);
  const [importedFilename, setImportedFilename] = useState<string>("");
  const [importSource, setImportSource] = useState<"upload" | "url" | null>(null);
  const [importStepError, setImportStepError] = useState<string>("");

  const [uploadSuccessMessage, setUploadSuccessMessage] = useState<string>("");
  const [uploadError, setUploadError] = useState<string>("");
  const [urlSuccessMessage, setUrlSuccessMessage] = useState<string>("");
  const [urlErrorMessage, setUrlErrorMessage] = useState<string>("");
  const [confirmDialogMessage, setConfirmDialogMessage] = useState<string>("");
  const [pendingConfirmAction, setPendingConfirmAction] = useState<(() => void) | null>(null);

  const [cameFromImport, setCameFromImport] = useState<boolean>(false);
  const canApplyImport = Boolean(importedDraft && importedFilename && importSource);
  const isConfirmDialogOpen = Boolean(pendingConfirmAction);

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
    setImportedDraft(null);
    setImportedFilename("");
    setImportSource(null);

    if (!file.name.toLowerCase().endsWith(".json")) {
      setUploadError(t('uploadPanel.errorNoJson'));
      return;
    }

    try {
      const text = await file.text();
      const parsedJson: unknown = JSON.parse(text);
      const parsedDraft = parseExchangeableLinkSetToDraft(parsedJson);

      if (parsedDraft.error || !parsedDraft.draft) {
        setUploadError(parsedDraft.error ?? t('uploadPanel.errorParseFailed'));
        return;
      }

      setImportedDraft(parsedDraft.draft);
      setImportedFilename(file.name);
      setImportSource("upload");
      setUploadSuccessMessage(t('importStep.uploadedSuccess', { filename: file.name }));
    } catch {
      setUploadError(t('uploadPanel.errorReadFailed'));
    }
  };

  const handleFetchFromUrl = async () => {
    setFetchStatus("loading");
    setUrlErrorMessage("");
    setUrlSuccessMessage("");
    setImportStepError("");
    setImportedDraft(null);
    setImportedFilename("");
    setImportSource(null);

    const value = urlValue.trim();
    if (!value) {
      setFetchStatus("error");
      setUrlErrorMessage(t('importStep.urlRequired'));
      return;
    }

    try {
      // application/linkset+json is the official one 
      // but allow application/json as well for flexibility
      const response = await fetch(value, {
        headers: {
          Accept: "application/linkset+json, application/json",
        },
      });

      if (!response.ok) {
        setFetchStatus("error");
        setUrlErrorMessage(
          t('importStep.fetchFailed', {
            status: response.status,
            statusText: response.statusText,
          }),
        );
        return;
      }

      const payload = (await response.json()) as unknown;
      const parsedDraft = parseExchangeableLinkSetToDraft(payload);

      if (parsedDraft.error || !parsedDraft.draft) {
        setFetchStatus("error");
        setUrlErrorMessage(parsedDraft.error ?? t('importStep.fetchParseFailed'));
        return;
      }

      const safeName = value
        .replace(/^https?:\/\//, "")
        .replace(/[^a-zA-Z0-9.-]/g, "-")
        .slice(0, 48);
      const resolvedFilename = `${safeName || "fairicat-linkset"}.json`;

      setImportedDraft(parsedDraft.draft);
      setImportedFilename(resolvedFilename);
      setImportSource("url");
      setUrlSuccessMessage(t('importStep.loadedFromUrl', { filename: resolvedFilename }));
      setFetchStatus("success");
    } catch {
      setFetchStatus("error");
      setUrlErrorMessage(t('importStep.fetchFailedGeneric'));
    }
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
      setImportStepError(t('importStep.importRequiresData'));
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
          <Typography color="text.primary">{t('breadcrumbs.newLinkSet')}</Typography>
          {(currentStep === "import" || cameFromImport) && (
            <Typography color="text.primary">{t('breadcrumbs.import')}</Typography>
          )}
          {currentStep === "edit" && <Typography color="text.primary">{t('breadcrumbs.edit')}</Typography>}
        </Breadcrumbs>
        <Button size="small" onClick={resetFlow} startIcon={<ArrowBackOutlined />}>
          {t('editStep.startOver')}
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

  const requestDeletionConfirmation = (message: string, onConfirm: () => void) => {
    setConfirmDialogMessage(message);
    setPendingConfirmAction(() => onConfirm);
  };

  const closeConfirmDialog = () => {
    setPendingConfirmAction(null);
    setConfirmDialogMessage("");
  };

  const confirmDialogAction = () => {
    if (pendingConfirmAction) {
      pendingConfirmAction();
    }
    closeConfirmDialog();
  };

  const performRemoveContext = (contextIndex: number) => {
    setDraft((previous) => {
      const nextContexts = previous.contexts.filter(
        (_, currentIndex) => currentIndex !== contextIndex,
      );
      return {
        contexts: nextContexts.length > 0 ? nextContexts : [createEmptyContext()],
      };
    });
  };

  const performToggleRelation = (
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

  const performRemoveRelationTarget = (
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

  const removeContext = (contextIndex: number) => {
    const contextToRemove = draft.contexts[contextIndex];
    const hasContextInput = Boolean(
      contextToRemove &&
        (
          contextToRemove.anchor.trim() ||
          contextToRemove.serviceDescLinkRelation?.targets.some(
            (target) => target.href.trim() || target.type.trim() || target.title.trim(),
          ) ||
          contextToRemove.serviceDocLinkRelation?.targets.some(
            (target) => target.href.trim() || target.type.trim() || target.title.trim(),
          ) ||
          contextToRemove.serviceMetaLinkRelation?.targets.some(
            (target) => target.href.trim() || target.type.trim() || target.title.trim(),
          )
        ),
    );

    if (hasContextInput) {
      requestDeletionConfirmation(t("service.confirmDeleteWithInput"), () =>
        performRemoveContext(contextIndex),
      );
      return;
    }

    performRemoveContext(contextIndex);
  };

  const toggleRelation = (
    contextIndex: number,
    relationKey: LinkContextRelationKey,
    relationId: LinkRelationId,
    enabled: boolean,
  ) => {
    if (!enabled) {
      const relation = draft.contexts[contextIndex]?.[relationKey];
      const hasRelationInput = relation?.targets.some(
        (target) =>
          target.href.trim() || target.type.trim() || target.title.trim(),
      );

      if (hasRelationInput) {
        requestDeletionConfirmation(t("relations.confirmDisableWithInput"), () =>
          performToggleRelation(contextIndex, relationKey, relationId, enabled),
        );
        return;
      }
    }

    performToggleRelation(contextIndex, relationKey, relationId, enabled);
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
    const relation = draft.contexts[contextIndex]?.[relationKey];
    const targetToRemove = relation?.targets[targetIndex];
    const hasTargetInput = Boolean(
      targetToRemove &&
        (targetToRemove.href.trim() ||
          targetToRemove.type.trim() ||
          targetToRemove.title.trim()),
    );

    if (hasTargetInput) {
      requestDeletionConfirmation(t("relations.confirmDeleteTargetWithInput"), () =>
        performRemoveRelationTarget(contextIndex, relationKey, targetIndex),
      );
      return;
    }

    performRemoveRelationTarget(contextIndex, relationKey, targetIndex);
  };

  return (
    <Stack spacing={3} sx={{ maxWidth: 1000, mx: "auto", px: 2, py: 3 }}>
      {renderBreadcrumbs()}

      {currentStep === "choose" && (
        <>
          <Typography variant="h4">{t('chooseStep.heading')}</Typography>
          <Typography variant="body1">
            {t('chooseStep.description')}
            <br/>
            {t('chooseStep.fairiCatIntro')}
          </Typography>

          <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
            <Card variant="outlined" sx={{ flex: 1 }}>
              <CardActionArea onClick={startFromScratch} sx={{ height: "100%" }}>
                <CardContent>
                  <Stack spacing={1.5}>
                    <NoteAddOutlined color="primary" />
                    <Typography variant="h6">{t('chooseStep.scratch.title')}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {t('chooseStep.scratch.description')}
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
                    <Typography variant="h6">{t('chooseStep.import.title')}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {t('chooseStep.import.description')}
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
          <Typography variant="h4">{t('importStep.heading')}</Typography>

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
                  label={t('importStep.uploadTab')}
                />
                <Tab
                  value="url"
                  icon={<LinkOutlined fontSize="small" />}
                  iconPosition="start"
                  label={t('importStep.urlTab')}
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
                    {t('importStep.urlDemoAlert')}
                  </Alert>
                  <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
                    <Box sx={{ flex: 1 }}>
                      <UrlInput
                        value={urlValue}
                        onChange={(value) => {
                          setUrlValue(value);
                          if (fetchStatus !== "idle") {
                            setFetchStatus("idle");
                          }
                          setUrlErrorMessage("");
                          setUrlSuccessMessage("");
                        }}
                        onConfirmed={() => {
                          // Reachability feedback is already shown inside UrlInput.
                        }}
                        enableUrlCheck={false}
                      />
                    </Box>
                    <Button
                      variant="contained"
                      color="primary"
                      startIcon={<LinkOutlined />}
                      onClick={handleFetchFromUrl}
                      disabled={fetchStatus === "loading"}
                      sx={{ fontWeight: 600 }}
                    >
                      {fetchStatus === "loading" ? (
                        <Stack direction="row" spacing={1} alignItems="center">
                          <CircularProgress size={16} />
                          <span>{t('importStep.fetching')}</span>
                        </Stack>
                      ) : (
                        t('importStep.fetchButton')
                      )}
                    </Button>
                  </Stack>

                  {urlSuccessMessage && <Alert severity="success">{urlSuccessMessage}</Alert>}
                  {urlErrorMessage && <Alert severity="error">{urlErrorMessage}</Alert>}
                </Stack>
              )}

              {importedFilename && importSource && (
                <Alert severity="success">
                  {t('importStep.readyToImport', {
                    filename: importedFilename,
                    source: importSource === "upload" ? t('importStep.uploadSource') : t('importStep.urlSource')
                  })}
                </Alert>
              )}

              {importStepError && <Alert severity="error">{importStepError}</Alert>}
            </Stack>
          </Paper>

          <Stack direction="row" justifyContent="space-between">
            <Button onClick={resetFlow} startIcon={<ArrowBackOutlined />}>
              {t('importStep.cancel')}
            </Button>
            <Button variant="contained" onClick={applyImportAndEdit} disabled={!canApplyImport}>
              {t('importStep.importAndEdit')}
            </Button>
          </Stack>
        </>
      )}

      {currentStep === "edit" && (
        <>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Typography variant="h4">{t('editStep.heading')}</Typography>
            {cameFromImport && (
              <Chip
                color="success"
                icon={<CheckCircleOutlined />}
                label={t('editStep.imported')}
                size="small"
              />
            )}
          </Stack>

          <Typography variant="body1">
            {t('editStep.anchorDescription')}
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
                  {t('editStep.addService')}
                </Button>
              </Box>
            </Stack>
          </Paper>

          <ValidationPanel errors={conversionResult.errors} />

          <PreviewPanel preview={exchangeablePreview} onDownload={downloadExchangeableJson} />

          <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" spacing={1.5}>
            <Button onClick={resetFlow} startIcon={<ArrowBackOutlined />}>
              {t('editStep.startOver')}
            </Button>
            <Stack direction="row" spacing={1}>
              {/* Disabled until persistence endpoints are implemented. */}
              <Button variant="outlined" disabled>
                {t('editStep.saveDraft')}
              </Button>
              <Button variant="contained" disabled>
                {t('editStep.store')}
              </Button>
            </Stack>
          </Stack>
        </>
      )}

      <Dialog
        open={isConfirmDialogOpen}
        onClose={closeConfirmDialog}
        aria-labelledby="delete-confirmation-dialog-title"
      >
        <DialogTitle id="delete-confirmation-dialog-title">
          {t("confirmDialog.title")}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>{confirmDialogMessage}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeConfirmDialog}>{t("confirmDialog.cancel")}</Button>
          <Button color="error" variant="contained" onClick={confirmDialogAction}>
            {t("confirmDialog.confirm")}
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
}

export default LinkSetEditor;
