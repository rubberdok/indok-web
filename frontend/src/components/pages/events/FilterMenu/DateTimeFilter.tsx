import { Grid, TextField } from "@mui/material";
import React from "react";

type Props = {
  /** The currently applied filters */
  endBeforeFilter?: string | null;
  startAfterFilter?: string | null;
  /** Function called when filters are updated */
  onDateTimeFilterChange: (dateTimeFilter: { endBefore?: string | null; startAfter?: string | null }) => void;
};

/** Component for the date filter in the filter menu. */
export const DateTimeFilter: React.FC<Props> = ({ endBeforeFilter, startAfterFilter, onDateTimeFilterChange }) => {
  return (
    <>
      <Grid container item direction="column">
        <Grid item>
          <TextField
            id="date"
            label="Starttid"
            type="date"
            fullWidth
            margin="normal"
            value={startAfterFilter}
            InputLabelProps={{ shrink: true }}
            onChange={(e) => onDateTimeFilterChange({ startAfter: e.currentTarget.value, endBefore: endBeforeFilter })}
          />
        </Grid>
        <Grid item>
          <TextField
            id="date"
            label="Sluttid"
            type="date"
            fullWidth
            value={endBeforeFilter}
            InputLabelProps={{ shrink: true }}
            onChange={(e) => onDateTimeFilterChange({ endBefore: e.currentTarget.value, startAfter: startAfterFilter })}
          />
        </Grid>
      </Grid>
    </>
  );
};
