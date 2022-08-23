import { useMediaQuery } from "@mui/material";
import React, { createContext, useContext, useEffect } from "react";
import useLocalStorage from "./useLocalStorage";

type ThemeModeProps = {
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
};

const ThemeModeContext = createContext<ThemeModeProps>({
  darkMode: true,
  setDarkMode: (value: boolean) => value,
});

export const ThemeModeProvider: React.FC = ({ children }) => {
  const [darkMode, setDarkMode] = useDarkMode();

  return (
    <ThemeModeContext.Provider value={{ darkMode: darkMode, setDarkMode: setDarkMode }}>
      {children}
    </ThemeModeContext.Provider>
  );
};

export const useThemeModeContext = (): ThemeModeProps => useContext(ThemeModeContext);

const useDarkMode = (): any => {
  // Use our useLocalStorage hook to persist state through a page refresh.
  const [enabledState, setEnabledState] = useLocalStorage<boolean>("dark-mode-enabled", false);
  // See if user has set a browser or OS preference for dark mode.
  const prefersDarkMode = usePrefersDarkMode();
  // If enabledState is defined use it, otherwise fallback to prefersDarkMode.
  const enabled = enabledState ?? prefersDarkMode;

  // Return enabled state and setter
  return [enabled, setEnabledState];
};

// Compose our useMedia hook to detect dark mode preference.
function usePrefersDarkMode() {
  return useMediaQuery("(prefers-color-scheme: dark)");
}

export default useDarkMode;
