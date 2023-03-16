import { Brightness6, DarkMode, LightMode } from "@mui/icons-material";
import { IconButton, NoSsr, Slide, Stack, Tooltip } from "@mui/material";
import { useColorScheme } from "@mui/material/styles";
import { useRef } from "react";

export const ColorModeSwitcher: React.FC = () => {
  const containerRef = useRef(null);
  const { mode, setMode } = useColorScheme();

  return (
    <NoSsr>
      <Stack ref={containerRef} justifyContent="center" alignItems="center">
        {mode === "light" && (
          <Slide direction="down" in={mode === "light"} container={containerRef.current}>
            <Tooltip title="Dag">
              <IconButton size="small" onClick={() => setMode("dark")} sx={{ color: "text.primary" }}>
                <LightMode fontSize="small" />
              </IconButton>
            </Tooltip>
          </Slide>
        )}
        {mode === "dark" && (
          <Slide direction="down" in={mode === "dark"} container={containerRef.current}>
            <Tooltip title="Natt">
              <IconButton size="small" onClick={() => setMode("system")} sx={{ color: "text.primary" }}>
                <DarkMode fontSize="small" />
              </IconButton>
            </Tooltip>
          </Slide>
        )}
        {mode === "system" && (
          <Slide direction="down" in={mode === "system"} container={containerRef.current}>
            <Tooltip title="Automatisk">
              <IconButton size="small" onClick={() => setMode("light")} sx={{ color: "text.primary" }}>
                <Brightness6 fontSize="small" />
              </IconButton>
            </Tooltip>
          </Slide>
        )}
      </Stack>
    </NoSsr>
  );
};
