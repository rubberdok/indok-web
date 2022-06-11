/* https://mui.com/material-ui/about-the-lab/#typescript */
import type {} from "@mui/lab/themeAugmentation";
import { Theme } from "@mui/material";

export type ComponentOverride = (theme: Theme) => Theme["components"];
