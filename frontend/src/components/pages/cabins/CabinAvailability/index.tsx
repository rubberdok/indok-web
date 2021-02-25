import Calendar from "@components/Calendar";
import { Cabin } from "@interfaces/cabins";
import { Checkbox, List, ListItem, Grid, Box } from "@material-ui/core";
import { NextPage } from "next";
import React, { Dispatch, SetStateAction } from "react";

interface Props {
  allCabins: Cabin[];
  chosenCabins: Cabin[];
  setChosenCabins: Dispatch<SetStateAction<Cabin[]>>;
}

const CabinAvailability: NextPage<Props> = ({ allCabins, chosenCabins, setChosenCabins }) => {
  return (
    <Grid container>
      <Grid item xs={4} container justify="center" alignItems="center">
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
      <Grid item xs={8}>
        <Box p={5}>
          <Calendar />
        </Box>
      </Grid>
    </Grid>
  );
};

export default CabinAvailability;
