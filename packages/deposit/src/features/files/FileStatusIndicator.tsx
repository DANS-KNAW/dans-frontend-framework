import { useTranslation } from "react-i18next";
import { IconButton, CircularProgress, Typography } from "@mui/material";
import { FileItemProps } from "../../types/Files";
import { useAppDispatch } from "../../redux/hooks";
import { dansUtilityApi, useCheckTypeQuery } from "./api/dansUtility";
import { LightTooltip } from "../generic/Tooltip";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import InfoRoundedIcon from "@mui/icons-material/InfoRounded";
import ErrorRoundedIcon from "@mui/icons-material/ErrorRounded";
import ReplayCircleFilledIcon from "@mui/icons-material/ReplayCircleFilled";
import Tooltip from "@mui/material/Tooltip";

/**
 * Renders a tooltip with a title and additional information based on the file type and its conversion status.
 * If the file type is being checked, a loading spinner is displayed.
 * If there is an error while checking the file type, a retry button is shown.
 */
const FileStatusIndicator = ({
  file,
  convertFiles,
}: FileItemProps & { convertFiles: boolean }) => {
  const dispatch = useAppDispatch();
  const { data, isError } = useCheckTypeQuery<any>(file.type);
  const { t } = useTranslation("files");

  /**
   * Renders the tooltip title based on the file type and its conversion status.
   * @returns The tooltip title as JSX element.
   */
  const renderTooltipTitle = () => (
    <>
      <Typography sx={{ fontSize: 14, p: 2 }}>{getTooltipTitle()}</Typography>
      {convertFiles ? renderAdditionalInfo() : null}
    </>
  );

  /**
   * Gets the tooltip title based on the file type and its conversion status.
   * @returns The tooltip title string.
   */
  const getTooltipTitle = () => {
    if (file.submittedFile) return t("submittedFile");
    if (file.valid === false) return t("invalid", { type: file.type });
    if (!convertFiles && data?.preferred) return t("noConversionHead");
    if (!convertFiles)
      return t("preferredFile", {
        fileType: file.type,
        type: data["required-convert-to"],
      });
    if (data?.preferred) return t("noConversion");
    return t("conversion", { type: data["required-convert-to"] });
  };

  /**
   * Renders additional information in the tooltip based on the file type and its conversion status.
   * Can see it as an secondary information message.
   * @returns The additional information as JSX element.
   */
  const renderAdditionalInfo = () => {
    if (file.submittedFile) return null;
    return (
      <Typography
        sx={{
          fontSize: 12,
          pl: 2,
          pr: 2,
          pb: 1,
          pt: 1,
          backgroundColor: getBackgroundColor(),
        }}
      >
        {getAdditionalInfoText()}
      </Typography>
    );
  };

  /**
   * Gets the background color for the additional information based on the file type and status.
   * @returns The background color string.
   */
  const getBackgroundColor = () => {
    if (file.valid === false) return "error.main";
    if (data?.preferred) return "success.main";
    return "warning.main";
  };

  /**
   * Gets the additional information text based on the file type and its conversion status.
   * @returns The additional information text string.
   */
  const getAdditionalInfoText = () => {
    if (file.valid === false) return t("invalidHead");
    if (data?.preferred) return t("noConversionHead");
    return t("conversionHead", { type: file.type });
  };

  /**
   * Renders an icon based on the file type and its conversion status.
   * @returns The icon JSX element.
   */
  const renderIcon = () => {
    if (file.submittedFile) return <InfoRoundedIcon color="info" />;
    if (file.valid === false) return <ErrorRoundedIcon color="error" />;
    if (data?.preferred) return <CheckCircleIcon color="success" />;
    return <InfoRoundedIcon color="warning" />;
  };

  // Handles the retry action when there is an error checking the file type.
  const handleRetry = () => {
    dispatch(
      dansUtilityApi.endpoints.checkType.initiate(file.type, {
        forceRefetch: true,
      }),
    );
  };

  // Conditional rendering based on the query result and error status.
  if (data) {
    return (
      <LightTooltip title={renderTooltipTitle()}>{renderIcon()}</LightTooltip>
    );
  } else if (isError) {
    return (
      <IconButton onClick={handleRetry} sx={{ marginLeft: "-8px" }}>
        <Tooltip title={t("fileTypeCheckError")}>
          <ReplayCircleFilledIcon color="error" />
        </Tooltip>
      </IconButton>
    );
  }

  return <CircularProgress size={20} />;
};

export default FileStatusIndicator;
