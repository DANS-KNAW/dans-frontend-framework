import { useEffect, useMemo, useState, MouseEvent } from "react";
import { useNavigate } from "react-router-dom";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Unstable_Grid2";
import Stack from "@mui/material/Stack";
import { useTranslation } from "react-i18next";
import Paper from "@mui/material/Paper";
import {
  DataGrid,
  GridColDef,
  GridColumnMenuProps,
  GridColumnMenu,
  GridActionsCellItem,
} from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import Box from "@mui/material/Box";
import moment from "moment";
import { useSiteTitle, setSiteTitle } from "@dans-framework/utils";
import { useFetchUserSubmissionsQuery } from "./userApi";
import { useAuth } from "react-oidc-context";
import type { SubmissionResponse, TargetOutput, DepositStatus } from "../types";
import CircularProgress from "@mui/material/CircularProgress";
import LinearProgress from "@mui/material/LinearProgress";
import PendingIcon from "@mui/icons-material/Pending";
import ErrorIcon from "@mui/icons-material/Error";
import ReplayIcon from '@mui/icons-material/Replay';
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import Tooltip from "@mui/material/Tooltip";
import Popover from '@mui/material/Popover';
import Button from '@mui/material/Button';

const depositStatus: DepositStatus = {
  processing: ["initial", "processing", "submitted", "finalizing"],
  error: ["rejected", "failed", "error"],
  success: ["finish", "accepted", "success"],
};

export const UserSubmissions = ({ depositSlug }: { depositSlug?: string }) => {
  const [skip, setSkip] = useState<boolean>(false);
  const { t } = useTranslation("user");
  const siteTitle = useSiteTitle();
  const auth = useAuth();

  // Fetch the users submitted/saved forms, every 10 sec, to update submission status
  const { data, isLoading } = useFetchUserSubmissionsQuery(
    auth.user?.profile.sub,
    {
      pollingInterval: 10000,
      skip: skip,
    },
  );

  // are there any targets that have been submitted not complete yet?
  const allTargetsComplete =
    data &&
    data
      .filter((d) => d["release-version"] === "PUBLISH")
      .every(
        // if all are finished, or one has an error, stop checking
        (d) =>
          d.targets.every(
            (t) => depositStatus.success.indexOf(t["ingest-status"]) !== -1,
          ) ||
          d.targets.some(
            (t) => depositStatus.error.indexOf(t["ingest-status"]) !== -1,
          ),
      );

  console.log(data);

  // if all targets are complete, skip further fetching
  useEffect(() => {
    allTargetsComplete && setSkip(true);
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
            data={data?.filter((d) => d["release-version"] === "DRAFT") || []}
            type="draft"
            isLoading={isLoading}
            header={t("userSubmissionsDrafts")}
            depositSlug={depositSlug}
          />
          <SubmissionList
            data={data?.filter((d) => d["release-version"] === "PUBLISH") || []}
            type="published"
            isLoading={isLoading}
            header={t("userSubmissionsCompleted")}
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
  depositSlug = "deposit",
}: {
  data: SubmissionResponse[];
  isLoading: boolean;
  header: string;
  type: "draft" | "published";
  depositSlug?: string;
}) => {
  const { t, i18n } = useTranslation("user");
  const navigate = useNavigate();

  // useMemo to make sure columns don't change
  const columns = useMemo<GridColDef[]>(
    () => [{
        field: "viewLink",
        headerName: "",
        width: 30,
        getActions: (params: any) => {
          return type === "draft" 
          ? [
            <GridActionsCellItem
              icon={<EditIcon />}
              label={t("editItem")}
              onClick={() =>
                navigate(`/${depositSlug}?id=${params.row.id}`)
              }
            />,
          ]
          // for submitted forms, either edit in case of error, or load with existing data for new submission
          // params.value is true for an error, false for success
          : !params.row.processing 
          ? [
            <Tooltip title={t(params.row.error ? "retryItem" : "copyItem")} placement="bottom">
              <GridActionsCellItem
                icon={params.row.error ? <ReplayIcon /> : <ContentCopyIcon />}
                label={t(params.row.error ? "retryItem" : "copyItem")}
                onClick={() =>
                  // todo: need to work on this, how are we going to reload submitted form data for resubmission
                  navigate(`/${depositSlug}?${params.row.error ? 'id' : 'id'}=${params.row.id}`)
                }
              />
            </Tooltip>
          ]
          : []
        },
        type: "actions",
      },        
      {
        field: "title",
        headerName: t("title"),
        width: 250,
        renderCell: (params) => (params.value ? params.value : t("noTitle")),
      },
      {
        field: "created",
        headerName: type === "draft" ? t("createdOn") : t("submittedOn"),
        width: 200,
        type: "dateTime",
        valueGetter: (params) => new Date(params.value),
        renderCell: (params) => moment(params.value).format("D-M-Y - HH:mm"),
      },
      ...(type === "published"
        ? [
            {
              field: "status",
              headerName: t("submissionStatus"),
              width: 250,
              renderCell: (params: any) => (
                <Stack direction="column" pt={0.5} pb={0.5}>
                  {params.value.map((v: TargetOutput, i: number) => (
                    <SingleTargetStatus target={v} depositStatus={depositStatus} key={i} />
                  ))}
                </Stack>
              ),
            },
          ]
        : []),
    ],
    [i18n.language],
  );

  const rows =
    data &&
    data.map((d) => ({
      // Todo: API needs work and standardisation, also see types.
      error: d["targets"].some(
        (t) => depositStatus.error.indexOf(t["ingest-status"]) !== -1,
      ),
      processing: d["targets"].some(
        (t) => depositStatus.processing.indexOf(t["ingest-status"]) !== -1,
      ),
      id: d["metadata-id"],
      // viewLink: '',
      created: type === "draft" ? d["created-date"] : d["submitted-date"],
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
          }}
          rows={rows}
          columns={columns}
          disableRowSelectionOnClick
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 25 },
            },
          }}
          pageSizeOptions={[25, 50, 100]}
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

// A separate component for a target, needs to have it's own state to display popover
const SingleTargetStatus = ({depositStatus, target}: {depositStatus: DepositStatus, target: TargetOutput}) => {
  const { t } = useTranslation("user");
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const open = Boolean(anchorEl);
  const id = open ? 'popover' : undefined;

  return (
    <>
      <Stack
        direction="row"
        alignItems="center"
        pt={0.1}
        pb={0.1}
      >
        <Tooltip
          title={
            depositStatus.processing.indexOf(
              target["ingest-status"],
            ) !== -1
              ? t("processing")
              : depositStatus.error.indexOf(
                    target["ingest-status"],
                  ) !== -1
                ? t("error")
                : t("success")
          }
          placement="left"
        >
          {depositStatus.processing.indexOf(
            target["ingest-status"],
          ) !== -1 ? (
            <CircularProgress size={16} />
          ) : depositStatus.error.indexOf(target["ingest-status"]) !==
            -1 ? (
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
          ) : depositStatus.success.indexOf(
              target["ingest-status"],
            ) !== -1 ? (
            <CheckCircleIcon fontSize="small" color="success" />
          ) : (
            <PendingIcon fontSize="small" color="neutral" />
          )}
        </Tooltip>
        <Typography variant="body2" ml={1}>
          {target["target-repo-display-name"]}
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
        sx={{ maxWidth: "50rem"}}
      >
        <Box sx={{p: 2}}>
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
            {JSON.stringify(target["target-output"], null, 2)}
          </pre>
        </Box>
      </Popover>
    </>
  )
}

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
