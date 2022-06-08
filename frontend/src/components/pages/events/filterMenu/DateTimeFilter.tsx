import { FilterQuery } from "@components/pages/events/AllEvents";
import { Grid, TextField } from "@mui/material";
import React from "react";

interface Props {
  filters: FilterQuery;
  onFiltersChange: (query: FilterQuery) => void;
}

/**
 * Component for the date filter in the filter menu
 *
 * Props:
 * - filters: the currently applied filters
 * - onFiltersChange: method called when filters are updated
 */

const DateTimeFilter: React.FC<Props> = ({ filters, onFiltersChange }) => {
  return (
    <>
      <Grid container item direction="column">
        <Grid item>
          <TextField
            id="date"
            label="Starttid"
            type="datetime-local"
            fullWidth
            margin="normal"
            value={filters?.startTime?.split("T")[0] ?? ""}
            InputLabelProps={{ shrink: true }}
            onChange={(e) => onFiltersChange({ ...filters, startTime: `${e.currentTarget.value}T00:00` })}
          />
        </Grid>
        <Grid item>
          <TextField
            id="date"
            label="Sluttid"
            type="datetime-local"
            fullWidth
            value={filters?.endTime?.split("T")[0] ?? ""}
            InputLabelProps={{ shrink: true }}
            onChange={(e) => onFiltersChange({ ...filters, endTime: `${e.currentTarget.value}T00:00` })}
          />
        </Grid>
      </Grid>
    </>
  );
};

export default DateTimeFilter;
