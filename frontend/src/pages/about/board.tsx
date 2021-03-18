import Template from "@components/pages/about/Template";
import { Box, Card, Typography } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import { NextPage } from "next";
import React from "react";

const BoardPage: NextPage = () => {
  return (
    <Template
      img="/img/hero.jpg"
      title="Hovedstyret"
      page=""
      description="Hovedstyret (HS) er styret i Foreningen for studentene ved Industriell økonomi og teknologiledelse, NTNU. 
      "
    >
      <Typography variant="body2" paragraph>
        Hovedstyret består av et valgt lederpar, instituttilittsvalgt ved IØT, samt leder for hver av linjeforeningene
        Janus, Bindeleddet, ESTIEM, Hyttestyret, Janus IF og Indøk Kultur.
      </Typography>
      <Typography variant="body2" paragraph>
        Hovedstyrets fremste oppgave er å sørge for god kommunikasjon og samarbeid mellom de ulike studentinitiativene,
        og forvalte og disponere Indøks midler på en forsvarlig måte. Hovedstyret er ansvarlig for å forberede og
        avholde generalforsamling for studentene ved Indøk. Generalforsamlingen er Foreningens øverste organ og er
        studentenes mulighet til å direkte påvirke budsjetter og avgjørelser som blir fattet på linjen.
      </Typography>
      <Typography variant="h5" gutterBottom>
        Medlemmer
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <Card>
            <Box p={4}>
              <Typography variant="h5">Lars Lien Ankile</Typography>
              <Typography variant="body2">Leder Hovedstyret</Typography>
              <Typography variant="body2">Email: leder@indokhs.no</Typography>
              <Typography variant="body2">Tlf: 948 97 416</Typography>
            </Box>
          </Card>
        </Grid>
        <Grid item xs={6}>
          <Card>
            <Box p={4}>
              <Typography variant="h5">Andreas Johannesen</Typography>
              <Typography variant="body2">Leder Hovedstyret</Typography>
              <Typography variant="body2">Email: leder@indokhs.no</Typography>
              <Typography variant="body2">Tlf: 902 29 730</Typography>
            </Box>
          </Card>
        </Grid>
        <Grid item xs={6}>
          <Card>
            <Box p={4}>
              <Typography variant="h5">Robin Aakvik</Typography>
              <Typography variant="body2">President Janus</Typography>
              <Typography variant="body2">Email: president@janulinjeforening.no</Typography>
              <Typography variant="body2">Tlf: 402 33 395</Typography>
            </Box>
          </Card>
        </Grid>
        <Grid item xs={6}>
          <Card>
            <Box p={4}>
              <Typography variant="h5">Vilde Hem</Typography>
              <Typography variant="body2">Instituttstillitsvalg</Typography>
              <Typography variant="body2">Email: itv@iot.ntnu.no</Typography>
              <Typography variant="body2">Tlf: 984 01 347</Typography>
            </Box>
          </Card>
        </Grid>
        <Grid item xs={6}>
          <Card>
            <Box p={4}>
              <Typography variant="h5">Erlend Heir</Typography>
              <Typography variant="body2">Leder Bindeleddet</Typography>
              <Typography variant="body2">Email: eheir@bindeleddet.ntnu.no</Typography>
              <Typography variant="body2">Tlf: 482 25 043</Typography>
            </Box>
          </Card>
        </Grid>
        <Grid item xs={6}>
          <Card>
            <Box p={4}>
              <Typography variant="h5">Christian Bakke Vennerød</Typography>
              <Typography variant="body2">Leder Janus IF</Typography>
              <Typography variant="body2">Email: if@indokhs.no</Typography>
              <Typography variant="body2">Tlf: 954 68 351</Typography>
            </Box>
          </Card>
        </Grid>
        <Grid item xs={6}>
          <Card>
            <Box p={4}>
              <Typography variant="h5">Hans Magnus Utne</Typography>
              <Typography variant="body2">Leder Indøk Kultur</Typography>
              <Typography variant="body2">Email: kultur@indokhs.no</Typography>
              <Typography variant="body2">Tlf: 975 18 033</Typography>
            </Box>
          </Card>
        </Grid>
        <Grid item xs={6}>
          <Card>
            <Box p={4}>
              <Typography variant="h5">Phillip Kolkmeier</Typography>
              <Typography variant="body2">Leder Hyttestyret</Typography>
              <Typography variant="body2">Email: leder@indokhyttene.no</Typography>
              <Typography variant="body2">Tlf: 906 71 650</Typography>
            </Box>
          </Card>
        </Grid>
        <Grid item xs={6}>
          <Card>
            <Box p={4}>
              <Typography variant="h5">Gustav Fosse Hansen</Typography>
              <Typography variant="body2">Leder ESTIEM</Typography>
              <Typography variant="body2">Email: gustav.fosse.hansen@estiem.org</Typography>
              <Typography variant="body2">Tlf: 941 76 416</Typography>
            </Box>
          </Card>
        </Grid>
        <Grid item xs={6}>
          <Card>
            <Box p={4}>
              <Typography variant="h5">Fredrik Shaughnessy Ahlborg</Typography>
              <Typography variant="body2">Interim Finanssjef</Typography>
              <Typography variant="body2">Email: finans@indokhs.no</Typography>
              <Typography variant="body2">Tlf: 993 74 307</Typography>
            </Box>
          </Card>
        </Grid>
      </Grid>
    </Template>
  );
};

export default BoardPage;
