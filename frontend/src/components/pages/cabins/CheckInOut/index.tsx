import Calendar from "@components/Calendar";
import useDisabledDates from "@hooks/cabins/useDisabledDates";
import { Cabin } from "@interfaces/cabins";
import { Checkbox, List, ListItem, Grid, Typography, Divider, useTheme, useMediaQuery } from "@material-ui/core";
import { NextPage } from "next";
import React, { Dispatch, SetStateAction } from "react";
import { DatePick } from "src/pages/cabins/book";

interface Props {
  allCabins: Cabin[];
  chosenCabins: Cabin[];
  setChosenCabins: Dispatch<SetStateAction<Cabin[]>>;
  setDatePick: React.Dispatch<React.SetStateAction<DatePick>>;
}

const CheckInOut: NextPage<Props> = ({ allCabins, chosenCabins, setChosenCabins, setDatePick }) => {
  const { disabledDates } = useDisabledDates(chosenCabins);

  const handleRangeChange = (fromDate: string | undefined, toDate: string | undefined, validRange: boolean) => {
    setDatePick({
      checkInDate: fromDate,
      checkOutDate: toDate,
      isValid: validRange,
    });
  };
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const getMargin = () => (isMobile ? 2 : 10);
  return (
    <Grid container spacing={getMargin()}>
      <Grid item xs={12} md={2} container direction="column" justify="center" alignItems="center">
        <Grid item>
          <Typography variant="h5">Velg hytte</Typography>
          <Divider component="hr" />
          <List>
            {allCabins.map((cabin) => (
              <ListItem key={cabin.id}>
                <Checkbox
                  color="primary"
                  disableRipple
                  checked={chosenCabins.map((chosenCabin) => chosenCabin.id).includes(cabin.id)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setChosenCabins([...chosenCabins, cabin]);
                    } else {
                      setChosenCabins(chosenCabins.filter((chosenCabin) => cabin.id !== chosenCabin.id));
                    }
                  }}
                />
                {cabin.name}
              </ListItem>
            ))}
          </List>
        </Grid>
      </Grid>
      <Grid item xs={12} md={10}>
        <Calendar
          title="Velg innsjekk og utsjekk"
          disabledDates={disabledDates}
          disableAll={chosenCabins.length === 0}
          onRangeChange={handleRangeChange}
        />
      </Grid>
    </Grid>
  );
};

export default CheckInOut;
