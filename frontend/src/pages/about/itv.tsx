import { Typography } from "@mui/material";
import Grid from "@mui/material/Grid";
import React from "react";

import { ItvCard } from "@/components/pages/about/ItvCard";
import { ItvMember } from "@/components/pages/about/ItvCard/types";
import Template from "@/components/pages/about/Template";
import Layout from "@/layouts/Layout";
import { NextPageWithLayout } from "@/pages/_app";

const ItvPage: NextPageWithLayout = () => {
  const itvMembers: ItvMember[] = [
    {
      rank: 1,
      name: "Marthe Kirkeby",
      email: "itv@iot.ntnu.no",
    },
    {
      rank: 2,
      name: "Vibeke Kjellevoll",
      email: "itv@iot.ntnu.no",
    },
  ];

  return (
    <Template
      img="/img/hero.jpg"
      title="Instituttillitsvalgte"
      page="Institutt-tillitsvalgte"
      description="De instituttillitsvalgte (ITVene) er kontaktpunktet mellom studentene og instituttet vårt."
      prevPost={{ title: "Hovedstyret", slug: "/about/board", cover: "/img/hero.jpg" }}
    >
      <Typography variant="body1" paragraph>
        På institutt for industriell økonomi og teknologiledelse har vi to tillitsvalgte. De tillitsvalgte blir stemt
        frem av instituttets studenter. Det er to valg i året, der det velges én tillitsvalgt per kalenderår og én
        tillitsvalgt per studieår.
      </Typography>
      <Typography variant="body1" paragraph>
        De instituttillitsvalgte representerer studentene ved instituttet i alle organer der det arbeides med
        studietilbud og læringsmiljø. De er ansvarlige for å fremme studentenes saker til instituttledelsen, samt
        videreformidle informasjon fra instituttet til studentene. De sitter også i studentrådet ved fakultet for
        økonomi, der de har en tett dialog med de fakultetstillitsvalgte og andre ITVer på fakultetet. Videre arbeider
        de med å forbedre studentenes hverdag og velferd, ved å undersøke og komme med tiltak til det psykososiale
        miljøet.
      </Typography>
      <Typography variant="body1" paragraph>
        Dersom du har noen saker du ønsker å løfte til instituttet, måtte det gjelde fagplan, det sosiale miljøet,
        rettighetene dine som student eller andre ting, er det bare å ta kontakt på itv@iot.ntnu.no. ITVene har
        taushetsplikt.
      </Typography>
      <Typography variant="h3" gutterBottom>
        Medlemmer
      </Typography>
      <Grid container spacing={2} alignItems="stretch" justifyContent="center">
        {itvMembers.map((member) => (
          <Grid key={member.rank} item xs={12} md={6}>
            <ItvCard member={member} />
          </Grid>
        ))}
      </Grid>
    </Template>
  );
};

ItvPage.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout>{page}</Layout>;
};

export default ItvPage;
