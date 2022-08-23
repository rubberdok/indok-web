import { useThemeModeContext } from "@hooks/useDarkMode";
import { Box, IconButton } from "@mui/material";
import { Moon, SunDim } from "phosphor-react";

const DarkModeToggle: React.FC = (...props) => {
  const { darkMode, setDarkMode } = useThemeModeContext();

  return (
    <Box {...props}>
      {darkMode ? (
        <IconButton onClick={() => setDarkMode(false)}>
          <Moon />
        </IconButton>
      ) : (
        <IconButton onClick={() => setDarkMode(true)}>
          <SunDim />
        </IconButton>
      )}
    </Box>
  );
};

export default DarkModeToggle;
