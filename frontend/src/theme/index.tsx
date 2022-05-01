import { useMediaQuery } from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";
import { createTheme, ThemeOptions, ThemeProvider as MUIThemeProvider } from "@mui/material/styles";
import { ReactNode, useMemo } from "react";
import componentsOverride from "./overrides";
import palette from "./palette";
import shadows, { customShadows } from "./shadows";
import typography from "./typography";

type Props = {
  children: ReactNode;
};

const ThemeWrapper: React.FC<Props> = ({ children }) => {
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");

  const themeOptions: ThemeOptions = useMemo(
    () => ({
      palette: prefersDarkMode ? palette.dark : palette.light,
      shape: { borderRadius: 0 },
      shadows: prefersDarkMode ? shadows.dark : shadows.light,
      customShadows: prefersDarkMode ? customShadows.dark : customShadows.light,
      typography,
    }),
    [prefersDarkMode]
  );

  const theme = createTheme(themeOptions);
  theme.components = componentsOverride(theme);

  return (
    <MUIThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </MUIThemeProvider>
  );
};

export default ThemeWrapper;
