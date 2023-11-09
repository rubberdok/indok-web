import { Grid } from "@mui/material";
import React, { ReactElement } from "react";

type Props = {
  children?: ReactElement | ReactElement[];
};

export const CalendarRow: React.FC<React.PropsWithChildren<Props>> = ({ children }) => {
  return (
    <Grid item container xs component="tr" wrap="nowrap">
      {children}
    </Grid>
  );
};
