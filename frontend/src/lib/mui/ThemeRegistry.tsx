"use client";

import { CssBaseline } from "@mui/material";
import {
  Experimental_CssVarsProvider as ThemeProvider,
  experimental_extendTheme as extendTheme,
  responsiveFontSizes,
} from "@mui/material/styles";
import NextAppDirEmotionCacheProvider from "./EmotionCache";
import { getCssVarsDesignTokens } from "./theme";

export default function ThemeRegistry({ children }: { children: React.ReactNode }) {
  const designTokens = getCssVarsDesignTokens();
  const theme = extendTheme(designTokens);
  const responsiveTheme = responsiveFontSizes(theme);

  return (
    <NextAppDirEmotionCacheProvider options={{ key: "mui" }}>
      <ThemeProvider theme={responsiveTheme}>
        {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
        <CssBaseline />
        {children}
      </ThemeProvider>
    </NextAppDirEmotionCacheProvider>
  );
}
