import Calendar from "@components/Calendar";
import useDisabledDates from "@hooks/cabins/useDisabledDates";
import { Cabin } from "@interfaces/cabins";
import { Checkbox, List, ListItem, Grid, Typography, Divider } from "@material-ui/core";
import { NextPage } from "next";
import React, { Dispatch, SetStateAction } from "react";
import { DatePick } from "src/pages/cabins/book";

interface Props {
  allCabins: Cabin[];
  chosenCabins: Cabin[];
  setChosenCabins: Dispatch<SetStateAction<Cabin[]>>;
  datePick: DatePick;
  setDatePick: React.Dispatch<React.SetStateAction<DatePick>>;
}

const CheckInOut: NextPage<Props> = ({ allCabins, chosenCabins, setChosenCabins, datePick, setDatePick }) => {
  const { disabledDates } = useDisabledDates(chosenCabins);
  return (
    <Grid container spacing={10}>
      <Grid item xs={2} container direction="column" justify="center" alignItems="center">
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
      <Grid item xs={10}>
        <Calendar title="Velg innsjekk og utsjekk" />
      </Grid>
    </Grid>
  );
};

export default CheckInOut;
