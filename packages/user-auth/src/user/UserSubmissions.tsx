import {
  useEffect,
  useMemo,
  useState,
  forwardRef,
  type MouseEvent,
} from "react";
import { useNavigate } from "react-router-dom";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Unstable_Grid2";
import Stack from "@mui/material/Stack";
import { useTranslation } from "react-i18next";
import Paper from "@mui/material/Paper";
import {
  motion,
  AnimatePresence,
  LayoutGroup,
  type HTMLMotionProps,
} from "framer-motion";
import {
  DataGrid,
  GridColDef,
  GridColumnMenuProps,
  GridColumnMenu,
  GridActionsCellItem,
  GridRow,
  type GridRowProps,
} from "@mui/x-data-grid";
import Box from "@mui/material/Box";
import moment from "moment";
import { useSiteTitle, setSiteTitle } from "@dans-framework/utils";
import {
  useFetchUserSubmissionsQuery,
  useDeleteSubmissionMutation,
  userSubmissionsApi,
} from "./userApi";
import { useAuth } from "react-oidc-context";
import type { SubmissionResponse, TargetOutput, DepositStatus } from "../types";
import CircularProgress from "@mui/material/CircularProgress";
import LinearProgress from "@mui/material/LinearProgress";
import Link from "@mui/material/Link";
import EditIcon from "@mui/icons-material/Edit";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import ReplayIcon from "@mui/icons-material/Replay";
import PendingIcon from "@mui/icons-material/Pending";
import ErrorIcon from "@mui/icons-material/Error";
import PreviewIcon from "@mui/icons-material/Preview";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import Popover from "@mui/material/Popover";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import VisibilityIcon from "@mui/icons-material/Visibility";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import Tooltip from "@mui/material/Tooltip";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import { setFormAction } from "./userSlice";
import { useAppDispatch } from "../redux/hooks";

const depositStatus: DepositStatus = {
  empty: ["preparing"],
  processing: ["initial", "processing", "submitted", "finalizing", "progress"],
  error: ["rejected", "failed", "error"],
  success: ["finish", "accepted", "success"],
};

export const UserSubmissions = ({ 
  depositSlug, 
  targetCredentials,
}: { 
  depositSlug?: string;
  targetCredentials?: { repo: string; auth: string; authKey: string; }[];
}) => {
  const { t } = useTranslation("user");
  const siteTitle = useSiteTitle();
  const dispatch = useAppDispatch();

  // Fetch the users submitted/saved forms, every 10 sec, to update submission status
  const { data, isLoading } = useFetchUserSubmissionsQuery({
    targetCredentials: targetCredentials,
  });

  useEffect(() => {
    setSiteTitle(siteTitle, t("userSubmissions"));
  }, [siteTitle]);

  const drafts = data && data.filter((d) => d["status"] === "DRAFT") || [];
  const resubmits = data && data.filter((d) => d["status"] === "RESUBMIT") || [];
  const published = data && data.filter((d) => ["SUBMITTED", "SUBMIT", "PUBLISHED", "PUBLISH"].includes(d.status)) || [];

  // are there any targets that have been submitted not complete yet?
  const allTargetsComplete =
    published.every(
      // if all are finished, or one has an error, stop checking
      (d) =>
        d.targets.every(
          (t) => depositStatus.success.indexOf(t["deposit-status"]) !== -1,
        ) ||
        d.targets.some(
          (t) => depositStatus.error.indexOf(t["deposit-status"]) !== -1,
        ) ||
        d.targets.some(
          // Something went wrong if status is null.
          // Todo: modify API to give more consistent output
          (t) => t["deposit-status"] === null,
        ),
    ) ||
    // or when fetch is complete but there's no data for this user
    (data === undefined && !isLoading);

  useEffect(() => {
    // on load, we set an interval once to keep checking for new data if there's still targets being processed
    const interval =
      !allTargetsComplete &&
      setInterval(
        () => dispatch(userSubmissionsApi.util.invalidateTags(["Submissions"])),
        5000,
      );
    return () => (interval ? clearInterval(interval) : undefined);
  }, [allTargetsComplete]);
  
  return (
    <Container>
      <Grid container>
        <Grid xs={12} mdOffset={1} md={10}>
          <Typography variant="h1">{t("userSubmissions")}</Typography>
          <SubmissionList
            data={drafts}
            type="draft"
            isLoading={isLoading}
            header={t("userSubmissionsDrafts")}
            depositSlug={depositSlug !== undefined ? depositSlug : "deposit"}
          />
          {import.meta.env.VITE_ALLOW_RESUBMIT && resubmits.length > 0 && <SubmissionList
            data={resubmits}
            type="resubmit"
            isLoading={isLoading}
            header={t("userSubmissionsResubmit")}
            depositSlug={depositSlug !== undefined ? depositSlug : "deposit"}
          />}
          <SubmissionList
            data={published}
            type="published"
            isLoading={isLoading}
            header={t("userSubmissionsCompleted")}
            depositSlug={depositSlug !== undefined ? depositSlug : "deposit"}
            resubmit={import.meta.env.VITE_ALLOW_RESUBMIT}
          />
        </Grid>
      </Grid>
    </Container>
  );
};

