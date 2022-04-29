import Template from "@components/pages/about/Template";
import { Box, Paper, Typography } from "@mui/material";
import React from "react";
import Layout from "src/layouts";
import { NextPageWithLayout } from "../_app";

const AboutPage: NextPageWithLayout = () => {
  return (
    <>
      <Template
        img="img/hero.jpg"
        title="Om oss"
        page=""
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
        <Typography variant="h3" gutterBottom>
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

        <Typography variant="h3" gutterBottom>
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

        <Typography variant="h3" gutterBottom>
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
        <Typography component="div" variant="body1" paragraph>
          <ul>
            <li>2008-2009: Ole Heliesen og Georg Øiesvold</li>
            <li>2009-2010: Magnus Valmot og Ole-Christen Enger</li>
            <li>2010-2011: Thomas Eide og Ole-Daniel Nitter</li>
            <li>2011-2012: Michael Wiik og Iver Roen Velo</li>
            <li>2012-2013: Anja Graff Nesse og Steinar H. Fretheim</li>
            <li>2013-2014: Ove Mørch og Christian Fredrik Scheel</li>
            <li>2014-2015: Lars Arild Wold og Marianne Engseth</li>
            <li>2015-2016: Marius Lie Morken og Hanne Sandven</li>
            <li>2016-2017: Simen Nygaard Hansen og Kristoffer Birkeland</li>
            <li>2017-2018: Gard Rystad og Vemund Wøien</li>
            <li>2018-2019: Daniel Kittilsen Henriksen og Amanda Borge Byrkjeland</li>
            <li>2019-2020: Peder Gjerstad og Mette Liset</li>
            <li>2020-2021: Andreas Johannesen og Lars Lien Ankile</li>
            <li>2021-2022: Christian August Brask Rustad og Olaf Alexander Styrmoe</li>
          </ul>
        </Typography>
      </Template>
    </>
  );
};

AboutPage.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout>{page}</Layout>;
};

export default AboutPage;
