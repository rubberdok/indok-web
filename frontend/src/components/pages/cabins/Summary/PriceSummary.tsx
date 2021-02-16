import { Container, Grid } from "@material-ui/core";
import React from "react";
import CardC from "../CardC";

interface PriceSummaryProps {
  numberIndok: number;
  numberExternal: number;
  pricePerNight: number;
}

const PriceSummary = (props: PriceSummaryProps): JSX.Element => {
  return (
    <>
      <Container>
        <CardC>
          <Grid container spacing={1} direction={"column"}>
            <Grid item>
              <h2>Pris</h2>
              <h3>{props.pricePerNight} kr per natt</h3>
              <p>Følgende beregning står til grunnlag for prisen: </p>
            </Grid>
            <Grid item>
              <Grid container>
                <Grid item xs={12} md={6}>
                  <p>Antall indøkere: {props.numberIndok ? props.numberIndok : 0}</p>
                </Grid>
                <Grid item xs={12} md={6}>
                  <p>Antall eksterne: {props.numberExternal ? props.numberExternal : 0}</p>
                </Grid>
              </Grid>
            </Grid>
            <Grid item>
              {props.numberIndok >= props.numberExternal ? (
                <p>
                  Siden dere er flere indøkere enn eksterne (eller like mange), får dere booke hytten til internpris.
                </p>
              ) : (
                <p>Siden dere er flere eksterne enn interne, må dere betale eksternpris for å booke hytten.</p>
              )}
            </Grid>
          </Grid>
        </CardC>
      </Container>
    </>
  );
};

export default PriceSummary;