const SubmissionList = ({
  data,
  isLoading,
  header,
  type,
  depositSlug,
  resubmit,
}: {
  data: SubmissionResponse[];
  isLoading: boolean;
  header: string;
  type: "draft" | "published" | "resubmit";
  depositSlug: string;
  resubmit?: boolean;
}) => {
  const { t, i18n } = useTranslation("user");
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const auth = useAuth();
  const [toDelete, setToDelete] = useState<string>("");
  const [deleteSubmission] = useDeleteSubmissionMutation();

  // useMemo to make sure columns don't change
  const columns = useMemo<GridColDef[]>(
    () => [
      {
        field: "viewLink",
        headerName: "",
        getActions: (params: any) => {
          return [
            type === "published" && (
              // Open a popover menu with these options:
              // Open a read only version of a submitted form, so user can check input values
              // Or go to the deposited data on the target website(s)
              <ViewAction
                id={params.row.id}
                depositSlug={depositSlug}
                status={params.row.status}
                legacy={params.row.legacy}
              />
            ),
            (resubmit || type !== "published") && (
              // Resubmit or edit a form
              <Tooltip title={t(type === "draft" ? "editItem" : "retryItem")} placement="bottom">
                <GridActionsCellItem
                  icon={resubmit ? <ReplayIcon /> : <EditIcon />}
                  label={t(type === "draft" ? "editItem" : "retryItem")}
                  onClick={() => {
                    dispatch(
                      setFormAction({
                        id: params.row.id,
                        action: type === "draft" ? "load" : "resubmit",
                      }),
                    );
                    navigate(`/${depositSlug}`);
                  }}
                  disabled={params.processing || params.row.legacy || params.row.remoteDeleted}
                />
              </Tooltip>
            ),
            <Tooltip title={t("copyItem")} placement="bottom">
              <GridActionsCellItem
                icon={<ContentCopyIcon />}
                label={t("copyItem")}
                onClick={() => {
                  dispatch(
                    setFormAction({
                      id: params.row.id,
                      action: "copy",
                    }),
                  );
                  navigate(`/${depositSlug}`);
                }}
                disabled={params.row.legacy}
                />
            </Tooltip>,
            (type !== "published" || params.row.error) && (
              // Delete an item, for drafts and for errored submissions
              <Tooltip
                title={t(
                  toDelete === params.row.id 
                  ? (type === "resubmit" ? "cancelUnstageItem" : "undeleteItem")
                  : (type === "resubmit" ? "unstageItem" : "deleteItem"),
                )}
                placement="bottom"
              >
                <GridActionsCellItem
                  icon={
                    toDelete === params.row.id ? <CloseIcon /> : <DeleteIcon />
                  }
                  label={t(
                    toDelete === params.row.id 
                    ? (type === "resubmit" ? "cancelUnstageItem" : "undeleteItem")
                    : (type === "resubmit" ? "unstageItem" : "deleteItem"),
                  )}
                  onClick={() =>
                    setToDelete(toDelete === params.row.id ? "" : params.row.id)
                  }
                />
              </Tooltip>
            ),
          ].filter(Boolean);
        },
        type: "actions",
        align: "left",
        // adjust width for more icons. Add or remove 30 for an icon.
        width: type === "draft" || !resubmit ? 125 : 165,
      },
      {
        field: "title",
        headerName: t("title"),
        width: 250,
        renderCell: (params) => (
          // render a confirm delete button in the title cell
          <LayoutGroup>
            <Stack
              direction="row"
              sx={{
                overflow: "hidden",
                width: "100%",
              }}
              alignItems="center"
              title={params.value}
              spacing={1}
            >
              {params.row.legacy && (
                <Tooltip title={t("legacyForm")} placement="left">
                  <ErrorOutlineIcon fontSize="small" color="warning" />
                </Tooltip>
              )}
              <AnimatePresence>
                {toDelete === params.row.id && (
                  <motion.div
                    key={`delete-${params.row.id}`}
                    initial={{ x: "-100%" }}
                    animate={{ x: 0 }}
                    exit={{ x: "-100%" }}
                    layout
                  >
                    <Button
                      size="small"
                      variant="contained"
                      sx={{
                        fontSize: 11,
                      }}
                      color="error"
                      onClick={
                        // delete call to server
                        () =>
                          deleteSubmission({
                            id: params.row.id,
                          })
                      }
                    >
                      {t(type === "resubmit" ? "confirmUnstage" : "confirmDelete")}
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
              <motion.div
                layout
                key={`title-${params.row.id}`}
                layoutDependency={toDelete}
              >
                {params.value ? params.value : t("noTitle")}
              </motion.div>
            </Stack>
          </LayoutGroup>
        ),
      },
      {
        field: "created",
        headerName: type === "published" ? t("submittedOn") : t("savedOn"),
        width: 200,
        type: "dateTime",
        valueGetter: (params) => moment.utc(params.value).toDate(),
        renderCell: (params) =>
          moment(params.value).local().format("D-M-Y - HH:mm"),
      },
      ...(type === "published" ?
        [
          {
            field: "status",
            headerName: t("submissionStatus"),
            width: 250,
            renderCell: (params: any) => (
              <Stack direction="column" pt={0.5} pb={0.5}>
                {params.value.map((v: TargetOutput, i: number) => (
                  <SingleTargetStatus
                    target={v}
                    remoteChanges={params.row.remoteChanges}
                    remoteDeleted={params.row.remoteDeleted}
                    key={i}
                  />
                ))}
              </Stack>
            ),
          },
        ]
      : []),
    ],
    [i18n.language, toDelete, auth.user],
  );

  const rows =
    data &&
    data.map((d) => ({
      // Todo: API needs work and standardisation, also see types.
      error: d["targets"].some(
        // If there's an error, allow deletion
        (t) =>
          t["deposit-status"] === "rejected" || t["deposit-status"] === "error",
      ),
      processing: d["targets"].some(
        (t) => depositStatus.processing.indexOf(t["deposit-status"]) !== -1,
      ),
      id: d["dataset-id"],
      created: type === "published" ? d["submitted-at"] : d["saved-at"],
      title: d["title"],
      remoteChanges: d["targets"].some(t => t.diff && Object.keys(t.diff).length > 0),
      remoteDeleted: d["targets"].some(t => t.diff && Object.values(t.diff).includes(404)),
      legacy: d["legacy-form"] || d["acp-version"] === "unknown",
      ...(type === "published" ? { status: d["targets"] } : null),
    }));

  return (
    <>
      <Typography sx={{ mt: 4, mb: 1 }} variant="h5">
        {header}
      </Typography>

      <Paper sx={{ height: data.length === 0 ? 160 : "auto", width: "100%" }}>
        <DataGrid
          loading={isLoading}
          slots={{
            columnMenu: CustomColumnMenu,
            loadingOverlay: LinearProgress,
            noRowsOverlay: () => (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "100%",
                }}
              >
                {t("noRows")}
              </Box>
            ),
            row: MotionGridRow,
          }}
          slotProps={{
            row: {
              animate: { opacity: 1 },
              initial: { opacity: 0 },
              exit: { opacity: 0 },
            },
          }}
          rows={rows}
          columns={columns}
          disableRowSelectionOnClick
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 10 },
            },
            sorting: {
              sortModel: [{ field: "created", sort: "desc" }],
            },
          }}
          pageSizeOptions={[10, 50, 100]}
          getRowHeight={() => (type === "published" ? "auto" : 45)}
          sx={{
            // disable cell outlines
            ".MuiDataGrid-columnHeader:focus-within, .MuiDataGrid-cell:focus-within":
              {
                outline: "none !important",
              },
            // padding for auto height rows
            "&.MuiDataGrid-root--densityStandard .MuiDataGrid-cell": {
              py: "8px",
            },
          }}
        />
      </Paper>
    </>
  );
};

