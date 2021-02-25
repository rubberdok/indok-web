import Calendar from "@components/Calendar";
import { Cabin } from "@interfaces/cabins";
import { Checkbox, List, ListItem, Grid, Box, Typography, Divider } from "@material-ui/core";
import { NextPage } from "next";
import React, { Dispatch, SetStateAction } from "react";

interface Props {
  allCabins: Cabin[];
  chosenCabins: Cabin[];
  setChosenCabins: Dispatch<SetStateAction<Cabin[]>>;
}

const CabinAvailability: NextPage<Props> = ({ allCabins, chosenCabins, setChosenCabins }) => {
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
        <Calendar />
      </Grid>
    </Grid>
  );
};

export default CabinAvailability;
