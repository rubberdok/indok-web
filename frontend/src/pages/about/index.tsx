import Layout from "@components/Layout";
import Wrapper from "@components/pages/about/Wrapper";
import { AppBar, Box, Breadcrumbs, Container, Link, makeStyles, Tab, Tabs, Typography } from "@material-ui/core";
import { NextPage } from "next";
import React from "react";

const useStyles = makeStyles(() => ({
  title: {
    color: "white",
  },
  titleImage: {
    width: "100%",
    height: "300px",
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
  },
  navItem: {
    fontWeight: 600,
    fontSize: 12,
    textTransform: "uppercase",
    color: "black",
    "&:hover": {
      cursor: "pointer",
    },
  },
  breadcrumb: {
    color: "#fff",
  },
}));

const AboutPage: NextPage = () => {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);

  return (
    <Layout>
      <Container>
        <Box mt={5}>
          <AppBar color="default" position="static">
            <Tabs
              indicatorColor="primary"
              value={value}
              onChange={() => setValue(value)}
              aria-label="simple tabs example"
            >
              <Tab className={classes.navItem} label="Om oss" />
              <Tab className={classes.navItem} label="Hovedstyret" />
              <Tab className={classes.navItem} label="Organisasjon" />
            </Tabs>
          </AppBar>
        </Box>
        <Box position="relative" className={classes.title} height={300}>
          <Box
            display="flex"
            alignItems="center"
            flexDirection="column"
            justifyContent="center"
            className={classes.titleImage}
            style={{
              backgroundImage: `linear-gradient(to top, rgb(0 0 0 / 76%), rgb(0 0 0 / 86%)),
                  url(img/gang.jpg)`,
            }}
          >
            <Box mb={1}>
              <Breadcrumbs className={classes.breadcrumb} aria-label="breadcrumb">
                <Link variant="overline" color="inherit" href="/about">
                  Om foreningen
                </Link>
                <Typography variant="overline">Om oss</Typography>
              </Breadcrumbs>
            </Box>
            <Typography variant="h2">Hvem er vi?</Typography>
          </Box>
        </Box>
      </Container>
      <Wrapper>
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
        <Typography gutterBottom variant="h6">
          Hovedstyret blir født
        </Typography>
        <br />
        <Typography variant="body2">
          Foreningen for Studentene ved Industriell Økonomi og Teknologiledelse, NTNU er formaliseringen av all
          foreningsaktivitet på Indøk under ett og samme tak. På den måten kan vi si at Foreningen har eksistert så
          lenge studentfrivilligheten på Indøk har det. Allerede på det første Indøk-kullet i 86´ ble
          næringslivskontakten Bindeleddet startet, og i år 2000 hadde man den første festen på Janus-kjellerne. I løpet
          av de neste 20 årene skulle flere titalls tilbud bli startet. <br />
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

        <Typography gutterBottom variant="h6">
          Foreningens formål
        </Typography>
        <Typography variant="body2">
          <i>
            «Foreningens formål er å støtte den samlede studentmassen på sivilingeniørstudiet Industriell Økonomi og
            Teknologiledelse ved Norges Teknisk- Naturvitenskapelige Universitet (NTNU). Foreningens virksomhet skal
            ubetinget basere seg på ideelle målsetninger, og all økonomisk støtte fra foreningen skal være av
            allmennyttig art og tjene den jevne student ved studiet. Foreningen skal ikke drive ervervsmessig
            virksomhet.»
          </i>
        </Typography>
        <Typography variant="body2">
          &emsp; &emsp;<b>- Forenings vedtekter</b>
        </Typography>
      </Wrapper>
    </Layout>
  );
};

export default AboutPage;
