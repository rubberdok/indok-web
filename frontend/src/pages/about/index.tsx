import Layout from "@components/Layout";
import Wrapper from "@components/pages/about/Wrapper";
import { Box, Grid, makeStyles, Typography } from "@material-ui/core";
import { NextPage } from "next";
import React from "react";

const useStyles = makeStyles(() => ({
  title: {
    color: "white",
  },
  titleImage: {
    width: "100%",
    height: "100%",
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
  },
}));

const AboutPage: NextPage = () => {
  const classes = useStyles();

  return (
    <Layout>
      <Wrapper>
        <Box mb={5} position="relative" className={classes.title} height={300}>
          <Grid style={{ height: "100%" }} container>
            <Grid item xs={12}>
              <Box
                className={classes.titleImage}
                style={{
                  backgroundImage: `linear-gradient(to left, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.9)),
        url('img/gang.jpg')`,
                }}
              ></Box>
            </Grid>
          </Grid>
          <Grid container>
            <Grid item xs={1}></Grid>
            <Grid item xs={7}>
              <Box display="flex" top="0" alignItems="center" position="absolute" height="100%" zIndex="4">
                <Box width={650}>
                  <Typography variant="overline">Om foreningen</Typography>
                  <Typography variant="h2">Hvem er vi?</Typography>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={4}></Grid>
          </Grid>
        </Box>
        <Typography variant="body1">
          Foreningen for Studentene ved Industriell Økonomi og Teknologiledelse er den øverste instansen
          (moderorganisasjonen) for all studentfrivillighet på masterstudiet Indøk ved NTNU. Foreningen drives av over
          200 ivrige sjeler og over 20 ulike organisasjoner, hvor alt fra veldedighet og ølbrygging til fadderuker og
          case-trening står på agendaen. Foreningen ledes av Hovedstyret, som forvalter midlene og fungerer som et
          koordinerende forum mellom de ulike studentforeningene. Hovedstyret består av et valgt lederpar, lederne for
          hver av de større studentforeningene på Indøk og instituttillitsvalgt på IØT. Generalforsamlingen er
          Foreningens øverste myndighet, hvor alle studentene på Indøk har stemmerett.
        </Typography>
        <br />
        <Typography gutterBottom variant="h3">
          Hovedstyret blir født
        </Typography>
        <Typography variant="body2">
          Foreningen for Studentene ved Industriell Økonomi og Teknologiledelse, NTNU er formaliseringen av all
          foreningsaktivitet på Indøk under ett og samme tak. På den måten kan vi si at Foreningen har eksistert så
          lenge studentfrivilligheten på Indøk har det. Allerede på det første Indøk-kullet i 86´ ble
          næringslivskontakten Bindeleddet startet. I år 2000 hadde man den første festen på Janus-kjellerne. I løpet av
          de neste 20 årene skulle flere titalls tilbud bli startet. <br />
          <br />I tidligere år hadde linjeforeningene på Indøk ett «Fordelingsmøte» i semesteret der studenter og
          linjeforeninger på studiet kunne søke om støtte til ulike prosjekter eller arrangementer. Fordelingsmøtet
          hadde som mandat å behandle søknader og fremme en innstilling om bruk av tilgjengelige midler overfor Allmøtet
          på IØT. Da denne ordningen ikke viste seg å være tilstrekkelig for å sikre langsiktighet, og da
          linjeforeningene så behov for et koordinerende forum, ble det i 2008 opprettet et Hovedstyre for studentene på
          Indøk med tilhørende vedtekter.
          <br />
          <br /> For å formalisere dette organet i høyere grad, og for å tilfredsstille krav til vedtekter fra
          Brønnøysundregisteret, opprettet studentene på Indøk Foreningen for studentene ved Industriell Økonomi og
          Teknologiledelse, NTNU, i februar 2010. Dette er en forening for alle studentene på sivilingeniørstudiet
          Industriell Økonomi og Teknologiledelse på NTNU, og denne foreningen styres av det som kalles Hovedstyret. I
          dette styret sitter følgende personer i ett år:
          <ul>
            <li>Et lederpar (valgt på Generalforsamlingen i april)</li>
            <li> President for Janus</li>
            <li> Leder i Bindeleddet NTNU</li>
            <li> Leder i ESTIEM</li>
            <li> Leder i Hyttestyret</li>
            <li> Leder av Janus IF</li>
            <li> Leder av Indøk Kultur</li>
            <li> Én av ITV’ene</li>
          </ul>
        </Typography>
        <br />
        <Typography variant="h3">Hovedstyret blir født</Typography>
      </Wrapper>
    </Layout>
  );
};

export default AboutPage;
