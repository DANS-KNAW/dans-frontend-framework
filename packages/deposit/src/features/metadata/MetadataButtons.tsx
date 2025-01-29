import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { addField, deleteField, setField } from "./metadataSlice";
import { getFormDisabled } from "../../deposit/depositSlice";
import type {
  AddFieldButtonProps,
  DeleteFieldButtonProps,
} from "../../types/MetadataProps";

export const DeleteButton = ({
  field,
  fieldIndex,
  size = "small",
  sx,
  groupName,
  groupIndex,
}: DeleteFieldButtonProps) => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation("metadata");
  const formDisabled = useAppSelector(getFormDisabled);
  return (
    <Tooltip title={t("delete") as string}>
      <span>
        <IconButton
          color="error"
          aria-label={t("delete") as string}
          size={size}
          onClick={() =>
            dispatch(deleteField({
              field: field,
              fieldIndex: fieldIndex,
              ...(groupName !== undefined && { groupName: groupName }),
              ...(groupIndex !== undefined && { groupIndex: groupIndex }),
            }))
          }
          disabled={formDisabled}
          sx={sx}
        >
          <RemoveCircleOutlineIcon fontSize={size} />
        </IconButton>
      </span>
    </Tooltip>
  );
};

export const AddButton = ({
  field,
  size = "small",
  disabled = false,
  sx,
  groupName,
  groupIndex,
}: AddFieldButtonProps) => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation("metadata");
  const formDisabled = useAppSelector(getFormDisabled);
  return (
    <Tooltip title={t("add") as string}>
      <span>
        <IconButton
          color="primary"
          aria-label={t("add") as string}
          size={size}
          onClick={() =>
            dispatch(addField({
              field: field,
              ...(groupName !== undefined && { groupName: groupName }),
              ...(groupIndex !== undefined && { groupIndex: groupIndex }),
            }))
          }
          disabled={formDisabled || disabled}
          sx={sx}
        >
          <AddCircleOutlineIcon fontSize={size} />
        </IconButton>
      </span>
    </Tooltip>
  );
};

export const AddButtonText = ({
  field,
  size = "medium",
}: AddFieldButtonProps) => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation("metadata");
  const formDisabled = useAppSelector(getFormDisabled);
  return (
    <span>
      <Button
        onClick={() =>
          dispatch(addField({
            field: field,
            type: 'group',
          }))
        }
        size={size}
        startIcon={<AddCircleOutlineIcon />}
        disabled={formDisabled}
      >
        {t("add")}
      </Button>
    </span>
  );
};

export const AddDeleteControls = ({
  fieldIndex,
  fieldValue,
  field,
  groupName,
  groupIndex,
}: {

}) => {
  return ([
    fieldValue?.length > 1 && (
      <DeleteButton
        key="delete"
        field={field}
        fieldIndex={fieldIndex}
        sx={{mt: 1.75}}
        groupName={groupName}
        groupIndex={groupIndex}
      />
    ),
    (fieldIndex === fieldValue?.length - 1 || !fieldValue) && (
      <AddButton
        key="add"
        field={field}
        disabled={!fieldValue?.[fieldIndex]?.value}
        sx={{mt: 1.75}}
        groupName={groupName}
        groupIndex={groupIndex}
      />
    ),
  ]);
};
