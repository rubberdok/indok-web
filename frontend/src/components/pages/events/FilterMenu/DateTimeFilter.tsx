import { Grid, TextField } from "@mui/material";
import React from "react";

type Props = {
  /** The currently applied filters */
  dateTimeFilter: {
    startAt?: string;
    endAt?: string;
  };
  /** Function called when filters are updated */
  onDateTimeFilterChange: (dateTimeFilter: { startAt?: string; endAt?: string }) => void;
};

/** Component for the date filter in the filter menu. */
export const DateTimeFilter: React.FC<Props> = ({ dateTimeFilter, onDateTimeFilterChange }) => {
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
            value={dateTimeFilter.startAt}
            InputLabelProps={{ shrink: true }}
            onChange={(e) => onDateTimeFilterChange({ startAt: e.currentTarget.value, endAt: dateTimeFilter.endAt })}
          />
        </Grid>
        <Grid item>
          <TextField
            id="date"
            label="Sluttid"
            type="date"
            fullWidth
            value={dateTimeFilter.endAt}
            InputLabelProps={{ shrink: true }}
            onChange={(e) => onDateTimeFilterChange({ endAt: e.currentTarget.value, startAt: dateTimeFilter.endAt })}
          />
        </Grid>
      </Grid>
    </>
  );
};
