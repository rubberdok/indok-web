import CssBaseline from "@mui/material/CssBaseline";
import {
  createTheme,
  responsiveFontSizes,
  ThemeOptions,
  ThemeProvider as MUIThemeProvider,
} from "@mui/material/styles";
import Head from "next/head";
import React, { useMemo } from "react";
import { getDesignTokens } from "src/theme";
import { useTernaryDarkMode } from "usehooks-ts";

interface Props {
  children: React.ReactNode;
}

const ThemeProvider: React.FC<Props> = ({ children }) => {
  const { isDarkMode } = useTernaryDarkMode();

  const themeOptions: ThemeOptions = useMemo(() => getDesignTokens(isDarkMode ? "dark" : "light"), [isDarkMode]);

  const theme = createTheme(themeOptions);
  const responsiveTheme = responsiveFontSizes(theme);

  return (
    <MUIThemeProvider theme={responsiveTheme}>
      <Head>
        <meta name="theme-color" content={isDarkMode ? "#0f1217" : "#fff"} />
      </Head>
      <CssBaseline />
      {children}
    </MUIThemeProvider>
  );
};

export default ThemeProvider;
