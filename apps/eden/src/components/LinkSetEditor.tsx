import { Add } from "@mui/icons-material";
import { Box, Button, Stack, Typography } from "@mui/material";
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

function LinkSetEditor() {
  const [draft, setDraft] = useState<LinkSetDraft>({
    contexts: [createEmptyContext()],
  });
  const [uploadSuccessMessage, setUploadSuccessMessage] = useState<string>("");
  const [uploadError, setUploadError] = useState<string>("");

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
      <Typography variant="h4">FAIRiCat LinkSet Editor</Typography>
      <Typography variant="body1">
        Create or Edit a
        {" "}
        <a href="https://signposting.org/FAIRiCat" target="_blank" rel="noreferrer">
          FAIRiCat LinkSet
        </a>
        , which repositories can use to advertise the interoperability affordances (services)
        they provide.
        <br />
        A valid absolute URL (link anchor) is required for each service and its added links.
      </Typography>

      <UploadPanel
        onFileSelected={handleUploadFile}
        uploadSuccessMessage={uploadSuccessMessage}
        uploadError={uploadError}
      />

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

      <ValidationPanel errors={conversionResult.errors} />

      <PreviewPanel preview={exchangeablePreview} onDownload={downloadExchangeableJson} />
    </Stack>
  );
}

export default LinkSetEditor;
