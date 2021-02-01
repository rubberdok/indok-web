import Layout from "@components/Layout";
import { Container, Typography } from "@material-ui/core";
import { NextPage } from "next";
import React from "react";

const AboutPage: NextPage = () => {
  return (
    <Layout>
      <Container>
        <Typography variant="h1">Om foreningen</Typography>
        <Typography variant="body1">
          Velkommen til den offisielle nettsiden for Foreningen for studentene ved Indøk! Siden er laget av og for
          studentene selv. Her kan man lære mer om Indøk, vår historie, studentfrivilligheten og alle sosiale
          begivenheter.
        </Typography>
        <Typography variant="h2">Indøk 101</Typography>

        <Typography variant="body1">
          Industriell økonomi og teknologiledelse (Indøk) er akkurat det det høres ut som, en elegant kombinasjon av
          teknologi, økonomi og ledelse. Indøk er et studie skapt for å fylle et behov i industrien, nemlig å analysere
          komplekse problemstillinger i tverrfaglige team. Man bygger videre på matematikk og fysikk fra videregående,
          og får i tillegg i løpet av studiet dybdekunnskap innenfor økonomi og ledelse.
          <br />
          Velkommen til vår Forening!
        </Typography>
        <Typography variant="h2">
          Les mer om studiet her! <br />
          <br />
        </Typography>
        <Typography variant="h2">Om Hovedstyret</Typography>
        <Typography variant="body1">
          Foreningen for Studentene ved Industriell Økonomi og Teknologiledelse er den øverste instansen
          (moderorganisasjonen) for all studentfrivillighet på masterstudiet Indøk ved NTNU. Foreningen drives av over
          200 ivrige sjeler og over 20 ulike organisasjoner, hvor alt fra veldedighet og ølbrygging til fadderuker og
          case-trening står på agendaen. Foreningen ledes av Hovedstyret, som forvalter midlene og fungerer som et
          koordinerende forum mellom de ulike studentforeningene. Hovedstyret består av et valgt lederpar, lederne for
          hver av de større studentforeningene på Indøk og instituttillitsvalgt på IØT. Generalforsamlingen er
          Foreningens øverste myndighet, hvor alle studentene på Indøk har stemmerett.
        </Typography>
        <Typography variant="h2">Hovedstyret blir født</Typography>
        <Typography variant="body1">
          Foreningen for Studentene ved Industriell Økonomi og Teknologiledelse, NTNU er formaliseringen av all
          foreningsaktivitet på Indøk under ett og samme tak. På den måten kan vi si at Foreningen har eksistert så
          lenge studentfrivilligheten på Indøk har det. Allerede på det første Indøk-kullet i 86´ ble
          næringslivskontakten Bindeleddet startet. I år 2000 hadde man den første festen på Janus-kjellerne. I løpet av
          de neste 20 årene skulle flere titalls tilbud bli startet.
          <br />
          <br />I tidligere år hadde linjeforeningene på Indøk ett «Fordelingsmøte» i semesteret der studenter og
          linjeforeninger på studiet kunne søke om støtte til ulike prosjekter eller arrangementer. Fordelingsmøtet
          hadde som mandat å behandle søknader og fremme en innstilling om bruk av tilgjengelige midler overfor Allmøtet
          på IØT. Da denne ordningen ikke viste seg å være tilstrekkelig for å sikre langsiktighet, og da
          linjeforeningene så behov for et koordinerende forum, ble det i 2008 opprettet et Hovedstyre for studentene på
          Indøk med tilhørende vedtekter.
          <br />
          <br />
          For å formalisere dette organet i høyere grad, og for å tilfredsstille krav til vedtekter fra
          Brønnøysundregisteret, opprettet studentene på Indøk Foreningen for studentene ved Industriell Økonomi og
          Teknologiledelse, NTNU, i februar 2010. Dette er en forening for alle studentene på sivilingeniørstudiet
          Industriell Økonomi og Teknologiledelse på NTNU, og denne foreningen styres av det som kalles Hovedstyret. I
          dette styret sitter følgende personer i ett år:
          <br />
          <br /> -Et lederpar (valgt på Generalforsamlingen i april)
          <br /> -President for Janus
          <br /> -Leder i Bindeleddet NTNU
          <br /> -Leder i ESTIEM
          <br /> -Leder i Hyttestyret
          <br /> -Leder av Janus IF
          <br /> -Leder av Indøk Kultur
          <br /> -Én av ITV’ene
          <br />
          <br />
          <Typography variant="h2">Foreningens formål</Typography>
          «Foreningens formål er å støtte den samlede studentmassen på sivilingeniørstudiet Industriell Økonomi og
          Teknologiledelse ved Norges Teknisk- Naturvitenskapelige Universitet (NTNU). Foreningens virksomhet skal
          ubetinget basere seg på ideelle målsetninger, og all økonomisk støtte fra foreningen skal være av allmennyttig
          art og tjene den jevne student ved studiet. Foreningen skal ikke drive ervervsmessig virksomhet.» -Foreningens
          vedtekter
          <br />
          <br />
          <Typography variant="h2">Hovedstyrets mandat og virke</Typography>
          <br />
          -Hovedstyret har innsynsrett i alle linjeforeningenes aktiviteter, budsjetter og regnskap.
          <br />
          -Hovedstyret har for øvrig ingen myndighet over linjeforeningene. Generalforsamlingen har myndighet over
          linjeforeningene i henhold til den enkelte linjeforenings vedtekter.
          <br />
          Hovedstyret forvalter og disponerer midler som stilles til disposisjon av linjeforeningene. – Foreningens
          vedtekter
          <br />
          <br />
          <Typography variant="h2">Foruten å styre Foreningen i henhold til formålet skal Hovedstyret:</Typography>
          <br />
          -Være en stemme utad for sivilingeniørstudentene ved Institutt for Industriell Økonomi og Teknologiledelse
          (IØT)
          <br />
          -Sørge for kommunikasjon og samhandling mellom de ulike linjeforeningene ved studiet og sørge for forsvarlig
          og langsiktig håndtering av de økonomiske midlene som disse foreningene disponerer.
          <br />
          -Støtte de tillitsvalgte ved IØT (herunder medlemmene av Studentrådet IØT) i saker som angår
          sivilingeniørsstudiet ved IØT
          <br />– Foreningens vedtekter
        </Typography>
      </Container>
    </Layout>
  );
};

export default AboutPage;
