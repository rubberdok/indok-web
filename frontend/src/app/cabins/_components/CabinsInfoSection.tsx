import { Container, Grid, Stack, Typography } from "@mui/material";
import Image from "next/image";

import { FragmentType, getFragmentData, graphql } from "@/gql/app";

import { BookNow } from "./BookNow";

{
  /* Bilder er generert på nettsiden: https://undraw.co/ */
}
const size = 80;
const facilitiesData = [
  {
    icon: <Image alt="" src="/img/undraw_home.svg" width={size} height={size} />,
    text: "Varmekabler",
  },
  {
    icon: <Image alt="" src="/img/undraw_electricity.svg" width={size} height={size} />,
    text: "Innlagt strøm",
  },
  {
    icon: <Image alt="" src="/img/undraw_speaker.svg" width={size} height={size} />,
    text: "Høyttaleranlegg",
  },
  {
    icon: <Image alt="" src="/img/undraw_bed.svg" width={size} height={size} />,
    text: "18 soveplasser",
  },
  {
    icon: <Image alt="" src="/img/undraw_cooking.svg" width={size} height={size} />,
    text: "Kjøkken",
  },
  {
    icon: <Image alt="" src="/img/undraw_cabin.svg" width={size} height={size} />,
    text: "Badstue",
  },
  {
    icon: <Image alt="" src="/img/undraw_wifi.svg" width={size} height={size} />,
    text: "Wifi",
  },
  {
    icon: <Image alt="" src="/img/undraw_tv.svg" width={size} height={size} />,
    text: "TV i Bjørnen",
  },
];

const QueryFragment = graphql(`
  fragment CabinsInfoSection_Query on Query {
    ...BookNow_Query
  }
`);

type Props = {
  query: FragmentType<typeof QueryFragment>;
};

export const CabinsInfoSection: React.FC<Props> = (props) => {
  const query = getFragmentData(QueryFragment, props.query);
  return (
    <Container>
      <Grid container direction="row-reverse" justifyContent="space-between" alignItems="stretch" spacing={8} mb={4}>
        <Grid container item xs={12} md={6}>
          <Grid item xs={12}>
            <BookNow query={query} />
          </Grid>
        </Grid>
        <Grid
          item
          container
          xs={12}
          md={6}
          sx={{
            textAlign: "left",
          }}
          direction="column"
        >
          <Grid container spacing={4} justifyContent="space-between">
            {facilitiesData.map((facility) => (
              <Grid item md={3} sm={3} xs={6} key={facility.text}>
                <Stack textAlign="center" direction="column" justifyContent="center" alignItems="center" spacing={1}>
                  {facility.icon}
                  <Typography variant="caption">{facility.text}</Typography>
                </Stack>
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
};
