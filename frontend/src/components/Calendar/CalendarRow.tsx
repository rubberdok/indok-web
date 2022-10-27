import { Grid } from "@mui/material";
import React, { ReactElement } from "react";

type Props = {
  index: number;
  children?: ReactElement | ReactElement[];
};

export const CalendarRow: React.FC<React.PropsWithChildren<Props>> = ({ index, children }) => {
  return (
    <Grid item container xs component="tr" key={`row-${index}`} wrap="nowrap">
      {children}
    </Grid>
  );
};
