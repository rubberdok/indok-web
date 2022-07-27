import CssBaseline from "@mui/material/CssBaseline";
import { createTheme, ThemeOptions, ThemeProvider as MUIThemeProvider } from "@mui/material/styles";
import { ReactNode, useMemo } from "react";
import { useTernaryDarkMode } from "usehooks-ts";
import componentsOverride from "./overrides";
import palette from "./palette";
import shadows, { customShadows } from "./shadows";
import typography from "./typography";

type Props = {
  children: ReactNode;
};

const ThemeWrapper: React.FC<Props> = ({ children }) => {
  const { isDarkMode } = useTernaryDarkMode();

  const themeOptions: ThemeOptions = useMemo(
    () => ({
      palette: isDarkMode ? palette.dark : palette.light,
      shape: { borderRadius: 2 },
      shadows: isDarkMode ? shadows.dark : shadows.light,
      customShadows: isDarkMode ? customShadows.dark : customShadows.light,
      typography,
    }),
    [isDarkMode]
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
