import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import { SunDim, Monitor, Moon } from "phosphor-react";
import { useTernaryDarkMode } from "usehooks-ts";

const Toggle: React.FC = () => {
  const { ternaryDarkMode, setTernaryDarkMode } = useTernaryDarkMode();
  return (
    <>
      <ToggleButtonGroup
        value={ternaryDarkMode}
        onChange={(_e, value: "light" | "system" | "dark") => setTernaryDarkMode(value)}
        exclusive
        size="small"
        color="info"
      >
        <ToggleButton value="light" aria-label="Light">
          <SunDim />
        </ToggleButton>
        <ToggleButton value="system" aria-label="System">
          <Monitor />{" "}
        </ToggleButton>
        <ToggleButton value="dark" aria-label="Dark">
          <Moon />
        </ToggleButton>
      </ToggleButtonGroup>
    </>
  );
};

export default Toggle;
