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
import MediaTypeInput from "./MediaTypeInput";
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
          <Box sx={{ flex: 1 }}>
            <UrlInput
              value={context.anchor}
              onChange={(value) => onUpdateAnchor(contextIndex, value)}
              onConfirmed={handleAnchorConfirmed}
              enableUrlCheck={false}
            />
          </Box>
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
                  <Typography variant="body2">{t('service.enabledLabel')}</Typography>
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
                          <Typography variant="body2">
                            {t('relations.linkLabel', { index: targetIndex + 1 })}
                          </Typography>
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
                          <Tooltip title={t('relations.urlHelpTooltip')}>
                            <IconButton size="small" aria-label={t('relations.urlHelpAriaLabel')} sx={{ p: 0.5, ml: 0 }}>
                              <HelpOutline fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Stack>

                        <Stack direction="row" alignItems="center" spacing={1}>
                          <Box sx={{ flex: 1 }}>
                            <MediaTypeInput
                              label={t('fields.typeOptional')}
                              value={target.type}
                              onChange={(value) =>
                                onUpdateRelationTarget(
                                  contextIndex,
                                  relationConfig.key,
                                  targetIndex,
                                  "type",
                                  value,
                                )
                              }
                            />
                          </Box>
                          <Tooltip title={t('relations.typeHelpTooltip')}>
                            <IconButton size="small" aria-label={t('relations.typeHelpAriaLabel')} sx={{ p: 0.5, ml: 0 }}>
                              <HelpOutline fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Stack>

                        <Stack direction="row" alignItems="center" spacing={1}>
                          <TextField
                            fullWidth
                            label={t('fields.titleOptional')}
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
                            placeholder={t('relations.titlePlaceholder')}
                          />
                          <Tooltip title={t('relations.titleHelpTooltip')}>
                            <IconButton size="small" aria-label={t('relations.titleHelpAriaLabel')} sx={{ p: 0.5, ml: 0 }}>
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
