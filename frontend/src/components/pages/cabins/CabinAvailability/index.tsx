import Calendar from "@components/Calendar";
import { Cabin } from "@interfaces/cabins";
import { Checkbox, List, ListItem, Grid, Divider, Typography } from "@material-ui/core";
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
      <Grid item xs container justify="center" alignItems="center">
        <Grid item xs={3}>
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
      <Grid item xs={9}>
        <Calendar rangeChanged={(from, to) => console.log(from, to)} />
      </Grid>
    </Grid>
  );
};

export default CabinAvailability;
