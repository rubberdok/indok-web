import { Breakpoint } from "@mui/material";
import { Theme } from "@mui/material/styles";
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

export const useResponsive = (options: UpOrDown | Only | Between): boolean => {
  let queryFn: (theme: Theme) => string;
  if (options.query === "between") {
    queryFn = (theme) => theme.breakpoints[options.query](options.start, options.end);
  } else if (options.query === "only") {
    queryFn = (theme) => theme.breakpoints[options.query](options.key);
  } else {
    queryFn = (theme: Theme) => theme.breakpoints[options.query](options.key);
  }
  return useMediaQuery(queryFn);
};
