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
  const lightMode = true;

  const themeOptions: ThemeOptions = useMemo(
    () => ({
      palette: lightMode ? palette.light : palette.dark,
      shape: { borderRadius: 0 },
      shadows: lightMode ? shadows.light : shadows.dark,
      customShadows: lightMode ? customShadows.light : customShadows.dark,
      typography,
    }),
    [lightMode]
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
