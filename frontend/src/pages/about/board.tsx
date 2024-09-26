import { Typography } from "@mui/material";
import Grid from "@mui/material/Grid";

import { MemberCard } from "@/components/pages/about/MemberCard";
import { BoardMember } from "@/components/pages/about/MemberCard/types";
import { Template } from "@/components/pages/about/Template";
import { NextPageWithLayout } from "@/lib/next";

const BoardPage: NextPageWithLayout = () => {
  const boardMembers: BoardMember[] = [
    {
      rank: 1,
      name: "Kristoffer Grude",
      position: "Leder Hovedstyret",
      email: "leder@indokhs.no",
    },
    {
      rank: 2,
      name: "Branny Lin",
      position: "Leder Hovedstyret",
      email: "leder@indokhs.no",
    },
    {
      rank: 3,
      name: "Markus Kile Søyland",
      position: "Finanssjef Hovedstyret",
      email: "finans@indokhs.no",
    },
    {
      rank: 4,
      name: "Thomas Kallasten Pedersen",
      position: "President Janus Sosial",
      email: "president@janulinjeforening.no",
    },
    {
      rank: 5,
      name: "Aidan Stautland",
      position: "Instituttstillitsvalg",
      email: "itv@iot.ntnu.no",
    },
    {
      rank: 6,
      name: "Ida Harneshaug",
      position: "Leder Bindeleddet",
      email: "leder@bindeleddet.ntnu.no",
    },
    {
      rank: 7,
      name: "Jens Skaug",
      position: "Leder Janus IF",
      email: "if@indokhs.no",
    },
    {
      rank: 8,
      name: "Live Krohg",
      position: "Leder Janus Kultur",
      email: "kultur@indokhs.no",
    },
    {
      rank: 9,
      name: "Brage Sømoen",
      position: "Leder Janushyttene",
      email: "leder@indokhyttene.no",
    },
    {
      rank: 10,
      name: "Bjørn Borkamo",
      position: "Leder ESTIEM",
      email: "leder@estiem.no",
    },
  ];

  return (
    <Template
      title="Hovedstyret"
      description="Hovedstyret (HS) er styret i Janus Linjeforening ved Industriell Økonomi og Teknologiledelse, NTNU."
      prevPost={{ title: "Våre foreninger", slug: "/about/organization", cover: "/img/hero.jpg" }}
      nextPost={{ title: "Instituttillitsvalgte", slug: "/about/itv", cover: "/img/itv.png" }}
    >
      <Typography variant="body1" paragraph>
        Hovedstyret består av et valgt lederpar, instituttilittsvalgt ved IØT, samt leder for hver av linjeforeningene
        Janus, Bindeleddet, ESTIEM, Janushyttene, Janus IF og Janus Kultur.
      </Typography>
      <Typography variant="body1" paragraph>
        Hovedstyrets fremste oppgave er å sørge for god kommunikasjon og samarbeid mellom de ulike studentinitiativene,
        og forvalte og disponere Indøks midler på en forsvarlig måte. Hovedstyret er ansvarlig for å forberede og
        avholde generalforsamling for studentene ved Indøk. Generalforsamlingen er Foreningens øverste organ og er
        studentenes mulighet til å direkte påvirke budsjetter og avgjørelser som blir fattet på linjen.
      </Typography>
      <Typography variant="h3" component="h2" gutterBottom>
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

export default BoardPage;
