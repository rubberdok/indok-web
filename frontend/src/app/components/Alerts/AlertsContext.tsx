"use client";
import { Alert, AlertTitle, Snackbar } from "@mui/material";
import { createContext, useContext, useState } from "react";

type Alert = {
  message?: string;
  type: "error" | "info" | "success";
  title?: string;
};

const AlertsContext = createContext<{
  alerts: Alert[];
  notify: (alert: Alert) => void;
}>({ alerts: [], notify: () => {} });

function AlertsWrapper({ children }: React.PropsWithChildren) {
  const [alerts, setAlerts] = useState<(Alert & { timestamp: number })[]>([]);
  const currentAlert: (Alert & { timestamp: number }) | undefined = alerts[0];

  const notify = (alert: Alert) => {
    setAlerts((previousAlerts) => {
      const newAlerts = previousAlerts.concat({
        ...alert,
        timestamp: Date.now(),
      });
      return newAlerts;
    });
  };

  function removeAlert() {
    setAlerts((previousAlerts) => {
      return previousAlerts.slice(1);
    });
  }

  return (
    <AlertsContext.Provider value={{ alerts, notify }}>
      {children}
      <Snackbar
        autoHideDuration={10_000}
        key={currentAlert?.timestamp}
        open={Boolean(currentAlert)}
        onClose={() => removeAlert()}
      >
        <Alert severity={currentAlert?.type} onClose={() => removeAlert()}>
          {currentAlert?.title && <AlertTitle>{currentAlert.title}</AlertTitle>}
          {currentAlert?.message}
        </Alert>
      </Snackbar>
    </AlertsContext.Provider>
  );
}

function useAlerts(): { alerts: Alert[]; notify: (alert: Alert) => void } {
  return useContext(AlertsContext);
}

export { AlertsWrapper, useAlerts };
