import { Add, Delete, HelpOutline } from "@mui/icons-material";
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
import { Tooltip } from "@mui/material";
import {
  LinkContextDraft,
  LinkContextRelationKey,
  LinkRelationId,
  LinkTargetDraft,
  RELATION_CONFIG,
} from "./types";
import UrlInput from "./UrlInput";

type LinkContextEditorCardProps = {
  context: LinkContextDraft;
  contextIndex: number;
  onRemoveContext: (contextIndex: number) => void;
  onUpdateAnchor: (contextIndex: number, value: string) => void;
  onToggleRelation: (
    contextIndex: number,
    relationKey: LinkContextRelationKey,
    relationId: LinkRelationId,
    enabled: boolean,
  ) => void;
  onUpdateRelationTarget: (
    contextIndex: number,
    relationKey: LinkContextRelationKey,
    targetIndex: number,
    field: keyof LinkTargetDraft,
    value: string,
  ) => void;
  onAddRelationTarget: (contextIndex: number, relationKey: LinkContextRelationKey) => void;
  onRemoveRelationTarget: (
    contextIndex: number,
    relationKey: LinkContextRelationKey,
    targetIndex: number,
  ) => void;
};

function LinkContextEditorCard({
  context,
  contextIndex,
  onRemoveContext,
  onUpdateAnchor,
  onToggleRelation,
  onUpdateRelationTarget,
  onAddRelationTarget,
  onRemoveRelationTarget,
}: LinkContextEditorCardProps) {
  const handleAnchorConfirmed = () => {
    // Confirmation metadata is currently handled inside UrlInput.
  };

  const handleTargetConfirmed = () => {
    // Confirmation metadata is currently handled inside UrlInput.
  };

  return (
    <Paper sx={{ p: 2 }} variant="outlined">
      <Stack spacing={2}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">Service {contextIndex + 1}</Typography>
          <IconButton
            aria-label={`Remove service ${contextIndex + 1}`}
            color="error"
            onClick={() => onRemoveContext(contextIndex)}
          >
            <Delete />
          </IconButton>
        </Stack>

        <Stack direction="row" alignItems="center" spacing={1}>
          <Box sx={{ flex: 1 }}>
            <UrlInput
              value={context.anchor}
              onChange={(value) => onUpdateAnchor(contextIndex, value)}
              onConfirmed={handleAnchorConfirmed}
              enableUrlCheck={false}
            />
          </Box>
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
                  <Tooltip title={relationConfig.helpText}>
                    <HelpOutline fontSize="small" sx={{ cursor: "pointer" }} />
                  </Tooltip>
                </Stack>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Typography variant="body2">Enabled</Typography>
                  <Switch
                    checked={Boolean(relation)}
                    onChange={(_, enabled) =>
                      onToggleRelation(
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
                              onRemoveRelationTarget(contextIndex, relationConfig.key, targetIndex)
                            }
                          >
                            <Delete fontSize="small" />
                          </IconButton>
                        </Stack>

                        <Stack direction="row" alignItems="center" spacing={1}>
                          <Box sx={{ flex: 1 }}>
                            <UrlInput
                              value={target.href}
                              onChange={(value) =>
                                onUpdateRelationTarget(
                                  contextIndex,
                                  relationConfig.key,
                                  targetIndex,
                                  "href",
                                  value,
                                )
                              }
                              onConfirmed={handleTargetConfirmed}
                            />
                          </Box>
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
                              onUpdateRelationTarget(
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
                              onUpdateRelationTarget(
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
                      onClick={() => onAddRelationTarget(contextIndex, relationConfig.key)}
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
  );
}

export default LinkContextEditorCard;
