import { LoadingButtonClassKey } from "@mui/lab";
import { Theme } from "@mui/material";

/* Certain components are not of the core theme, so we extend the components here to include them */
type Overrides = {
  MuiLoadingButton?: Partial<Record<LoadingButtonClassKey, React.CSSProperties | (() => React.CSSProperties)>>;
} & Theme["components"];

export type ComponentOverride = (theme: Theme) => Overrides;
