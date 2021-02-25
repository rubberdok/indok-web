import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { TextField, Container } from "@material-ui/core";
import { FilterQuery } from "../..";

interface Props {
  filters: FilterQuery;
  onFiltersChange: (query: FilterQuery) => void;
}

const useStyles = makeStyles((theme) => ({
  container: {
    display: "flex",
    flexWrap: "wrap",
    padding: theme.spacing(2),
    paddingBottom: 0,
    paddingRight: 0,
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
    <Container className={classes.container}>
      <TextField
        id="date"
        label="Starttid"
        type="date"
        className={classes.textField}
        value={filters?.startTime?.split("T")[0] ?? ""}
        InputLabelProps={{ shrink: true }}
        onChange={(e) => onFiltersChange({ ...filters, startTime: `${e.currentTarget.value}T00:00` })}
      />

      <TextField
        id="date"
        label="Sluttid"
        type="date"
        value={filters?.endTime?.split("T")[0] ?? ""}
        className={classes.secondTextField}
        InputLabelProps={{ shrink: true }}
        onChange={(e) => onFiltersChange({ ...filters, endTime: `${e.currentTarget.value}T00:00` })}
      />
    </Container>
  );
};

export default DateTimeFilter;
