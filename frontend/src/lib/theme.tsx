import { useMediaQuery } from "@mui/material";
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

const ThemeProvider: React.FC<Props> = ({ children }) => {
  const isDarkMode = useMediaQuery("(prefers-color-scheme: dark)");

  const themeOptions: ThemeOptions = useMemo(() => getDesignTokens(isDarkMode ? "dark" : "light"), [isDarkMode]);

  const theme = createTheme(themeOptions);
  const responsiveTheme = responsiveFontSizes(theme);

  return (
    <MUIThemeProvider theme={responsiveTheme}>
      <Head>
        <meta name="theme-color" content={isDarkMode ? "#121212" : "#fff"} />
      </Head>
      <CssBaseline />
      {children}
    </MUIThemeProvider>
  );
};

export default ThemeProvider;
