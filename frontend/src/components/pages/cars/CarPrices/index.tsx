import { useQuery } from "@apollo/client";
import { Divider, Grid, Typography } from "@mui/material";

import { BookingproductsDocument } from "@/generated/graphql";

/** Shows an overview of car prices. Fetches the prices from the Car model. */
export const CarPrices: React.VFC = () => {
  const carQuery = useQuery(BookingproductsDocument);
  const cars = carQuery?.data?.bookingproducts;

  return (
    <Grid container spacing={10}>
      <Grid item xs={12} sm={6}>
        <Typography variant="h3">Priser</Typography>
        <Divider component="br" />
        <Typography variant="body2">
          Sengeplasser kan bookes for grupper under 10 personer, med minst en indøker. Hele hytta kan bookes for både
          interne og eksterne, se pris.
        </Typography>
      </Grid>
      <Grid item container xs={12} sm={6} spacing={2} justifyContent="flex-start" alignItems="flex-start">
        <Grid item alignContent="center" justifyContent="center" md={6}>
          <Typography variant="body2" textAlign="left">
            <b>Enkeltperson</b>
            <br />
            Indøker: 110 kr per sengeplass.
            <br />
            Ikke-indøkere: 270 kr per sengeplass.
          </Typography>
        </Grid>
        <Grid item alignContent="center" justifyContent="center" md={6}>
          <Typography variant="body2" textAlign="left">
            <b>Hel hytte</b>
            {cars?.map((car) => (
              <>
                <Typography variant="body2">
                  <i>{car.name}</i>
                </Typography>
                <Typography variant="body2">Internpris: {car.internalPrice} kr</Typography>
                <Typography variant="body2">Eksternpris: {car.externalPrice} kr</Typography>
              </>
            ))}
          </Typography>
        </Grid>
      </Grid>
    </Grid>
  );
};
