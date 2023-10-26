import { Typography } from "@mui/material";
import { red } from "@mui/material/colors";
import Grid from "@mui/material/Grid";

import { ContactInfo } from "@/components/pages/Janus/ContactInfo";
import { Template } from "@/components/pages/Janus/Template";
import { Layout } from "@/layouts/Layout";
import { NextPageWithLayout } from "@/lib/next";
import Eventsjef from "~/public/img/JanusstyretsMedlemmer/Eventsjef.jpg";
import Festsjef from "~/public/img/JanusstyretsMedlemmer/Festsjef.jpg";
import Hyttetursjef from "~/public/img/JanusstyretsMedlemmer/Hyttetursjef.jpg";
import JanusScriptRedaktør from "~/public/img/JanusstyretsMedlemmer/JanusScriptRedaktør.jpg";
import Kjellersjef from "~/public/img/JanusstyretsMedlemmer/Kjellersjef.jpg";
import Nestleder from "~/public/img/JanusstyretsMedlemmer/Nestleder.jpg";
import President from "~/public/img/JanusstyretsMedlemmer/President.jpg";
import PRsjef from "~/public/img/JanusstyretsMedlemmer/PRsjef.jpg";
import Sekretær from "~/public/img/JanusstyretsMedlemmer/Sekretær.jpg";
import Websjef from "~/public/img/JanusstyretsMedlemmer/Websjef.jpg";
const JanusPage: NextPageWithLayout = () => {
  const responsibles = [
    {
      id: 1,
      name: "Jenny Wæraas Temmerud",
      position: "President",
      color: red[800],
      image: President,
      phonenumber: "tlf: 41388 670",
      email: "president@janus.org.ntnu.no",
    },
    {
      id: 2,
      name: "Philip Thomas Jenkins",
      position: "Økonomisjef/Nestleder",
      color: red[500],
      image: Nestleder,
      phonenumber: "955 52 393",
      email: "okonomi@janus.org.ntnu.no",
    },
    {
      id: 3,
      name: "Mina Lindebø Myrstøl",
      position: "Websjef",
      color: red[500],
      image: Websjef,
      phonenumber: "tlf: 477 17 089",
      email: "web@janus.org.ntnu.no",
    },
    {
      id: 4,
      name: "Camilla Toftum Hop",
      position: "JanusScript-Redaktør",
      color: red[500],
      image: JanusScriptRedaktør,
      phonenumber: "tlf: 477 09 820",
      email: "jsredaktor@janus.org.ntnu.no",
    },
    {
      id: 5,
      name: "Elise Flovikholm",
      position: "Hyttetursjef",
      color: red[500],
      image: Hyttetursjef,
      phonenumber: "tlf: 413 40 153",
      email: "hyttetursjef@janus.org.ntnu.no",
    },
    {
      id: 6,
      name: "Silje Holm Johannesen",
      position: "Kjellersjef",
      color: red[500],
      image: Kjellersjef,
      phonenumber: "tlf: 974 27 813",
      email: "kjellersjef@janus.org.ntnu.no",
    },
    {
      id: 7,
      name: "Thomas Kallasten Pedersen",
      position: "Festsjef",
      color: red[500],
      image: Festsjef,
      phonenumber: "tlf: 472 73 906",
      email: "fest@janus.org.ntnu.no",
    },
    {
      id: 8,
      name: "Eva Marie Melbø",
      position: "Eventsjef",
      color: red[500],
      image: Eventsjef,
      phonenumber: "tlf: 960 43 668",
      email: "event@janus.org.ntnu.no",
    },
    {
      id: 9,
      name: "Minda Harms",
      position: "PR-sjef",
      color: red[500],
      image: PRsjef,
      phonenumber: "tlf: 407 61 475",
      email: "pr@janus.org.ntnu.no",
    },
    {
      id: 10,
      name: "Magnus Johansen Moldekleiv",
      position: "Sekretær",
      color: red[500],
      image: Sekretær,
      phonenumber: "tlf: 928 17 970",
      email: "sekretaer@janus.org.ntnu.no",
    },
  ];

  return (
    <Template title="Om Janus linjeforening" description="Janus er indøks linjeforening">
      <Typography variant="body1" paragraph>
        Foreningen for Studentene ved Industriell Økonomi og Teknologiledelse er den øverste instansen
        («moderforeningen») for all studentfrivillighet på masterstudiet Indøk ved NTNU. Foreningen drives av over 200
        ivrige sjeler og over 20 ulike underforeninger, hvor alt fra veldedighet og ølbrygging til fadderuker og
        case-trening står på agendaen.
      </Typography>
      <Typography variant="h3" gutterBottom>
        Janus
      </Typography>
      <Typography variant="body1" paragraph>
        Janus er i romersk mytologi guden for portene, dørene, døråpningene, alle begynnelser og enhver slutt. Han er
        som regel avbildet med to ansikter på et hode som er vendt i hver sin retning. En tolkning er at det ene
        ansiktet ser framover i tid og det andre tilbake til fortiden. Janus ble hyppig benyttet for å symbolisere
        endringer og overganger slik som utvikling fra fortiden til framtiden, av en visjon til en annen visjon, unge
        mennesker som vokser opp og endres fra barn til ungdom og fra ungdom til voksen, og fra et univers til et annet
        univers.
      </Typography>
      <Typography variant="h3" gutterBottom>
        Vår oppgave er å sørge for at indøkstudentene får en fantastisk studietid!
      </Typography>
      <Typography variant="body1" paragraph>
        Det første møtet med Janus er 1. klassingenes første skoledag! Vi jobber hardt med å planlegge og gjennomføre
        fadderukene på Indøk slik at alle nye skal føle seg som en del av indøkfamilien så raskt som mulig. Janus
        arrangerer mange forskjellige eventer gjennom hele skoleåret, og har et ønske om å ha et tilbud som gjør at alle
        er med på noe i løpet av året. Dette omfavner alt fra tradisjonsrike Indøk-arrangementer som
        immatrikuleringsball, Winter Games og Åretur til curling, talentkonkurranser og adventsfrokoster.
      </Typography>
      <Typography variant="body1" paragraph>
        Janus-styret er også Indøks ansikt utad. Som styremedlem er man så heldig å bli invitert på andre
        linjeforeningers arrangementer som ball, jubileer og revyer, og på den måten knytte bånd på tvers av
        studieretninger, universiteter og høyskoler.
      </Typography>
      <Typography variant="h3" gutterBottom>
        Janusvalget
      </Typography>
      <Typography variant="body1" paragraph>
        Valg av nye styremedlemmer foregår på Janusvalget, der alle indøkere kan møte opp og har stemmerett. Om man
        ønsker, kan man gi styret beskjed på forhånd at man vil stille til valg, men det er også fullt mulig å kunngjøre
        at man stiller når vi ber kandidatene tre frem. Det er også åpent for benkeforslag fra salen. Om våren velges
        det ny president, nestleder, JanuScript-redaktør, websjef, hyttetursjef og kjellersjef, mens det på høsten er
        festsjef, eventsjef, PR-sjef og sekretær som velges.
      </Typography>
      <Typography variant="body1" paragraph>
        For hvert verv bes kandidatene holde en kort appell for forsamlingen der det redegjøres for motivasjon for
        vervet. Det er også lagt opp til at kandidaten legger inn et element der man på sin egen måte viser hvem man er.
        Deretter vil det åpnes for spørsmål fra salen. Nøl ikke med å ta kontakt dersom det er noe du lurer på:)
      </Typography>
      <Typography variant="h3" gutterBottom>
        Medlemmer
      </Typography>

      <Grid
        container
        direction="row"
        justifyContent="center"
        alignItems="stretch"
        spacing={8}
        sx={{ mb: (theme) => theme.spacing(8) }}
      >
        {responsibles.map((responsible) => (
          <Grid container item sm={4} xs={8} key={responsible.id}>
            <ContactInfo
              name={responsible.name}
              email={responsible.email}
              phonenumber={responsible.phonenumber}
              image={responsible.image}
              position={responsible.position}
            />
          </Grid>
        ))}
      </Grid>
    </Template>
  );
};

JanusPage.getLayout = (page) => <Layout>{page}</Layout>;

export default JanusPage;
