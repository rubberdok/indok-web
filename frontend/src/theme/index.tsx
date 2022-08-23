import { useThemeModeContext } from "@hooks/useDarkMode";
import CssBaseline from "@mui/material/CssBaseline";
import { createTheme, ThemeOptions, ThemeProvider as MUIThemeProvider } from "@mui/material/styles";
import Head from "next/head";
import { ReactNode, useEffect, useMemo, useState } from "react";
import componentsOverride from "./overrides";
import palette from "./palette";
import shadows, { customShadows } from "./shadows";
import typography from "./typography";

type Props = {
  children: ReactNode;
};

const ThemeWrapper: React.FC<Props> = ({ children }) => {
  const { darkMode } = useThemeModeContext();

  const themeOptions: ThemeOptions = useMemo(
    () => ({
      palette: darkMode ? palette.dark : palette.light,
      shape: { borderRadius: 2 },
      shadows: darkMode ? shadows.dark : shadows.light,
      customShadows: darkMode ? customShadows.dark : customShadows.light,
      typography,
    }),
    [darkMode]
  );

  const theme = createTheme(themeOptions);
  theme.components = componentsOverride(theme);

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Force application of darkMode -- a little hacky solution
  if (!mounted) {
    return <MUIThemeProvider theme={theme}>{children}</MUIThemeProvider>;
  }

  return (
    <MUIThemeProvider theme={theme}>
      <Head>
        <meta name="theme-color" content={darkMode ? "#0f1217" : "#fff"} />
      </Head>
      <CssBaseline />
      {children}
    </MUIThemeProvider>
  );
};

export default ThemeWrapper;
