import { ToggleButton, ToggleButtonGroup, ToggleButtonGroupProps } from "@mui/material";
import { SunDim, Monitor, Moon } from "phosphor-react";
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
