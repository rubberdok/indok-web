import { Breakpoint } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

type Query = "up" | "down" | "between" | "only";

type Props = (
  query: Query,
  key?: Breakpoint | number,
  start?: Breakpoint | number,
  end?: Breakpoint | number
) => boolean | undefined;

const useResponsive: Props = (query, key, start, end) => {
  const theme = useTheme();

  const mediaUp = useMediaQuery(theme.breakpoints.up(key as Breakpoint | number));
  const mediaDown = useMediaQuery(theme.breakpoints.down(key as Breakpoint | number));
  const mediaBetween = useMediaQuery(
    theme.breakpoints.between(start as Breakpoint | number, end as Breakpoint | number)
  );
  const mediaOnly = useMediaQuery(theme.breakpoints.only(key as Breakpoint));

  switch (query) {
    case "up":
      return mediaUp;
    case "down":
      return mediaDown;
    case "between":
      return mediaBetween;
    case "only":
      return mediaOnly;
    default:
      break;
  }
};

export default useResponsive;
