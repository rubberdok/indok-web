import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { TextField } from "@material-ui/core";
import { FilterQuery } from "../..";

interface Props {
  filters: FilterQuery;
  onFiltersChange: (query: FilterQuery) => void;
}

const useStyles = makeStyles((theme) => ({
  container: {
    display: "flex",
    flexWrap: "wrap",
    paddingLeft: theme.spacing(2),
  },
  textField: {
    width: "90%",
  },
  secondTextField: {
    marginTop: theme.spacing(2),
    width: "90%",
  },
}));

const DateTimeFilter: React.FC<Props> = ({ filters, onFiltersChange }) => {
  const classes = useStyles();

  return (
    <div className={classes.container}>
      <TextField
        id="datetime-local"
        label="Starttid"
        type="datetime-local"
        className={classes.textField}
        value={filters?.startTime}
        InputLabelProps={{ shrink: true }}
        onChange={(e) => onFiltersChange({ ...filters, startTime: e.currentTarget.value })}
      />

      <TextField
        id="datetime-local"
        label="Sluttid"
        type="datetime-local"
        value={filters?.endTime}
        className={classes.secondTextField}
        InputLabelProps={{ shrink: true }}
        onChange={(e) => onFiltersChange({ ...filters, endTime: e.currentTarget.value })}
      />
    </div>
  );
};

export default DateTimeFilter;
