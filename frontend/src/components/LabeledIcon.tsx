import { Stack, StackProps, SxProps } from "@mui/material";
import { ReactElement } from "react";

interface Props extends StackProps {
  icon: ReactElement;
  value: ReactElement;
  endIcon?: boolean;
  sx?: SxProps;
}

export const LabeledIcon: React.FC<Props> = ({ icon, value, endIcon = false, sx, ...other }) => (
  <Stack
    direction="row"
    alignItems="center"
    sx={{
      typography: "body2",
      ...sx,
    }}
    {...other}
  >
    {!endIcon && icon}
    {value}
    {endIcon && icon}
  </Stack>
);
