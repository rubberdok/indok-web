import { Cabin } from "@interfaces/cabins";
import { Box, Checkbox, List, ListItem, Grid, Typography } from "@material-ui/core";
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
      <Grid item xs container justify="center">
        <Grid item xs>
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
      <Grid item xs>
        <Typography variant="h3" align="center">
          Calendar Placeholder
        </Typography>
      </Grid>
    </Grid>
  );
};

export default CabinAvailability;
