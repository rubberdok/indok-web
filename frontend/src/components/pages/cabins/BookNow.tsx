import { useQuery } from "@apollo/client";
import { CabinsAndResponsiblesDocument } from "@generated/graphql";
import { ArrowRight } from "phosphor-react";
import { Button, Card, CardContent, Divider, Stack, Typography } from "@mui/material";
import Link from "next/link";
import React from "react";

const BookNow: React.FC = () => {
  const { data } = useQuery(CabinsAndResponsiblesDocument);
  return (
    <Card sx={{ bgcolor: "grey.900", height: "100%" }}>
      <CardContent sx={{ height: "100%" }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ color: "common.white", height: "100%" }}
        >
          <Stack direction="column">
            <Typography variant="h4" gutterBottom>
              Vi har ledige hytter
            </Typography>
            <Typography variant="subtitle1">Hel hytte</Typography>
            <Divider />
            <Typography variant="subtitle2">Internpris: {data?.cabins?.[0]?.internalPrice} kr</Typography>
            <Typography variant="subtitle2" gutterBottom>
              Eksternpris: {data?.cabins?.[0]?.externalPrice} kr
            </Typography>
            <Typography variant="subtitle1">Sengeplass</Typography>
            <Divider />
            <Typography variant="subtitle2">Indøk: 110 kr</Typography>
            <Typography variant="subtitle2">Ikke-Indøk: 270 kr</Typography>
          </Stack>
          <Link href="/cabins/book" passHref>
            <Button variant="contained" size="large" color="success" endIcon={<ArrowRight />}>
              Book nå
            </Button>
          </Link>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default BookNow;