// Animation doesn't work great as we'd ideally need an AnimatePresence component inside DataGrid
// (modify the virtual scroll container). So for now it's just a fade in, no fade out.
const ForwardRow = forwardRef<
  HTMLDivElement,
  GridRowProps & HTMLMotionProps<"div">
>((props, ref) => <GridRow ref={ref} {...props} />);
const MotionGridRow = motion(ForwardRow);

// A separate component for a target, needs to have it's own state to display popover
const SingleTargetStatus = ({
  target,
  remoteChanges,
  remoteDeleted,
}: {
  target: TargetOutput;
  remoteChanges: boolean;
  remoteDeleted: boolean;
}) => {
  const { t } = useTranslation("user");
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const open = Boolean(anchorEl);
  const id = open ? "popover" : undefined;

  return (
    <>
      <Stack direction="row" alignItems="center" pt={0.1} pb={0.1} spacing={0.5}>
        {remoteChanges && (
          <Tooltip title={t(remoteDeleted ? "remoteDeleted" : "remoteChanges")} placement="left">
            <ErrorOutlineIcon fontSize="small" color="warning" />
          </Tooltip>
        )}
        <Tooltip
          title={
            !target["deposit-status"] ? t("queue")
            : (
              depositStatus.processing.indexOf(target["deposit-status"]) !== -1
            ) ?
              t("processing")
            : depositStatus.error.indexOf(target["deposit-status"]) !== -1 ?
              t("error")
            : depositStatus.empty.indexOf(target["deposit-status"]) !== -1 ?
              t("queue")
            : t("success")
          }
          placement="left"
        >
          {depositStatus.processing.indexOf(target["deposit-status"]) !== -1 ?
            <CircularProgress size={16} />
          : depositStatus.error.indexOf(target["deposit-status"]) !== -1 ?
            <Button
              variant="contained"
              color="error"
              startIcon={<ErrorIcon />}
              size="small"
              onClick={handleClick}
              sx={{ fontSize: 10 }}
            >
              {t("moreInfo")}
            </Button>
          : depositStatus.success.indexOf(target["deposit-status"]) !== -1 ?
            <CheckCircleIcon fontSize="small" color="success" />
          : <PendingIcon fontSize="small" color="neutral" />}
        </Tooltip>
        <Typography variant="body2">
          {target["display-name"]}
        </Typography>
      </Stack>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        sx={{ maxWidth: "50rem" }}
      >
        <Box sx={{ p: 2, minWidth: "15rem" }}>
          <Typography variant="h6">{t("errorExplanation")}</Typography>
          <pre
            style={{
              whiteSpace: "pre-wrap",
              background: "rgba(0,0,0,0.1)",
              maxHeight: "20rem",
              overflow: "auto",
              padding: "1rem",
              fontSize: "0.8rem",
            }}
          >
            {JSON.stringify(target["output-response"], null, 2)}
          </pre>
        </Box>
      </Popover>
    </>
  );
};

