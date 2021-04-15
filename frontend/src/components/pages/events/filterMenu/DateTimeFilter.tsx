import { ListItem, TextField } from "@material-ui/core";
import React from "react";
import { FilterQuery } from "../AllEvents";

interface Props {
  filters: FilterQuery;
  onFiltersChange: (query: FilterQuery) => void;
}

const DateTimeFilter: React.FC<Props> = ({ filters, onFiltersChange }) => {
  return (
    <>
      <ListItem>
        <TextField
          id="date"
          label="Starttid"
          type="date"
          fullWidth
          margin="normal"
          value={filters?.startTime?.split("T")[0] ?? ""}
          InputLabelProps={{ shrink: true }}
          onChange={(e) => onFiltersChange({ ...filters, startTime: `${e.currentTarget.value}T00:00` })}
        />
      </ListItem>
      <ListItem>
        <TextField
          id="date"
          label="Sluttid"
          type="date"
          fullWidth
          value={filters?.endTime?.split("T")[0] ?? ""}
          InputLabelProps={{ shrink: true }}
          onChange={(e) => onFiltersChange({ ...filters, endTime: `${e.currentTarget.value}T00:00` })}
        />
      </ListItem>
    </>
  );
};

export default DateTimeFilter;
