import CssBaseline from "@mui/material/CssBaseline";
import {
  createTheme,
  responsiveFontSizes,
  ThemeOptions,
  ThemeProvider as MUIThemeProvider,
} from "@mui/material/styles";
import Head from "next/head";
import React, { useMemo } from "react";

import { getDesignTokens } from "@/theme";

type Props = {
  children: React.ReactNode;
};

const getColorTheme = () => {
  if (typeof window !== "undefined") {
    const prefersDarkMode = window.matchMedia("(prefers-color-scheme: dark)");
    if (prefersDarkMode.matches) {
      return "dark";
    }
  }
  return "light";
};

export const ThemeProvider: React.FC<React.PropsWithChildren<Props>> = ({ children }) => {
  const location = typeof window !== "undefined" ? window.location : { pathname: "" };
  console.log(location.pathname);
  const isJanusTheme = location.pathname.includes("janus");

  const themeOptions: ThemeOptions = useMemo(
    () => getDesignTokens(isJanusTheme ? "janus" : getColorTheme()),
    [isJanusTheme]
  );

  const theme = createTheme(themeOptions);
  const responsiveTheme = responsiveFontSizes(theme);

  return (
    <MUIThemeProvider theme={responsiveTheme}>
      <Head>
        <meta name="theme-color" />
      </Head>
      <CssBaseline />
      {children}
    </MUIThemeProvider>
  );
};
