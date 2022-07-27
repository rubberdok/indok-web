import { IconButton } from "@mui/material";
import { Monitor, Moon, SunDim } from "phosphor-react";
import { useTernaryDarkMode } from "usehooks-ts";
import Toggle, { Props as ToggleProps } from "./variants/Toggle";

interface Props extends ToggleProps {
  variant?: "select" | "toggle";
}

const DarkModeToggle: React.FC<Props> = ({ variant = "select", ...props }) => {
  const { ternaryDarkMode, setTernaryDarkMode } = useTernaryDarkMode();

  if (variant === "toggle") return <Toggle {...props} />;

  switch (ternaryDarkMode) {
    case "light":
      return (
        <IconButton onClick={() => setTernaryDarkMode("dark")}>
          <Moon />
        </IconButton>
      );
    case "dark":
      return (
        <IconButton onClick={() => setTernaryDarkMode("system")}>
          <Monitor />
        </IconButton>
      );
    case "system":
      return (
        <IconButton onClick={() => setTernaryDarkMode("light")}>
          <SunDim />
        </IconButton>
      );
  }
};

export default DarkModeToggle;
