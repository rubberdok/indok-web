import { useQuery } from "@apollo/client";
import { QUERY_BOOKING_RESPONSIBLE } from "@graphql/cabins/queries";
import { BookingResponsible } from "@interfaces/cabins";
import { Grid, Link, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";

const ContactCabinBoard: React.FC = () => {
  const { data } = useQuery<{ activeBookingResponsible: BookingResponsible }>(QUERY_BOOKING_RESPONSIBLE);
  const [responsible, setResponsible] = useState<BookingResponsible>();

  useEffect(() => {
    if (data?.activeBookingResponsible) {
      setResponsible(data.activeBookingResponsible);
    }
  }, [data]);

  if (responsible) {
    return (
      <Grid item container spacing={4} direction="column" justifyContent="center" alignContent="center">
        <Grid item>
          <Typography variant="h3">Kontakt Hyttestyret</Typography>
        </Grid>
        <Grid item>
          <Typography>
            Send mail til bookingansvarlig i Hyttestyret, {responsible.firstName} {responsible.lastName}, her:{" "}
            <Link href={`mailto:${responsible.email}`}>{responsible.email}</Link>. Du kan lese mer om Hyttestyret{" "}
            <Link href="/about/organizations/hyttestyret">her.</Link>
          </Typography>
        </Grid>
      </Grid>
    );
  } else {
    return <></>;
  }
};

export default ContactCabinBoard;
