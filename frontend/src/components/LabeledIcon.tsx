// @mui
import { Stack, StackProps, SxProps } from "@mui/material";
import { ReactElement } from "react";

// ----------------------------------------------------------------------

interface Props extends StackProps {
  icon: ReactElement;
  value: any;
  endIcon?: boolean;
  sx?: SxProps;
}

const LabeledIcon: React.FC<Props> = ({ icon, value, endIcon = false, sx, ...other }) => {
  return (
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
};

export default LabeledIcon;
