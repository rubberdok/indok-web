import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import { GET_AVAILABLE_YEARS } from "@graphql/archive/queries";
import { CircularProgress } from "@material-ui/core";
import { useQuery } from "@apollo/client";

const useStyles = makeStyles(() => ({
  quantityRoot: {
    color: "black",
    backgroundColor: "rgba(6, 90, 90, 0.6)",
    minWidth: 120,
    borderRadius: "20px",
    outline: "none",
    "&:hover": {
      color: "red",
      backgroundColor: "#065a5a",
      borderRadius: "20px",
      outline: "none",
      opacity: 1,
    },
    "&:focus-within": {
      backgroundColor: "#065a5a",
      opacity: 1,
      borderRadius: "20px",
      outline: "none",
    },
    "& .MuiOutlinedInput-notchedOutline": {
      border: "0px solid transparent",
    },
    "&:hover .MuiOutlinedInput-notchedOutline": {
      border: "0px solid transparent",
    },
    "& .Mui-focused .MuiOutlinedInput-notchedOutline": {
      border: "0px solid transparent",
      borderRadius: "5px 5px 0 0",
    },
    "& .Mui-disabled": {
      color: "black",
      opacity: 0.6,
    },
    "& .Mui-disabled .MuiOutlinedInput-notchedOutline": {
      border: "0px solid transparent",
    },
  },
  selectRoot: {
    color: "white",
    opacity: 1,
    fontFamily: "montserrat",
    fontSize: "14px",
    paddingTop: "8px",
    paddingBottom: "8px",
    justifyContent: "space-evenly",
    "&:hover": {
      color: "white",
    },
  },
  icon: {
    color: "black",
    "&:hover": {
      color: "white",
    },
  },
  selectPaper: {
    backgroundColor: "white",
    border: "1px solid transparent",
    borderRadius: "10px",
    color: "black",
    "& li:hover": {
      backgroundColor: "#065a5a",
      opacity: 0.5,
      color: "white",
    },
  },
}));

interface YearSelectorProps {
  yearFilter: string;
  handleYearFilterChanged: (year: string) => void;
}

const YearSelector: React.FC<YearSelectorProps> = ({ yearFilter, handleYearFilterChanged }) => {
  const classes = useStyles();

  const { loading, data, error } = useQuery<{ availableYears: string[] }>(GET_AVAILABLE_YEARS);

  if (loading) return <CircularProgress />;

  if (error) return <p style={{ textAlign: "center" }}> Feil: {error.message} </p>;

  return (
    <div className={classes.quantityRoot}>
      <FormControl variant="outlined" className={classes.quantityRoot}>
        <Select
          displayEmpty
          classes={{
            root: classes.selectRoot,
            icon: classes.icon,
          }}
          value={yearFilter}
          onChange={(event) => {
            typeof event.target.value === "string" && handleYearFilterChanged(event.target.value);
          }}
          name="Årstall"
          inputProps={{ "aria-label": "without label" }}
          MenuProps={{ classes: { paper: classes.selectPaper } }}
        >
          <MenuItem value="">Alle år</MenuItem>
          {data &&
            data.availableYears.map((year) => (
              <MenuItem key={year} value={year}>
                {year}
              </MenuItem>
            ))}
        </Select>
      </FormControl>
    </div>
  );
};
export default YearSelector;
