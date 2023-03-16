import { Brightness6, DarkMode, LightMode } from "@mui/icons-material";
import { Box, IconButton, Slide, Tooltip } from "@mui/material";
import { useColorScheme } from "@mui/material/styles";
import { useRef } from "react";

export const ColorModeSwitcher: React.FC = () => {
  const containerRef = useRef(null);
  const { mode, setMode } = useColorScheme();

  return (
    <Box ref={containerRef}>
      {mode === "light" && (
        <Slide direction="up" in={mode === "light"}>
          <Tooltip title="Dag">
            <IconButton size="small" onClick={() => setMode("dark")} sx={{ color: "text.primary" }}>
              <LightMode fontSize="small" />
            </IconButton>
          </Tooltip>
        </Slide>
      )}
      {mode === "dark" && (
        <Slide direction="up" in={mode === "dark"}>
          <Tooltip title="Natt">
            <IconButton size="small" onClick={() => setMode("system")} sx={{ color: "text.primary" }}>
              <DarkMode fontSize="small" />
            </IconButton>
          </Tooltip>
        </Slide>
      )}
      {mode === "system" && (
        <Slide direction="up" in={mode === "system"}>
          <Tooltip title="Automatisk">
            <IconButton size="small" onClick={() => setMode("light")} sx={{ color: "text.primary" }}>
              <Brightness6 fontSize="small" />
            </IconButton>
          </Tooltip>
        </Slide>
      )}
    </Box>
  );
};
