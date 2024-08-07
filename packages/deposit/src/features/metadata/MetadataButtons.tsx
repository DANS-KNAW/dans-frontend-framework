import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { addField, deleteField } from "./metadataSlice";
import { getFormDisabled } from "../../deposit/depositSlice";
import type {
  AddFieldButtonProps,
  DeleteFieldButtonProps,
} from "../../types/MetadataProps";

export const DeleteButton = ({
  sectionIndex,
  groupedFieldId,
  deleteFieldIndex,
  size = "small",
  mt,
  deleteGroupId,
  groupedFieldName,
}: DeleteFieldButtonProps) => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation("metadata");
  const formDisabled = useAppSelector(getFormDisabled);
  return (
    <Tooltip title={t("delete") as string}>
      <IconButton
        color="error"
        aria-label={t("delete") as string}
        size={size}
        sx={{ mt: mt }}
        onClick={() =>
          dispatch(
            deleteField({
              sectionIndex: sectionIndex,
              groupedFieldId: groupedFieldId,
              deleteField: deleteFieldIndex,
            }),
          )
        }
        data-testid={`delete-button-${groupedFieldName}-${deleteGroupId}`}
        disabled={formDisabled}
      >
        <RemoveCircleOutlineIcon fontSize={size} />
      </IconButton>
    </Tooltip>
  );
};

export const AddButton = ({
  sectionIndex,
  groupedFieldId,
  type,
  size = "small",
  mt,
  groupedFieldName,
}: AddFieldButtonProps) => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation("metadata");
  const formDisabled = useAppSelector(getFormDisabled);
  return (
    <Tooltip title={t("add") as string}>
      <IconButton
        color="primary"
        aria-label={t("add") as string}
        size={size}
        sx={{ mt: mt }}
        onClick={() =>
          dispatch(
            addField({
              sectionIndex: sectionIndex,
              groupedFieldId: groupedFieldId,
              type: type,
            }),
          )
        }
        data-testid={`add-button-${groupedFieldName}-${groupedFieldId}`}
        disabled={formDisabled}
      >
        <AddCircleOutlineIcon fontSize={size} />
      </IconButton>
    </Tooltip>
  );
};

export const AddButtonText = ({
  sectionIndex,
  groupedFieldId,
  type,
  size = "medium",
  groupedFieldName,
}: AddFieldButtonProps) => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation("metadata");
  const formDisabled = useAppSelector(getFormDisabled);
  return (
    <Button
      onClick={() =>
        dispatch(
          addField({
            sectionIndex: sectionIndex,
            groupedFieldId: groupedFieldId,
            type: type,
          }),
        )
      }
      size={size}
      startIcon={<AddCircleOutlineIcon />}
      data-testid={`add-button-${groupedFieldName}-${groupedFieldId}`}
      disabled={formDisabled}
    >
      {t("add")}
    </Button>
  );
};

export const AddDeleteControls = ({ groupedFieldId, totalFields, sectionIndex, currentField, field }: {
  groupedFieldId?: string;
  totalFields: number;
  sectionIndex: number;
  currentField: number;
  field: any;
}) => {
  return (
    groupedFieldId ? [
      totalFields > 1 && (
        <DeleteButton
          key="delete"
          sectionIndex={sectionIndex}
          groupedFieldId={groupedFieldId}
          deleteFieldIndex={currentField}
          mt={
            (status === "error" && field.touched ? -3 : 0) +
            (currentField === 0 ? 0 : 1)
          }
          deleteGroupId={field.id}
          groupedFieldName={field.name}
        />
      ),
      currentField + 1 === totalFields && (
        <AddButton
          key="add"
          sectionIndex={sectionIndex}
          groupedFieldId={groupedFieldId}
          type="single"
          mt={
            (status === "error" && field.touched ? -3 : 0) +
            (currentField === 0 ? 0 : 1)
          }
          groupedFieldName={field.name}
        />
      ),
    ] : null
  )
}
