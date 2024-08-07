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
// import ReplayIcon from "@mui/icons-material/Replay";
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

/*
 * Note TODO:
 * Resubmitting of (errored) forms does not work yet
 * It is partially implemented here and in Deposit.tsx,
 * but needs work on the API side
 */

const depositStatus: DepositStatus = {
  processing: ["initial", "processing", "submitted", "finalizing", "progress"],
  error: ["rejected", "failed", "error"],
  success: ["finish", "accepted", "success"],
};

export const UserSubmissions = ({ depositSlug }: { depositSlug?: string }) => {
  const { t } = useTranslation("user");
  const siteTitle = useSiteTitle();
  const auth = useAuth();
  const dispatch = useAppDispatch();

  // Fetch the users submitted/saved forms, every 10 sec, to update submission status
  const { data, isLoading } = useFetchUserSubmissionsQuery(
    auth.user?.profile.sub,
  );

  // are there any targets that have been submitted not complete yet?
  const allTargetsComplete =
    (data &&
    data
      .filter(
        (d) =>
          d["release-version"] === "PUBLISHED" ||
          d["release-version"] === "PUBLISH",
      )
      .every(
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
      )) || 
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

  useEffect(() => {
    setSiteTitle(siteTitle, t("userSubmissions"));
  }, [siteTitle, name]);

  return (
    <Container>
      <Grid container>
        <Grid xs={12} mdOffset={1} md={10}>
          <Typography variant="h1">{t("userSubmissions")}</Typography>
          <SubmissionList
            data={
              (data && data.filter((d) => d["release-version"] === "DRAFT")) ||
              []
            }
            type="draft"
            isLoading={isLoading}
            header={t("userSubmissionsDrafts")}
            depositSlug={depositSlug !== undefined ? depositSlug : "deposit"}
          />
          <SubmissionList
            data={
              (data &&
                data.filter(
                  (d) =>
                    d["release-version"] === "PUBLISHED" ||
                    d["release-version"] === "PUBLISH",
                )) ||
              []
            }
            type="published"
            isLoading={isLoading}
            header={t("userSubmissionsCompleted")}
            depositSlug={depositSlug !== undefined ? depositSlug : "deposit"}
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
}: {
  data: SubmissionResponse[];
  isLoading: boolean;
  header: string;
  type: "draft" | "published";
  depositSlug: string;
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
            type === "draft" && (
              // Edit function for saved but not submitted forms
              <Tooltip title={t("editItem")} placement="bottom">
                <GridActionsCellItem
                  icon={<EditIcon />}
                  label={t("editItem")}
                  onClick={() => {
                    // set which form to load in userSlice (accessed in Deposit package)
                    dispatch(
                      setFormAction({
                        id: params.row.id,
                        action: "load",
                      }),
                    );
                    // navigate to deposit page
                    navigate(`/${depositSlug}`);
                  }}
                />
              </Tooltip>
            ),
            type !== "draft" && (
              // Open a popover menu with these options:
              // Open a read only version of a submitted form, so user can check input values
              // Or go to the deposited data on the target website(s)
              <ViewAction
                id={params.row.id}
                depositSlug={depositSlug}
                status={params.row.status}
              />
            ),
            /*type !== "draft" && (
              // Resubmit a form
              <Tooltip title={t("retryItem")} placement="bottom">
                <GridActionsCellItem
                  icon={<ReplayIcon />}
                  label={t("retryItem")}
                  onClick={() => {
                    dispatch(
                      setFormAction({
                        id: params.row.id,
                        action: "resubmit",
                      }),
                    );
                    navigate(`/${depositSlug}`);
                  }}
                />
              </Tooltip>
            ),*/
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
              />
            </Tooltip>,
            (type === "draft" || params.row.error) && (
              // Delete an item, for drafts and for errored submissions. todo
              <Tooltip
                title={t(
                  toDelete === params.row.id ? "undeleteItem" : "deleteItem",
                )}
                placement="bottom"
              >
                <GridActionsCellItem
                  icon={
                    toDelete === params.row.id ? <CloseIcon /> : <DeleteIcon />
                  }
                  label={t(
                    toDelete === params.row.id ? "undeleteItem" : "deleteItem",
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
        width: type === "draft" ? 125 : 125,
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
            >
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
                        mr: 1,
                      }}
                      color="error"
                      onClick={
                        // delete call to server
                        () =>
                          deleteSubmission({
                            id: params.row.id,
                            user: auth.user,
                          })
                      }
                    >
                      {t("confirmDelete")}
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
        headerName: type === "draft" ? t("savedOn") : t("submittedOn"),
        width: 200,
        type: "dateTime",
        valueGetter: (params) => moment.utc(params.value).toDate(),
        renderCell: (params) => moment(params.value).local().format("D-M-Y - HH:mm"),
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
                    depositStatus={depositStatus}
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
        (t) => t["deposit-status"] === "rejected" || t["deposit-status"] === "error",
      ),
      processing: d["targets"].some(
        (t) => depositStatus.processing.indexOf(t["deposit-status"]) !== -1,
      ),
      id: d["dataset-id"],
      created: type === "draft" ? d["saved-date"] : d["submitted-date"],
      title: d["title"],
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
  depositStatus,
  target,
}: {
  depositStatus: DepositStatus;
  target: TargetOutput;
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
      <Stack direction="row" alignItems="center" pt={0.1} pb={0.1}>
        <Tooltip
          title={
            !target["deposit-status"] ? t("queue")
            : (
              depositStatus.processing.indexOf(target["deposit-status"]) !== -1
            ) ?
              t("processing")
            : depositStatus.error.indexOf(target["deposit-status"]) !== -1 ?
              t("error")
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
        <Typography variant="body2" ml={1}>
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
}: {
  id: string;
  depositSlug: string;
  status: TargetOutput[];
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

  return (
    <>
      <Tooltip title={t("viewItem")} placement="bottom">
        <GridActionsCellItem
          icon={<PreviewIcon />}
          label={t("viewItem")}
          onClick={handleClick}
        />
      </Tooltip>
      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
        {/* Go to read only view */}
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

        {/* Open submission on target site. TODO: mod API to always return a response.url key */}
        {status.map(
          (target, i) =>
            target["output-response"] &&
            target["output-response"].response?.identifiers &&
            (target["deposit-status"] === "accepted" || target["deposit-status"] === "finish") && (
              <Link
                href={target["output-response"].response.identifiers[0].url}
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
