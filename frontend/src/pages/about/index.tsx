import { Box, List, ListItem, ListItemText, Paper, Typography } from "@mui/material";
import { listItemClasses } from "@mui/material/ListItem";
import Head from "next/head";

import { Template } from "@/components/pages/about/Template";
import { Layout } from "@/layouts/Layout";
import { NextPageWithLayout } from "@/lib/next";

const AboutPage: NextPageWithLayout = () => {
  return (
    <>
      <Head>
        <title>Om oss | Indøk NTNU - Foreningen for Studentene ved Industriell Økonomi og Teknologiledelse</title>
        <meta
          name="description"
          content="Foreningen for Studentene ved Industriell Økonomi og Teknologiledelse er den øverste instansen for all studentfrivillighet på masterstudiet Indøk ved NTNU."
        />
      </Head>
      <Template
        title="Om oss"
        description="Foreningen for Studentene ved Industriell Økonomi og Teknologiledelse er den øverste instansen
      (moderforeningen) for all studentfrivillighet på masterstudiet Indøk ved NTNU."
        nextPost={{ title: "Våre foreninger", slug: "/about/organization" }}
      >
        <Typography variant="body1" paragraph>
          Foreningen for Studentene ved Industriell Økonomi og Teknologiledelse er den øverste instansen
          («moderforeningen») for all studentfrivillighet på masterstudiet Indøk ved NTNU. Foreningen drives av over 200
          ivrige sjeler og over 20 ulike underforeninger, hvor alt fra veldedighet og ølbrygging til fadderuker og
          case-trening står på agendaen.
        </Typography>
        <Typography variant="body1" paragraph>
          Foreningen ledes av Hovedstyret, som forvalter midlene og fungerer som et koordinerende forum mellom de ulike
          studentforeningene. Hovedstyret består av et valgt lederpar, lederne for hver av de større studentforeningene
          på Indøk og instituttillitsvalgt på IØT. Generalforsamlingen er Foreningens øverste myndighet, hvor alle
          studentene på Indøk har stemmerett.
        </Typography>
        <Typography variant="h3" component="h2" gutterBottom>
          Historie
        </Typography>
        <Typography variant="body1" paragraph>
          Foreningen er formaliseringen av all foreningsaktivitet på Indøk under ett og samme tak. På den måten kan vi
          si at Foreningen har eksistert så lenge studentfrivilligheten på Indøk har det.
        </Typography>
        <Typography variant="body1" paragraph>
          Allerede på det første Indøk-kullet i 86´ ble næringslivskontakten Bindeleddet startet. I år 2000 hadde man
          den første festen på Janus-kjellerne. I løpet av de neste 20 årene skulle flere titalls tilbud bli startet,
          med alt fra veldedighet og ølbrygging til fadderuker og case-trening på agendaen.
        </Typography>
        <Paper>
          <Box p={4} my={3}>
            <Typography variant="body1">
              En detaljert historie om all foreningsaktivitet på Indøk er under utarbeidelse. Har du eksklusiv kunnskap
              om denne? Send en mail til leder@indokhs.no
            </Typography>
          </Box>
        </Paper>

        <Typography variant="h3" component="h2" gutterBottom>
          Foreningens formål
        </Typography>
        <Typography variant="body1">Fra vedtektene:</Typography>

        <blockquote>
          <Typography variant="body1" paragraph>
            <i>
              «Foreningens formål [..] å støtte den samlede studentmassen på sivilingeniørstudiet Industriell Økonomi og
              Teknologiledelse ved Norges Teknisk- Naturvitenskapelige Universitet (NTNU). Foreningens virksomhet skal
              ubetinget basere seg på ideelle målsetninger, og all økonomisk støtte fra foreningen skal være av
              allmennyttig art og tjene den jevne student ved studiet. Foreningen skal ikke drive ervervsmessig
              virksomhet.»
            </i>
          </Typography>
        </blockquote>

        <Typography variant="h3" component="h2" gutterBottom>
          Hovedstyret
        </Typography>
        <Typography variant="body1" paragraph>
          Hovedstyret (HS) er styret i Foreningen for Studentene ved Industriell Økonomi og Teknologiledelse, NTNU.
          Styrets fremste oppgave er å sørge for god kommunikasjon og samarbeid mellom de ulike studentinitiativene,
          samt forvalte og disponere Indøks midler på en forsvarlig måte.
        </Typography>
        <Typography variant="body1" paragraph>
          Hovedstyret er videre ansvarlig for å forberede og avholde generalforsamling for studentene ved Indøk.
          Generalforsamlingen er Foreningens øverste organ og er studentenes mulighet til å direkte påvirke budsjetter
          og avgjørelser som blir fattet på linjen.
        </Typography>
        <Typography variant="body1" paragraph>
          Opp gjennom historien har Foreningen hatt følgende lederpar:{" "}
        </Typography>
        <List
          dense
          sx={{
            listStyleType: "disc",
            listStylePosition: "inside",
            [`& .${listItemClasses.root}`]: {
              display: "list-item",
            },
          }}
        >
          <ListItem>
            <ListItemText primary="Ole Heliesen og Georg Øiesvold" secondary="2008-2009" />
          </ListItem>
          <ListItem>
            <ListItemText secondary="2009-2010" primary="Magnus Valmot og Ole-Christen Enger" />
          </ListItem>
          <ListItem>
            <ListItemText secondary="2010-2011" primary="Thomas Eide og Ole-Daniel Nitter" />
          </ListItem>
          <ListItem>
            <ListItemText secondary="2011-2012" primary="Michael Wiik og Iver Roen Velo" />
          </ListItem>
          <ListItem>
            <ListItemText secondary="2012-2013" primary="Anja Graff Nesse og Steinar H. Fretheim" />
          </ListItem>
          <ListItem>
            <ListItemText secondary="2013-2014" primary="Ove Mørch og Christian Fredrik Scheel" />
          </ListItem>
          <ListItem>
            <ListItemText secondary="2014-2015" primary="Lars Arild Wold og Marianne Engseth" />
          </ListItem>
          <ListItem>
            <ListItemText secondary="2015-2016" primary="Marius Lie Morken og Hanne Sandven" />
          </ListItem>
          <ListItem>
            <ListItemText secondary="2016-2017" primary="Simen Nygaard Hansen og Kristoffer Birkeland" />
          </ListItem>
          <ListItem>
            <ListItemText secondary="2017-2018" primary="Gard Rystad og Vemund Wøien" />
          </ListItem>
          <ListItem>
            <ListItemText secondary="2018-2019" primary="Daniel Kittilsen Henriksen og Amanda Borge Byrkjeland" />
          </ListItem>
          <ListItem>
            <ListItemText secondary="2019-2020" primary="Peder Gjerstad og Mette Liset" />
          </ListItem>
          <ListItem>
            <ListItemText secondary="2020-2021" primary="Andreas Johannesen og Lars Lien Ankile" />
          </ListItem>
          <ListItem>
            <ListItemText secondary="2021-2022" primary="Christian August Brask Rustad og Olaf Alexander Styrmoe" />
          </ListItem>
          <ListItem>
            <ListItemText secondary="2022-2023" primary="Morten Vinje og Erlend Heir" />
          </ListItem>
        </List>
      </Template>
    </>
  );
};

AboutPage.getLayout = (page) => <Layout>{page}</Layout>;

export default AboutPage;
