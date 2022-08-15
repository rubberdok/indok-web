import Layout from "@layouts/Layout";
import MemberCard from "@components/pages/about/MemberCard";
import { BoardMember } from "@components/pages/about/MemberCard/types";
import Template from "@components/pages/about/Template";
import { Typography } from "@mui/material";
import Grid from "@mui/material/Grid";
import React from "react";
import { NextPageWithLayout } from "../_app";

const BoardPage: NextPageWithLayout = () => {
  const boardMembers: BoardMember[] = [
    {
      rank: 1,
      name: "Morten Vinje",
      position: "Leder Hovedstyret",
      email: "leder@indokhs.no",
    },
    {
      rank: 2,
      name: "Erlend Heir",
      position: "Leder Hovedstyret",
      email: "leder@indokhs.no",
    },
    {
      rank: 3,
      name: "Oskar Gåsø",
      position: "President Janus",
      email: "president@janulinjeforening.no",
    },
    {
      rank: 4,
      name: "Marthe Kirkeby",
      position: "Instituttstillitsvalg",
      email: "itv@iot.ntnu.no",
    },
    {
      rank: 5,
      name: "Idun Aune Skretting",
      position: "Leder Bindeleddet",
      email: "leder@bindeleddet.ntnu.no",
    },
    {
      rank: 6,
      name: "Asbjørn Nisi",
      position: "Leder Janus IF",
      email: "if@indokhs.no",
    },
    {
      rank: 7,
      name: "Vidar Selnes Lund",
      position: "Leder Indøk Kultur",
      email: "kultur@indokhs.no",
    },
    {
      rank: 8,
      name: "Einar Midthun",
      position: "Leder Hytteforeningen",
      email: "leder@indokhyttene.no",
    },
    {
      rank: 9,
      name: "Philip Maurstad Uv",
      position: "Leder ESTIEM",
      email: "leder@estiem.no",
    },
  ];

  return (
    <Template
      img="/img/hero.jpg"
      title="Hovedstyret"
      page="Hovedstyret"
      description="Hovedstyret (HS) er styret i Foreningen for studentene ved Industriell økonomi og teknologiledelse, NTNU. 
      "
    >
      <Typography variant="body1" paragraph>
        Hovedstyret består av et valgt lederpar, instituttilittsvalgt ved IØT, samt leder for hver av linjeforeningene
        Janus, Bindeleddet, ESTIEM, Hytteforeningen, Janus IF og Indøk Kultur.
      </Typography>
      <Typography variant="body1" paragraph>
        Hovedstyrets fremste oppgave er å sørge for god kommunikasjon og samarbeid mellom de ulike studentinitiativene,
        og forvalte og disponere Indøks midler på en forsvarlig måte. Hovedstyret er ansvarlig for å forberede og
        avholde generalforsamling for studentene ved Indøk. Generalforsamlingen er Foreningens øverste organ og er
        studentenes mulighet til å direkte påvirke budsjetter og avgjørelser som blir fattet på linjen.
      </Typography>
      <Typography variant="h3" gutterBottom>
        Medlemmer
      </Typography>
      <Grid container spacing={2} alignItems="stretch" justifyContent="center">
        {boardMembers.map((member) => (
          <Grid key={member.rank} item xs={12} md={6}>
            <MemberCard member={member} />
          </Grid>
        ))}
      </Grid>
    </Template>
  );
};

BoardPage.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout>{page}</Layout>;
};

export default BoardPage;
