"use client";
import {
  Card,
  CardActionArea,
  CardContent,
  CardHeader,
  Container,
  Unstable_Grid2 as Grid,
  Typography,
} from "@mui/material";

import { Breadcrumbs } from "@/app/components/Breadcrumbs";
import { NextLinkComposed } from "@/app/components/Link";

export default function Page() {
  return (
    <Container>
      <Breadcrumbs
        links={[
          { name: "Hjem", href: "/" },
          { name: "Administrer hytter", href: "/cabins/admin" },
        ]}
      />
      <Typography variant="subtitle1" gutterBottom>
        Administrer hytter
      </Typography>
      <Grid
        direction={{ xs: "column", md: "row" }}
        justifyContent="space-evenly"
        spacing={2}
        container
        alignItems="stretch"
      >
        <Grid xs={12} md={6}>
          <Card sx={{ height: 1 }}>
            <CardActionArea sx={{ height: 1 }} component={NextLinkComposed} to="/cabins/admin/bookings">
              <CardHeader title="Bestillinger" />
              <CardContent>
                <Typography>Her kan du se og administrere bestillinger for hyttene.</Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>
        <Grid xs={12} md={6}>
          <Card sx={{ height: 1 }}>
            <CardActionArea sx={{ height: 1 }} component={NextLinkComposed} to="/cabins/admin/settings">
              <CardHeader title="Instillinger" />
              <CardContent>
                <Typography>
                  Her kan du endre instillinger for hyttene, som for eksempel priser og tilgjengelighet.
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}
