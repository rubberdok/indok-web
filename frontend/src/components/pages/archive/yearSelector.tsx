import React from "react";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import NativeSelect from "@material-ui/core/NativeSelect";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";

const theme1 = createMuiTheme({
  overrides: {
    MuiSelect: {
      select: {
        "&:focus": {
          background: "transparent",
        },
      },
    },
  },
});

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    formControl: {
      margin: theme.spacing(1),
      minWidth: 120,
    },
    selectEmpty: {
      marginTop: theme.spacing(2),
    },
    quantityRoot: {
      color: "black",
      backgroundColor: "transparent",
      opacity: 0.6,
      borderRadius: "5px",
      "&:hover": {
        backgroundColor: "transparent",
        borderRadius: "5px",
        opacity: 1,
      },
      "&:focus-within": {
        backgroundColor: "transparent",
        borderRadius: "5px",
        opacity: 1,
      },
      "& .MuiOutlinedInput-notchedOutline": {
        border: "1px solid transparent",
      },
      "&:hover .MuiOutlinedInput-notchedOutline": {
        border: "1px solid transparent",
      },
      "& .Mui-focused .MuiOutlinedInput-notchedOutline": {
        border: "1px solid transparent",
        borderRadius: "5px",
        outline: "none",
      },
      "& .Mui-disabled": {
        color: "black",
        opacity: 0.6,
      },
      "& .Mui-disabled .MuiOutlinedInput-notchedOutline": {
        border: "1px solid transparent",
      },
      "& .MuiSelect-select:focus": {
        backgroundColor: "transparent",
      },
    },
    selectRoot: {
      color: "black",
    },
    icon: {
      color: "black",
    },
    selectPaper: {
      backgroundColor: "transparent",
      border: "1px solid transparent",
      borderRadius: "5px",
      color: "black",
      "& li:hover": {
        backgroundColor: "transparent",
      },
    },
  })
);

interface YearSelectorProps {
  yearFilter: string;
  updateYearFilters: (value: string) => void;
}

const YearSelector: React.FC<YearSelectorProps> = ({ yearFilter, updateYearFilters }) => {
  const classes = useStyles();

  return (
    <div className={classes.formControl}>
      <MuiThemeProvider theme={theme1}>
        <FormControl
          variant="outlined"
          classes={{
            root: classes.quantityRoot,
          }}
        >
          <InputLabel className={classes.selectPaper}></InputLabel>
          <NativeSelect
            classes={{
              root: classes.selectRoot,
              icon: classes.icon,
            }}
            value={yearFilter}
            onChange={(event) => updateYearFilters(event.target.value)}
            name="Årstall"
            inputProps={{
              id: "gpuChildQuantity",
            }}
          >
            <option value="">Alle år</option>
            <option value="2021">2021</option>
            <option value="2020">2020</option>
            <option value="2019">2019</option>
            <option value="2018">2018</option>
          </NativeSelect>
        </FormControl>
      </MuiThemeProvider>
    </div>
  );
};
export default YearSelector;
