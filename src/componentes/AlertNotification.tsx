import {
  AlertNotificationRoot,
  ALERT_TYPE,
  Toast,
} from "react-native-alert-notification";

type AlertProps = {
  type: "success" | "error";
  title: string;
  message: string;
  children: React.ReactElement;
};

export const showAlert = (
  type: "success" | "error",
  title: string,
  message: string
) => {
  Toast.show({
    type: type === "success" ? ALERT_TYPE.SUCCESS : ALERT_TYPE.DANGER,
    title,
    textBody: message,
  });
};

const AlertNotification: React.FC<{ children: React.ReactElement }> = ({ children }) => (
  <AlertNotificationRoot>{children}</AlertNotificationRoot>
);

export default AlertNotification;
