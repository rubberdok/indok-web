import React from "react";

import { ThemeRegistry } from "@/lib/mui";

export const ThemeProvider: React.FC<React.PropsWithChildren<unknown>> = ({ children }) => {
  return <ThemeRegistry>{children}</ThemeRegistry>;
};
