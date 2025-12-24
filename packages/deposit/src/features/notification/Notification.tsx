import { forwardRef } from "react";
import {
  getNotification,
  closeNotification,
  clearNotification,
  type NotificationSliceState as NotificationState
} from "./notificationSlice";
import { useStoreHooks } from "@dans-framework/shared-store";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert, { AlertProps } from "@mui/material/Alert";

const Alert = forwardRef<HTMLDivElement, AlertProps>(
  function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  },
);

const Notification = () => {
  const { useAppDispatch, useAppSelector } = useStoreHooks<NotificationState>();
  const notification = useAppSelector(getNotification);
  const dispatch = useAppDispatch();

  return (
    <Snackbar
      open={notification.open}
      onClose={() => dispatch(closeNotification())}
      key={notification.data ? notification.data.id : undefined}
      autoHideDuration={6000}
      TransitionProps={{ onExited: () => dispatch(clearNotification()) }}
    >
      <Alert
        onClose={() => dispatch(closeNotification())}
        severity={notification.data && notification.data.type}
        sx={{ width: "100%" }}
      >
        {notification.data && notification.data.message}
      </Alert>
    </Snackbar>
  );
};

export default Notification;
