import { SummaryProps } from "@interfaces/cabins";
import React from "react";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Facilities from "./Facilities";
import { Container, Divider, Typography } from "@material-ui/core";
import { Card } from "@material-ui/core";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    paper: {
      padding: theme.spacing(2),
      textAlign: "center",
      color: theme.palette.text.primary,
    },
    separator: {
      backgroundColor: theme.palette.primary.main,
      width: "80%",
      height: 5,
      margin: "auto",
    },
    lowSeparator: {
      backgroundColor: theme.palette.primary.main,
      width: "80%",
      height: 3,
      margin: "auto",
    },
    card: {
      padding: "20px",
      boxShadow: "0px 7px 17px -1px rgba(92, 92, 92, 0.62)",
      borderRadius: "15px",
      textAlign: "center",
    },
  })
);

const Summary = ({ from, to, cabins, price, nights }: SummaryProps): JSX.Element => {
  const classes = useStyles();

  return (
    <Container>
      <Card className={classes.card}>
        <Grid container spacing={1}>
          <Grid item xs={12}>
            <Paper className={classes.paper}>
              <Typography variant="h4">
                Hytte{cabins.length > 1 ? "r" : ""}: {cabins.map((cabin, i) => (i > 0 ? " og " + cabin : cabin))}
              </Typography>
            </Paper>
          </Grid>
          <Divider className={classes.separator} />
          <Grid item xs={6}>
            <Paper className={classes.paper}>Fra: {from}</Paper>
          </Grid>
          <Grid item xs={6}>
            <Paper className={classes.paper}>Til: {to}</Paper>
          </Grid>
          <Grid item xs={12}>
            <Paper className={classes.paper}>
              <Facilities />
            </Paper>
          </Grid>
          <Grid item xs={12}>
            <Paper className={classes.paper}>
              {price} kr x {nights} dager
            </Paper>
          </Grid>
          <Divider className={classes.lowSeparator} />
          <Grid item xs={12}>
            <Paper className={classes.paper}>Totalt: {price * nights}kr</Paper>
          </Grid>
        </Grid>
      </Card>
    </Container>
  );
};

export default Summary;
