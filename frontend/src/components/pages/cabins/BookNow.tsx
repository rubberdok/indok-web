import { useQuery } from "@apollo/client";
import { ArrowForward } from "@mui/icons-material";
import { Button, Card, CardContent, Divider, Stack, Typography } from "@mui/material";
import React from "react";

import { NextLinkComposed } from "@/components/Link";
import { CabinsAndResponsiblesDocument } from "@/generated/graphql";

export const BookNow: React.FC = () => {
  const { data } = useQuery(CabinsAndResponsiblesDocument);
  return (
    <Card sx={{ height: "100%" }} elevation={0} data-color-scheme="dark">
      <CardContent sx={{ height: "100%" }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ height: "100%" }}>
          <Stack direction="column">
            <Typography variant="h4" gutterBottom>
              Priser
            </Typography>
            <Typography variant="subtitle1">Hel hytte</Typography>
            <Divider />
            <Typography variant="subtitle2">Intern: {data?.cabins?.[0]?.internalPrice} kr</Typography>
            <Typography variant="subtitle2" gutterBottom>
              Ekstern: {data?.cabins?.[0]?.externalPrice} kr
            </Typography>
            <Typography variant="subtitle1">Sengeplass</Typography>
            <Divider />
            <Typography variant="subtitle2">Intern: 110 kr</Typography>
            <Typography variant="subtitle2">Ekstern: 270 kr</Typography>
          </Stack>
          <Button
            component={NextLinkComposed}
            to="/cabins/book"
            variant="contained"
            size="large"
            color="success"
            endIcon={<ArrowForward />}
          >
            Book nå
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
};
