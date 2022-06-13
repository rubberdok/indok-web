import { IconButton } from "@mui/material";
import { Monitor, Moon, SunDim } from "phosphor-react";
import { useTernaryDarkMode } from "usehooks-ts";
import Toggle from "./variants/Toggle";

type Props = {
  variant?: "select" | "toggle";
};

const DarkModeToggle: React.FC<Props> = ({ variant = "select" }) => {
  const { ternaryDarkMode, setTernaryDarkMode } = useTernaryDarkMode();

  if (variant === "toggle") return <Toggle />;

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
