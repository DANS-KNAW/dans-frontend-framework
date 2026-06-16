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
import { useTranslation } from "react-i18next";
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
  const { t } = useTranslation('linkset-editor');
  return (
    <Paper sx={{ p: 2 }} variant="outlined">
      <Stack spacing={2}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">{t('service.heading', { index: contextIndex + 1 })}</Typography>
          <IconButton
            aria-label={t('service.removeAriaLabel', { index: contextIndex + 1 })}
            color="error"
            onClick={() => onRemoveContext(contextIndex)}
          >
            <Delete />
          </IconButton>
        </Stack>

        <Stack direction="row" alignItems="center" spacing={1}>
          <TextField
            fullWidth
            label={t('service.urlLabel')}
            value={context.anchor}
            onChange={(event) => onUpdateAnchor(contextIndex, event.target.value)}
            placeholder="https://service.example.org"
          />
          <Tooltip title={t('service.anchorHelp')}>
             <IconButton size="small" aria-label={t('service.anchorHelpAriaLabel')} sx={{ p: 0.5, ml: 0.5 }}>
               <HelpOutline fontSize="small" />
             </IconButton>
          </Tooltip>
        </Stack>

        <Divider />

        {RELATION_CONFIG.map((relationConfig) => {
          const relation = context[relationConfig.key];
          
          // Get translated label and helpText
          const labelKey = relationConfig.id === 'service-desc' ? 'relations.description' 
                         : relationConfig.id === 'service-doc' ? 'relations.documentation'
                         : 'relations.metadata';
          const translatedLabel = t(`${labelKey}.label`);
          const translatedHelpText = t(`${labelKey}.helpText`);

          return (
            <Stack key={relationConfig.id} spacing={1.5} sx={{ pl: 0.5 }}>
              <Stack direction="row" alignItems="center" justifyContent="space-between">
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Typography variant="subtitle1">{translatedLabel}</Typography>
                  <Tooltip title={translatedHelpText}>
                    <IconButton size="small" aria-label={t('service.relationHelpAriaLabel', { label: translatedLabel })} sx={{ p: 0.5 }}>
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
                            aria-label={t('relations.removeTarget')}
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
                            label={t('fields.url')}
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
                            label={`${t('fields.type')} (optional)`}
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
                            label={`${t('fields.title')} (optional)`}
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
                      {t('relations.addTarget')}
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
