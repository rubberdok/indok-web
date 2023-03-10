import CssBaseline from "@mui/material/CssBaseline";
import {
  Experimental_CssVarsProvider as CssVarsProvider,
  experimental_extendTheme as extendTheme,
  responsiveFontSizes,
} from "@mui/material/styles";
import React, { useMemo } from "react";

import { getCssVarsDesignTokens } from "@/theme";

type Props = {
  children: React.ReactNode;
};

export const ThemeProvider: React.FC<React.PropsWithChildren<Props>> = ({ children }) => {
  const themeOptions = useMemo(() => getCssVarsDesignTokens(), []);

  const theme = extendTheme(themeOptions);
  const responsiveTheme = responsiveFontSizes(theme);

  return (
    <CssVarsProvider theme={responsiveTheme}>
      <CssBaseline />
      {children}
    </CssVarsProvider>
  );
};
