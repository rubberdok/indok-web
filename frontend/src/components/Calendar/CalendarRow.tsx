import { Grid } from "@mui/material";
import React, { ReactElement } from "react";

type Props = {
  index: number;
  children?: ReactElement | ReactElement[];
};

const CalendarRow: React.FC<Props> = ({ index, children }) => {
  return (
    <Grid item container xs component="tr" key={`row-${index}`} wrap="nowrap">
      {children}
    </Grid>
  );
};

export default CalendarRow;
