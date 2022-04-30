import Calendar from "@components/Calendar";
import LabeledIcon from "@components/LabeledIcon";
import useDisabledDates from "@hooks/cabins/useDisabledDates";
import useResponsive from "@hooks/useResponsive";
import { Cabin, DatePick } from "@interfaces/cabins";
import { Checkbox, Divider, Paper, Stack, Typography, useTheme } from "@mui/material";
import { NextPage } from "next";
import React from "react";

interface Props {
  allCabins: Cabin[];
  chosenCabins: Cabin[];
  setChosenCabins: React.Dispatch<React.SetStateAction<Cabin[]>>;
  setDatePick: React.Dispatch<React.SetStateAction<DatePick>>;
}
/*
One of the steps in the cabins/book page. In this step the user chooses a cabin and the check-in and check-out dates.
*/
const CheckInOut: NextPage<Props> = ({ allCabins, chosenCabins, setChosenCabins, setDatePick }) => {
  const { disabledDates } = useDisabledDates(chosenCabins);
  const isMobile = useResponsive("down", "md");
  const theme = useTheme();
  const isLight = theme.palette.mode === "light";

  const handleRangeChange = (fromDate: string | undefined, toDate: string | undefined, validRange: boolean) => {
    setDatePick({
      checkInDate: fromDate,
      checkOutDate: toDate,
      isValid: validRange,
    });
  };
  return (
    <Stack
      direction={{ xs: "column", md: "row" }}
      alignItems={{ xs: "stretch", md: "flex-start" }}
      spacing={{ xs: 2, md: 4 }}
    >
      <Stack
        component={Paper}
        direction={{ xs: "row", md: "column" }}
        alignItems={{ xs: "center", md: "flex-start" }}
        spacing={1}
        minWidth={200}
        bgcolor="grey.200"
        p={3}
        sx={{ bgcolor: (theme) => (theme.palette.mode === "dark" ? "grey.800" : "grey.200") }}
        variant={isLight ? undefined : "outlined"}
      >
        <Typography variant="h5">Velg hytte</Typography>

        {allCabins.map((cabin) => (
          <LabeledIcon
            icon={
              <Checkbox
                color="primary"
                disableRipple
                checked={chosenCabins.some((chosenCabin) => chosenCabin.id === cabin.id)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setChosenCabins([...chosenCabins, cabin]);
                  } else {
                    setChosenCabins(chosenCabins.filter((chosenCabin) => cabin.id !== chosenCabin.id));
                  }
                }}
              />
            }
            value={<Typography variant="subtitle2">{cabin.name}</Typography>}
            key={cabin.id}
          />
        ))}
      </Stack>
      {isMobile && <Divider sx={{ my: 2 }} />}
      <Paper
        variant={isLight ? undefined : "outlined"}
        sx={{ p: 3, bgcolor: (theme) => (theme.palette.mode === "dark" ? "grey.800" : "grey.200"), width: 1 }}
      >
        <Calendar
          title="Velg innsjekk og utsjekk"
          disabledDates={disabledDates}
          disableAll={chosenCabins.length === 0}
          onRangeChange={handleRangeChange}
        />
      </Paper>
    </Stack>
  );
};

export default CheckInOut;
