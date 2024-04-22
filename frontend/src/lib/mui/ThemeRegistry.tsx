"use client";

import { CssBaseline } from "@mui/material";
import {
  Experimental_CssVarsProvider as ThemeProvider,
  experimental_extendTheme as extendTheme,
  getInitColorSchemeScript,
  responsiveFontSizes,
} from "@mui/material/styles";

import NextAppDirEmotionCacheProvider from "./EmotionCache";
import { getCssVarsDesignTokens } from "./theme";

const designTokens = getCssVarsDesignTokens();
const theme = extendTheme(designTokens);
const responsiveTheme = responsiveFontSizes(theme);

export default function ThemeRegistry({ children }: { children: React.ReactNode }) {
  return (
    <>
      {getInitColorSchemeScript({
        defaultMode: "system",
        colorSchemeStorageKey: "color-scheme",
        modeStorageKey: "mode",
        attribute: "data-color-scheme",
      })}
      <NextAppDirEmotionCacheProvider options={{ key: "mui" }}>
        <ThemeProvider
          theme={responsiveTheme}
          defaultMode="system"
          colorSchemeStorageKey="color-scheme"
          modeStorageKey="mode"
          attribute="data-color-scheme"
        >
          {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
          <CssBaseline />
          {children}
        </ThemeProvider>
      </NextAppDirEmotionCacheProvider>
    </>
  );
}
