import { useQuery } from "@apollo/client";
import { GET_AVAILABLE_YEARS } from "@graphql/archive/queries";
import { CircularProgress } from "@material-ui/core";
import FormControl from "@material-ui/core/FormControl";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import React from "react";

interface YearSelectorProps {
  yearFilter: string;
  handleYearFilterChanged: (year: string) => void;
}

const YearSelector: React.FC<YearSelectorProps> = ({ yearFilter, handleYearFilterChanged }) => {
  const { loading, data, error } = useQuery<{ availableYears: string[] }>(GET_AVAILABLE_YEARS);

  if (loading) return <CircularProgress />;

  if (error) return <p style={{ textAlign: "center" }}> Feil: {error.message} </p>;

  return (
    <>
      <FormControl size="small">
        <Select
          displayEmpty
          value={yearFilter}
          onChange={(event) => {
            typeof event.target.value === "string" && handleYearFilterChanged(event.target.value);
          }}
          name="Årstall"
          inputProps={{ "aria-label": "without label" }}
        >
          <MenuItem dense value="">
            Alle år
          </MenuItem>
          {data &&
            data.availableYears.map((year) => (
              <MenuItem dense key={year} value={year}>
                {year}
              </MenuItem>
            ))}
        </Select>
      </FormControl>
    </>
  );
};
export default YearSelector;
