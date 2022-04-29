import MemberCard from "@components/pages/about/MemberCard";
import { BoardMember } from "@components/pages/about/MemberCard/types";
import Template from "@components/pages/about/Template";
import { Typography } from "@mui/material";
import Grid from "@mui/material/Grid";
import React from "react";
import Layout from "src/layouts";
import { NextPageWithLayout } from "../_app";

const BoardPage: NextPageWithLayout = () => {
  const boardMembers: BoardMember[] = [
    {
      rank: 1,
      name: "Christian August Brask Rustad",
      position: "Leder Hovedstyret",
      email: "leder@indokhs.no",
      phone: "913 66 392",
    },
    {
      rank: 2,
      name: "Olaf Alexander Styrmoe",
      position: "Leder Hovedstyret",
      email: "leder@indokhs.no",
      phone: "477 05 321",
    },
    {
      rank: 3,
      name: "Branny Lin",
      position: "President Janus",
      email: "president@janulinjeforening.no",
      phone: "413 84 786",
    },
    {
      rank: 4,
      name: "Håkon Furnes Havre",
      position: "Instituttstillitsvalg",
      email: "itv@iot.ntnu.no",
      phone: "414 91 247",
    },
    {
      rank: 5,
      name: "Vilde Sætre",
      position: "Leder Bindeleddet",
      email: "leder@bindeleddet.ntnu.no",
      phone: "917 75 595",
    },
    {
      rank: 6,
      name: "Karen Hoel Jomaas",
      position: "Leder Janus IF",
      email: "if@indokhs.no",
      phone: "900 29 145",
    },
    {
      rank: 7,
      name: "Mari Horpestad",
      position: "Leder Indøk Kultur",
      email: "kultur@indokhs.no",
      phone: "911 49 066",
    },
    {
      rank: 8,
      name: "Sjur Filip Vik Haakestad",
      position: "Leder Hyttestyret",
      email: "leder@indokhyttene.no",
      phone: "919 97 470",
    },
    {
      rank: 9,
      name: "Aslak Vengbo",
      position: "Leder ESTIEM",
      email: "leder@estiem.no",
      phone: "934 55 914",
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
        Janus, Bindeleddet, ESTIEM, Hyttestyret, Janus IF og Indøk Kultur.
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
