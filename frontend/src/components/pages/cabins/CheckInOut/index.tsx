import { Checkbox, Divider, Paper, Stack, Typography } from "@mui/material";
import React from "react";

import { Calendar } from "@/components/Calendar";
import { LabeledIcon } from "@/components/LabeledIcon";
import { CabinFragment } from "@/generated/graphql";
import { useDisabledDates } from "@/hooks/cabins/useDisabledDates";
import { useResponsive } from "@/hooks/useResponsive";
import { DatePick } from "@/types/cabins";

type Props = {
  allCabins: CabinFragment[];
  chosenCabins: CabinFragment[];
  setChosenCabins: React.Dispatch<React.SetStateAction<CabinFragment[]>>;
  setDatePick: React.Dispatch<React.SetStateAction<DatePick>>;
};

/**
 * One of the steps in the cabins/book page. In this step the user chooses a cabin and the check-in and check-out dates.
 */
export const CheckInOut: React.FC<React.PropsWithChildren<Props>> = ({
  allCabins,
  chosenCabins,
  setChosenCabins,
  setDatePick,
}) => {
  const { disabledDates } = useDisabledDates(chosenCabins);
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
      <Paper sx={{ p: 3, bgcolor: "background.elevated", width: 1 }} elevation={0}>
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
