import { ToggleButton, ToggleButtonGroup, ToggleButtonGroupProps } from "@mui/material";
import { LightModeOutlined, SettingsBrightness, DarkModeOutlined } from "@mui/icons-material";

import { useTernaryDarkMode } from "usehooks-ts";

export type Props = ToggleButtonGroupProps;

const Toggle: React.FC<Props> = (props) => {
  const { ternaryDarkMode, setTernaryDarkMode } = useTernaryDarkMode();
  return (
    <>
      <ToggleButtonGroup
        value={ternaryDarkMode}
        onChange={(_e, value: "light" | "system" | "dark") => setTernaryDarkMode(value)}
        exclusive
        size="small"
        color="info"
        {...props}
      >
        <ToggleButton value="light" aria-label="Light">
          <LightModeOutlined fontSize="small" />
        </ToggleButton>
        <ToggleButton value="system" aria-label="System">
          <SettingsBrightness fontSize="small" />
        </ToggleButton>
        <ToggleButton value="dark" aria-label="Dark">
          <DarkModeOutlined fontSize="small" />
        </ToggleButton>
      </ToggleButtonGroup>
    </>
  );
};

export default Toggle;
