import { forwardRef, useCallback } from "react";
import { isRejectedWithValue } from "@reduxjs/toolkit";
import type { Middleware } from "@reduxjs/toolkit";
import {
  enqueueSnackbar,
  SnackbarContent,
  CustomContentProps,
  useSnackbar,
} from "notistack";
import Alert from "@mui/material/Alert";
import Typography from "@mui/material/Typography";
import AlertTitle from "@mui/material/AlertTitle";
import { getUser } from "@dans-framework/utils/user";

/**
 * Log a warning and show a toast!
 */
export const errorLogger: Middleware = () => (next) => async (action) => {
  // RTK Query uses `createAsyncThunk` from redux-toolkit under the hood, so we're able to utilize these matchers!
  if (isRejectedWithValue(action)) {
    console.error("We got a rejected action!");
    console.error(action);
    // Set error message, keep it simple for the user
    const error =
      action.payload.error || action.payload.data || action.error.message;

    // Set conditions for when to post a ticket to freshdesk, if freshdesk is enabled
    let ticket;

    if (
      // freshdesk enabled?
      import.meta.env.VITE_FRESHDESK_API_KEY &&
      // only create a ticket when something's gone wrong with the actual submission
      action.meta.arg.endpointName === "submitData"
    ) {
      ticket = await sendTicket(action);
    }

    // Ugly check for not showing snackbar on invalid API key, as called in the Deposit package
    if (action.meta.arg.endpointName !== "validateAllKeys") {
      enqueueSnackbar(error, { variant: "customError", ticket: ticket });
    }
  }

  return next(action);
};

declare module "notistack" {
  interface VariantOverrides {
    // adds `customError` variant and specifies the
    // "extra" props it takes in options of `enqueueSnackbar`
    customError: {
      ticket?: any;
    };
  }
}

interface CustomErrorProps extends CustomContentProps {
  ticket?: any;
}

export const CustomError = forwardRef<HTMLDivElement, CustomErrorProps>(
  ({ id, ticket, ...props }, ref) => {
    const { message } = props;
    const { closeSnackbar } = useSnackbar();

    const handleDismiss = useCallback(() => {
      closeSnackbar(id);
    }, [id, closeSnackbar]);

    return (
      <SnackbarContent ref={ref}>
        <Alert
          variant="filled"
          severity="error"
          sx={{
            boxShadow:
              "0px 3px 5px -1px rgba(0,0,0,0.2),0px 6px 10px 0px rgba(0,0,0,0.14),0px 1px 18px 0px rgba(0,0,0,0.12)",
          }}
          onClose={handleDismiss}
        >
          <AlertTitle>Error: {message}</AlertTitle>
          {ticket && (
            <Typography>
              This error has been forwarded to our support team.
            </Typography>
          )}
        </Alert>
      </SnackbarContent>
    );
  },
);

// Freshdesk ticketing system
export const sendTicket = async (data: any) => {
  const encodedCredentials = btoa(
    `${import.meta.env.VITE_FRESHDESK_API_KEY}:X`,
  );
  const user = getUser();
  const response = await fetch(
    `${import.meta.env.VITE_FRESHDESK_URL}/api/v2/tickets`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${encodedCredentials}`,
      },
      body: JSON.stringify({
        subject: "dans-frontend-framework error",
        type: "Incident",
        priority: 2,
        status: 2,
        group_id: parseInt(import.meta.env.VITE_FRESHDESK_GROUP),
        responder_id: parseInt(import.meta.env.VITE_FRESHDESK_AGENT),
        email: user?.profile.email,
        description:
          `<h6>URL</h6>` +
          `<p>${window.location.href}</p>` +
          `<h6>Error data</h6>` +
          `<pre>${JSON.stringify(data, undefined, 2)}</pre>` +
          `<h6>User data</h6>` +
          `<pre>${JSON.stringify(user, undefined, 2)}</pre>`,
        custom_fields: {
          cf_responsibility: "Root Cause Analysis",
          cf_assigned_to: import.meta.env.VITE_FRESHDESK_ASSIGNED_TO,
        },
      }),
    },
  );

  if (!response.ok) {
    console.error("Error submitting freshdesk ticket");
    console.error(response);
    return;
  }

  const json = await response.json();

  console.log("Freshdesk ticket submitted");
  console.log(json);

  return json;
};
