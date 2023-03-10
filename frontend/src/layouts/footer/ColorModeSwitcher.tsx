import { LightMode, DarkMode, SettingsBrightness } from "@mui/icons-material";
import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import { useColorScheme } from "@mui/material/styles";

export const ColorModeSwitcher: React.FC = () => {
  const { mode, setMode } = useColorScheme();

  function handleModeChange(_: React.MouseEvent<HTMLElement>, newMode: "system" | "light" | "dark" | null) {
    if (newMode === null) return;
    setMode(newMode);
  }

  return (
    <ToggleButtonGroup exclusive value={mode} size="small" onChange={handleModeChange} color="standard">
      <ToggleButton value="light">
        <LightMode fontSize="inherit" />
      </ToggleButton>
      <ToggleButton value="system">
        <SettingsBrightness fontSize="inherit" />
      </ToggleButton>
      <ToggleButton value="dark">
        <DarkMode fontSize="inherit" />
      </ToggleButton>
    </ToggleButtonGroup>
  );
};
