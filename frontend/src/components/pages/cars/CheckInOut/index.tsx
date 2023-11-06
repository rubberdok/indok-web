import { Checkbox, Divider, FormControlLabel, Paper, Stack, Typography } from "@mui/material";
import React from "react";

import { Calendar } from "@/components/Calendar";
import { CarFragment } from "@/generated/graphql";
import { useDisabledDates } from "@/hooks/cars/useDisabledDates";
import { useResponsive } from "@/hooks/useResponsive";
import { DatePick } from "@/types/cars";

type Props = {
  allCars: CarFragment[];
  chosenCars: CarFragment[];
  setChosenCars: React.Dispatch<React.SetStateAction<CarFragment[]>>;
  setDatePick: React.Dispatch<React.SetStateAction<DatePick>>;
};

/**
 * One of the steps in the cars/book page. In this step the user chooses a Car and the check-in and check-out dates.
 */
export const CheckInOutCar: React.FC<React.PropsWithChildren<Props>> = ({
  allCars,
  chosenCars,
  setChosenCars,
  setDatePick,
}) => {
  const { disabledDates } = useDisabledDates(chosenCars);
  const isMobile = useResponsive({ query: "down", key: "md" });

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
        bgcolor="background.elevated"
        p={3}
        elevation={0}
      >
        <Typography variant="h5">Velg bil</Typography>

        {allCars.map((car) => (
          <FormControlLabel
            key={car.id}
            label={
              <Typography variant="subtitle2" component="p">
                {car.name}
              </Typography>
            }
            control={
              <Checkbox
                color="primary"
                disableRipple
                checked={chosenCars.some((chosenCar) => chosenCar.id === car.id)}
                onChange={(_, checked) => {
                  if (checked) {
                    setChosenCars([...chosenCars, car]);
                  } else {
                    setChosenCars(chosenCars.filter((chosenCar) => car.id !== chosenCar.id));
                  }
                }}
              />
            }
          />
        ))}
      </Stack>
      {isMobile && <Divider sx={{ my: 2 }} />}
      <Paper sx={{ p: 3, bgcolor: "background.elevated", width: 1 }} elevation={0}>
        <Calendar
          title="Velg innsjekk og utsjekk"
          disabledDates={disabledDates}
          disableAll={chosenCars.length === 0}
          onRangeChange={handleRangeChange}
        />
      </Paper>
    </Stack>
  );
};
