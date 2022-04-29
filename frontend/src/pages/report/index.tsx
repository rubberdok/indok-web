import Layout from "@components/Layout";
import ContactInfo from "@components/pages/reports/ContactInfo";
import {
  Button,
  Card,
  CardContent,
  CircularProgress,
  Container,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  useTheme,
} from "@mui/material";
import { amber, deepOrange, deepPurple, green, indigo, red } from "@mui/material/colors";
import { ArrowRight } from "@mui/icons-material";
import { NextPage } from "next";
import Head from "next/head";
import Amund from "@public/img/Amund.jpg";
import Benjamin from "@public/img/Benjamin.jpg";
import Christine from "@public/img/Christine.jpeg";
import Jesper from "@public/img/Jesper.jpg";
import Laila from "@public/img/Laila.jpg";
import Maria from "@public/img/Maria.jpg";
import { useRef } from "react";

const ReportsPage: NextPage = () => {
  const formRef = useRef<null | HTMLDivElement>(null);
  const scrollToForm = () => formRef.current?.scrollIntoView({ behavior: "smooth" });
  const theme = useTheme();

  const responsibles = [
    {
      id: 1,
      name: "Amund Andreassen",
      position: "Leder",
      initials: "AA",
      color: red[800],
      image: Amund,
      email: "amunan@stud.ntnu.no",
    },
    {
      id: 2,
      name: "Christine Lindberg",
      initials: "CL",
      color: deepOrange[500],
      email: "chrislli@stud.ntnu.no",
      image: Christine,
    },
    {
      id: 3,
      name: "Laila Voll",
      initials: "LV",
      color: amber[500],
      image: Laila,
      email: "lailaov@stud.ntnu.no",
    },
    {
      id: 4,
      name: "Benjamin Pettersen",
      initials: "BP",
      color: green[500],
      image: Benjamin,
      email: "benjamin-pettersen@hotmail.com",
    },
    {
      id: 5,
      name: "Jesper Engvik Skovdahl",
      initials: "JS",
      color: indigo[500],
      image: Jesper,
      email: "jesperes@stud.ntnu.no",
    },
    {
      id: 6,
      name: "Maria Ruiz Ulltveit-Moe (permisjon)",
      initials: "MM",
      color: deepPurple[500],
      image: Maria,
    },
  ];

  return (
    <Layout>
      <Head>
        <title>Baksida | Forening for studenter ved Industriell Økonomi og Teknologiledelse</title>
        <meta name="og:title" content="Baksida | Indøk NTNU" key="title" />
      </Head>
      <Container>
        <Grid
          container
          direction="row"
          justifyContent="center"
          alignItems="stretch"
          spacing={2}
          style={{ marginTop: 32, marginBottom: 16 }}
        >
          <Grid item container direction="column" justifyContent="center" alignItems="stretch" spacing={4} md={10}>
            <Grid item>
              <Card>
                <CardContent style={{ padding: 32 }}>
                  <Typography variant="h3" component="h2" gutterBottom>
                    Baksida
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    Indøk utgjør et stort og viktig sosialt fellesskap for studentene ved studieretningen.
                    Baksideløsningen er rettet både mot foreningene tilknyttet studiet og studenter ved studiet
                    generelt. Indøk skal være et trygt fellesskap for alle deltakere på aktiviteter og arrangementer, og
                    for alle som er tillitsvalgte eller bidrar frivillig til en forening tilknyttet Indøk. Det
                    overordnede målet er at grenseoverskridende atferd aldri finner sted i foreningen eller i
                    tilknytning til studieretningens arrangement eller aktiviteter.
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    Det er viktig for oss at du sier ifra dersom du eller andre opplever noe som ikke er greit, slik at
                    vi får muligheten til å gjøre noe med det som har skjedd og hindre at det skjer igjen.
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    Om du er i tvil, si ifra!
                  </Typography>
                  <Grid container direction="column" alignItems="center" spacing={2}>
                    <Grid item>
                      <Button onClick={scrollToForm} variant="contained" color="primary" size="large">
                        Varsel? Trykk her
                      </Button>
                    </Grid>

                    <Grid item>
                      <Typography variant="body2" gutterBottom>
                        Flere måter å varsle på står beskrevet lenger ned.
                      </Typography>
                    </Grid>
                  </Grid>

                  <Typography variant="h4" component="h3">
                    Hva er et varsel?
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    Et varsel er å melde ifra om bekymringsverdige forhold. Det kan være å si ifra om noe som ikke er
                    greit, noe som føles ubehagelig eller skremmende, eller handlinger som er ulovlige.{" "}
                  </Typography>

                  <Typography variant="h4" component="h3">
                    Hva kan jeg varsle om?
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    Du kan varsle om noe du selv har opplevd, noe som har skjedd med andre, noe du har blitt fortalt
                    eller noe du har sett som du mener ikke er greit eller som er ulovlig. Du har mulighet til å varsle
                    både om ting du ser på som veldig alvorlig og om ting som ikke nødvendigvis er så farlig, men du
                    tenker er greit at baksidekontakt vet om og potensielt kan ta tak i.
                  </Typography>

                  <Typography variant="subtitle1">Eksempler på kritikkverdige forhold:</Typography>
                  <List>
                    <ListItem>
                      <ListItemIcon>
                        <ArrowRight />
                      </ListItemIcon>
                      <ListItemText>Brudd på Retningslinjer varslingssystem Indøk</ListItemText>
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <ArrowRight />
                      </ListItemIcon>
                      <ListItemText>Lovbrudd</ListItemText>
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <ArrowRight />
                      </ListItemIcon>
                      <ListItemText>Mobbing, seksuell trakassering og overgrep</ListItemText>
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <ArrowRight />
                      </ListItemIcon>
                      <ListItemText>Diskriminering og rasisme</ListItemText>
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <ArrowRight />
                      </ListItemIcon>
                      <ListItemText>Uansvarlige strukturerer eller valg fra en forening</ListItemText>
                    </ListItem>
                  </List>

                  <Typography variant="subtitle1">Eksempler på forhold baksideløsningen ikke håndterer:</Typography>
                  <List>
                    <ListItem>
                      <ListItemIcon>
                        <ArrowRight />
                      </ListItemIcon>
                      <ListItemText>Økonomisk mislighold og korrupsjon - Kontakt revisjonskomiteen</ListItemText>
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <ArrowRight />
                      </ListItemIcon>
                      <ListItemText>
                        Kritikk av faglig innhold eller studiets oppbygning - Kontakt kulltillitsvalgt
                      </ListItemText>
                    </ListItem>
                  </List>

                  <Typography variant="h4" component="h3">
                    Hvem kan varsle?
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    Du har alltid mulighet til å varsle. Dersom du er bekymret eller i tvil bør du si ifra slik at
                    situasjonen kan oppklares. Det er lav terskel for å varsle og alle henvendelser blir tatt på alvor.
                  </Typography>

                  <Typography variant="h4" component="h3">
                    Hvordan varsler jeg?
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    Dersom varselet er tilknyttet en forening eller et arrangement i regi av en forening skal du ta
                    kontakt med din baksidekontakt. Dersom saken er av høy alvorlighetsgrad eller du av ulike grunner
                    ikke ønsker å varsle til sin baksidekontakt, kan varselet sendes direkte til baksideutvalget eller
                    en enkeltperson i baksideutvalget. I et varsel må du ha med ditt eget navn og hva du vil varsle
                    eller sende en bekymring om.
                  </Typography>

                  <List>
                    <ListItem>
                      <ListItemIcon>
                        <ArrowRight />
                      </ListItemIcon>
                      <ListItemText>
                        <Grid container direction="row" spacing={1}>
                          <Grid item>
                            <strong>Skjema på nettsiden:</strong>
                          </Grid>
                          <Grid item>
                            <Button size="small" variant="contained" color="primary" onClick={scrollToForm}>
                              Fylle ut varslingsskjema
                            </Button>
                          </Grid>
                        </Grid>
                      </ListItemText>
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <ArrowRight />
                      </ListItemIcon>
                      <ListItemText>
                        <strong>E-post:</strong> Sende inn en e-post til baksideansvarlig i en forening eller til et
                        medlem i baksideutvalget. Dersom baksidekontakt eller medlemmer av baksideutvalget av ulike
                        grunner ønskes ekskludert fra saksgangen, skal dette spesifiseres i e-posten.
                      </ListItemText>
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <ArrowRight />
                      </ListItemIcon>
                      <ListItemText>
                        <strong>Annet:</strong> Ringe, sende melding eller be om et personlig møte med baksidekontakt
                        eller baksideutvalget
                      </ListItemText>
                    </ListItem>
                  </List>

                  <Typography variant="body1" gutterBottom>
                    Meld fra på den måten du er mest komfortabel med. Dersom du synes det er vanskelig å si ifra på
                    egenhånd kan du ta med deg en kontaktperson gjennom prosessen.
                  </Typography>

                  <Typography variant="h4" component="h3" gutterBottom>
                    Kontaktinfo Baksideutvalget
                  </Typography>
                  <Grid
                    container
                    direction="row"
                    justifyContent="center"
                    spacing={8}
                    style={{ marginBottom: theme.spacing(8) }}
                  >
                    {responsibles.map((responsible) => (
                      <Grid item md={6} key={responsible.id}>
                        <ContactInfo
                          name={responsible.name}
                          email={responsible.email}
                          image={responsible.image}
                          position={responsible.position}
                        />
                      </Grid>
                    ))}
                  </Grid>

                  <Typography variant="subtitle1">Den som varsler oppfordres til å informere om:</Typography>
                  <List>
                    <ListItem>
                      <ListItemIcon>
                        <ArrowRight />
                      </ListItemIcon>
                      <ListItemText>
                        Hva det varsles om, hvor og når det skjedde og hvem som er involvert. Beskriv det som har skjedd
                        så nøye du kan.
                      </ListItemText>
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <ArrowRight />
                      </ListItemIcon>
                      <ListItemText>Andre som eventuelt er informert i saken.</ListItemText>
                    </ListItem>
                  </List>

                  <Typography variant="body1" gutterBottom>
                    Dersom du har forslag til tiltak og hensyn som bør ivaretas kan du gjerne informere om det. Dersom
                    baksidekontakt eller medlemmer av baksideutvalget av ulike grunner ønskes ekskludert fra saksgangen,
                    skal varsler også spesifisere dette. Det er ikke mulig å ekskludere mer enn halvparten av
                    baksideutvalget. I slike tilfeller vil Hovedstyret involveres for å finne en løsning.
                  </Typography>

                  <Typography variant="h4" component="h3">
                    Hva skjer når jeg har varslet?
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    Varsel og varslere vil alltid bli tatt på alvor.
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    Ved innsending av en sak viderebringes saken til baksideutvalget. Baksideutvalget er ansvarlig for
                    håndteringen av saken. Du vil også få tildelt en kontaktperson fra baksideutvalget.
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    Baksideutvalget sin første oppgave vil være å få klarhet i hva som har skjedd. Som regel blir du
                    kontaktet kort tid etter du har sendt inn varselet for en samtale. Baksideutvalget vil dermed samle
                    ytterligere informasjon om hendelsen og vurdere om sanksjoner er relevant.
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    Mens saken håndteres vil din kontaktperson til enhver tid holde deg oppdatert på hva som skjer. Du
                    som varsler skal ivaretas så godt som mulig gjennom hele prosessen.
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    Varslingssaker vil alltid bli behandlet fortrolig og av så få som mulig. Parter som er spesifisert
                    ekskludert vil derfor ikke være involvert i saksgangen. Enhver saksbehandler vil signere en
                    taushetserklæring.
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    Baksideløsningens håndtering av varsler handler om tillitsspørsmål og ikke skyld. Politi og domstol
                    tar stilling til skyldspørsmål. Saksbehandler kan imidlertid bistå i å ta slike saker videre.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid style={{ width: "100%" }} item ref={formRef}>
              <iframe
                title="Reports"
                src="https://docs.google.com/forms/d/e/1FAIpQLScP9hqHr2lzlbh1Ie7xXaLAjRkQx9MdRf5Hl1EDLb1kpulmjg/viewform?embedded=true"
                width="100%"
                height="2003px"
                frameBorder="0"
              >
                <CircularProgress />
              </iframe>
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </Layout>
  );
};

export default ReportsPage;