const CustomColumnMenu = (props: GridColumnMenuProps) => {
  return (
    <GridColumnMenu
      {...props}
      slots={{
        // Hide `columnMenuColumnsItem` - the manage columns function
        columnMenuColumnsItem: null,
      }}
    />
  );
};

const ViewAction = ({
  id,
  depositSlug,
  status,
  legacy,
}: {
  id: string;
  depositSlug: string;
  status: TargetOutput[];
  legacy?: boolean;
}) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation("user");

  // Popover event handling
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const open = Boolean(anchorEl);
  const hasChildren = status.some(
    (target) =>
      target["deposited-identifiers"] &&
      (target["deposit-status"] === "accepted" ||
        target["deposit-status"] === "finish")
  );

  return (
    <>
      <Tooltip title={t("viewItem")} placement="bottom">
        <GridActionsCellItem
          icon={<PreviewIcon />}
          label={t("viewItem")}
          onClick={handleClick}
          disabled={!hasChildren && legacy}
        />
      </Tooltip>
      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
        {/* Go to read only view */}
        {!legacy && 
          <MenuItem
            onClick={() => {
              dispatch(
                setFormAction({
                  id: id,
                  action: "view",
                }),
              );
              navigate(`/${depositSlug}`);
            }}
          >
            <ListItemIcon>
              <VisibilityIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>{t("viewItemReadOnly")}</ListItemText>
          </MenuItem>
        }

        {/* Open submission on target site */}
        {status.map(
          (target, i) =>
            target["deposited-identifiers"] &&
            (target["deposit-status"] === "accepted" ||
              target["deposit-status"] === "finish") && (
              <Link
                href={target["deposited-identifiers"][0].url}
                color="inherit"
                underline="none"
                target="_blank"
                key={i}
              >
                <MenuItem onClick={handleClose}>
                  <ListItemIcon>
                    <OpenInNewIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>
                    {t("viewItemTarget", { name: target["display-name"] })}
                  </ListItemText>
                </MenuItem>
              </Link>
            ),
        )}
      </Menu>
    </>
  );
};
