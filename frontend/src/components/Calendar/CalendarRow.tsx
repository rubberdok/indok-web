import { Grid } from "@material-ui/core";
import React, { ReactElement } from "react";

interface Props {
  index: number;
  children?: ReactElement | ReactElement[];
}

const CalendarRow: React.VFC<Props> = (props) => {
  return (
    <Grid item container xs component="tr" key={`row-${props.index}`} wrap="nowrap">
      {props.children}
    </Grid>
  );
};

export default CalendarRow;
