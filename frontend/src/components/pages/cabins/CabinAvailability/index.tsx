import { useQuery } from "@apollo/client";
import Calendar from "@components/Calendar";
import { getDateRange } from "@components/Calendar/helpers";
import { QUERY_ALL_BOOKINGS } from "@graphql/cabins/queries";
import { Booking, Cabin } from "@interfaces/cabins";
import { Checkbox, List, ListItem, Grid, Typography, Divider } from "@material-ui/core";
import { NextPage } from "next";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";

interface Props {
  allCabins: Cabin[];
  chosenCabins: Cabin[];
  setChosenCabins: Dispatch<SetStateAction<Cabin[]>>;
}

const CabinAvailability: NextPage<Props> = ({ allCabins, chosenCabins, setChosenCabins }) => {
  const allBookingsQuery = useQuery<{
    allBookings: Booking[];
  }>(QUERY_ALL_BOOKINGS);
  const [disabledDates, setDisabledDates] = useState<string[]>([]);

  useEffect(() => {
    if (allBookingsQuery.data) {
      const selectedMonthBookings = allBookingsQuery.data.allBookings.filter((booking) => {
        return booking.cabins.some((cabin) => chosenCabins.map((cabin) => cabin.id).includes(cabin.id));
      });
      setDisabledDates(
        selectedMonthBookings.reduce((newDisabledDates, booking) => {
          return newDisabledDates.concat(getDateRange(booking.bookFrom, booking.bookTo));
        }, [] as string[])
      );
    }
  }, [allBookingsQuery.data, chosenCabins]);

  return (
    <Grid container spacing={10}>
      <Grid item xs={4} container direction="column" justify="center" alignItems="center">
        <Grid item>
          <Typography variant="h6">Velg hytta du vil booke</Typography>
          <Divider component="hr" />
          <List>
            {allCabins.map((cabin) => (
              <ListItem key={cabin.id}>
                <Checkbox
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
      <Grid item xs={8}>
        <Typography variant="h6" align="center">
          Tilgjengelighet for valgt kombinasjon
        </Typography>
        <Divider component="hr" />
        <Calendar disabledDates={disabledDates} disableAll={chosenCabins.length === 0} />
      </Grid>
    </Grid>
  );
};

export default CabinAvailability;
