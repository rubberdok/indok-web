import CssBaseline from "@mui/material/CssBaseline";
import {
  Experimental_CssVarsProvider as CssVarsProvider,
  experimental_extendTheme as extendTheme,
  responsiveFontSizes,
} from "@mui/material/styles";
import React, { useMemo } from "react";

import { getCssVarsDesignTokens } from "@/lib/mui/theme";

export const ThemeProvider: React.FC<React.PropsWithChildren<unknown>> = ({ children }) => {
  const themeOptions = useMemo(() => getCssVarsDesignTokens(), []);

  const theme = extendTheme(themeOptions);
  const responsiveTheme = responsiveFontSizes(theme);

  return (
    <CssVarsProvider
      theme={responsiveTheme}
      defaultMode="system"
      colorSchemeStorageKey="color-scheme"
      modeStorageKey="mode"
      attribute="data-color-scheme"
    >
      <CssBaseline />
      {children}
    </CssVarsProvider>
  );
};
