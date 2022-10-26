import { useQuery } from "@apollo/client";
import { CircularProgress } from "@mui/material";
import FormControl from "@mui/material/FormControl";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import React from "react";

import { AvailableYearsDocument } from "@/generated/graphql";

type Props = {
  yearFilter: string;
  handleYearFilterChanged: (year: string) => void;
};

export const YearSelector: React.FC<React.PropsWithChildren<Props>> = ({ yearFilter, handleYearFilterChanged }) => {
  const { loading, data, error } = useQuery(AvailableYearsDocument);

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
