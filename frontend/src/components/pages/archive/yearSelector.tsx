import React, { useEffect } from "react";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import NativeSelect from "@material-ui/core/NativeSelect";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import Input from "@material-ui/core/Input";

const useStyles = makeStyles((theme) => ({
  quantityRoot: {
    color: "black",
    backgroundColor: "rgba(6, 90, 90,0.2)",
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
    color: "black",
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
  //const [year, setYear] = React.useState("");

  //useEffect(() => {
  //  handleYearFilterChanged(year);
  //}, [year]);

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
          //onChange={(event) => {
          //  const value = event.target.value;
          //  setYear(typeof value === "string" ? value : "");
          //}}
          onChange={(event) => {
            typeof event.target.value === "string" && handleYearFilterChanged(event.target.value);
          }}
          name="Årstall"
          inputProps={{ "aria-label": "without label" }}
          MenuProps={{ classes: { paper: classes.selectPaper } }}
        >
          <MenuItem value="">Alle år</MenuItem>
          <MenuItem value="2021">2021</MenuItem>
          <MenuItem value="2020">2020</MenuItem>
          <MenuItem value="2019">2019</MenuItem>
          <MenuItem value="2018">2018</MenuItem>
          <MenuItem value="2017">2017</MenuItem>
          <MenuItem value="2016">2016</MenuItem>
          <MenuItem value="2015">2015</MenuItem>
        </Select>
      </FormControl>
    </div>
  );
};
export default YearSelector;
