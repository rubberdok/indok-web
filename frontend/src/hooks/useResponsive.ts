import { Breakpoint } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

type UpOrDown = {
  query: "up" | "down";
  key: Breakpoint | number;
};

type Only = {
  query: "only";
  key: Breakpoint;
};

type Between = {
  query: "between";
  start: Breakpoint | number;
  end: Breakpoint | number;
};

const useResponsive = (options: UpOrDown | Only | Between): boolean => {
  const theme = useTheme();
  let queryInput: string;
  if (options.query === "between") {
    queryInput = theme.breakpoints[options.query](options.start, options.end);
  } else if (options.query === "only") {
    queryInput = theme.breakpoints[options.query](options.key);
  } else {
    queryInput = theme.breakpoints[options.query](options.key);
  }
  return useMediaQuery(queryInput);
};

export default useResponsive;
