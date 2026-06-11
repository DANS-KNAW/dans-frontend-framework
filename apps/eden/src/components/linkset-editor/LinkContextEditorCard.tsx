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
  Tooltip,
  Typography,
} from "@mui/material";
import {
  LinkContextDraft,
  LinkContextRelationKey,
  LinkRelationId,
  LinkTargetDraft,
  RELATION_CONFIG,
} from "./types";

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
          <TextField
            fullWidth
            label="URL"
            value={context.anchor}
            onChange={(event) => onUpdateAnchor(contextIndex, event.target.value)}
            placeholder="https://service.example.org"
          />
          <Tooltip title="Enter the service's base URL; the LinkSet 'anchor' (e.g., https://example.org)">
             <IconButton size="small" aria-label="Anchor URL help" sx={{ p: 0.5, ml: 0.5 }}>
               <HelpOutline fontSize="small" />
             </IconButton>
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
                    <IconButton size="small" aria-label={`Help with ${relationConfig.label}`} sx={{ p: 0.5 }}>
                      <HelpOutline fontSize="small" />
                    </IconButton>
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
                          <TextField
                            fullWidth
                            label="URL"
                            value={target.href}
                            onChange={(event) =>
                              onUpdateRelationTarget(
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
                            <IconButton size="small" aria-label="Help with link URL" sx={{ p: 0.5, ml: 0 }}>
                              <HelpOutline fontSize="small" />
                            </IconButton>
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
                            <IconButton size="small" aria-label="Help with MIME type" sx={{ p: 0.5, ml: 0 }}>
                              <HelpOutline fontSize="small" />
                            </IconButton>
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
                            <IconButton size="small" aria-label="Help with link title" sx={{ p: 0.5, ml: 0 }}>
                              <HelpOutline fontSize="small" />
                            </IconButton>
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
