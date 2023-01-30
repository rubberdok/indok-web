import { Box, Card, CardActionArea, CardMedia, Paper, Typography } from "@mui/material";
import { red } from "@mui/material/colors";
import Grid from "@mui/material/Grid";
import { styled } from "@mui/material/styles";

import { Template } from "@/components/pages/about/Template";
import { ContactInfo } from "@/components/pages/janusstyret/ContactInfo";
import { Layout } from "@/layouts/Layout";
import { NextPageWithLayout } from "@/pages/_app";
import didrik from "~/public/img/janusstyret_bilder/didrik.jpg";
import fannar from "~/public/img/janusstyret_bilder/fannar.jpg";
import hb from "~/public/img/janusstyret_bilder/hb.jpg";
import jenny from "~/public/img/janusstyret_bilder/jenny.jpg";
import markus from "~/public/img/janusstyret_bilder/markus.jpg";
import martin from "~/public/img/janusstyret_bilder/martin.jpg";
import mina from "~/public/img/janusstyret_bilder/mina.jpg";
import oskar from "~/public/img/janusstyret_bilder/oskar.jpg";
import philip from "~/public/img/janusstyret_bilder/philip.jpg";
import tobias from "~/public/img/janusstyret_bilder/tobias.jpg";

const StyledCardActionArea = styled(CardActionArea)(({ theme }) => ({
  display: "flex",
  height: "180px",
  flexDirection: "column",
  justifyContent: "space-between",
  textAlign: "center",
  padding: theme.spacing(2, 3),
}));

const StyledCardMedia = styled(CardMedia)(() => ({
  height: "100px",
  width: "100%",
  backgroundSize: "contain",
  backgroundPosition: "center",
  alignContent: "center",
}));

const responsibles = [
  {
    id: 1,
    name: "Oskar Gåsø",
    position: "President",
    color: red[800],
    image: oskar,
    phonenumber: "tlf: 979 62 390",
    email: "oskar.gasoo@gmail.com",
  },
  {
    id: 2,
    name: "Markus Kile Søyland",
    position: "Økonomisjef/Nestleder",
    color: red[500],
    image: markus,
    phonenumber: "tlf: 468 48 580",
    email: "marsoy2002@gmail.com",
  },
  {
    id: 3,
    name: "Fannar Steinn Lindal Rafnsson",
    position: "Websjef",
    color: red[500],
    image: fannar,
    phonenumber: "tlf: 938 16 614",
    email: "fannar23@gmail.com",
  },
  {
    id: 4,
    name: "Didrik Næss",
    position: "JanusScript-Redaktør",
    color: red[500],
    image: didrik,
    phonenumber: "tlf: 476 57 533",
    email: "didriknaess@hotmail.com",
  },
  {
    id: 5,
    name: "Martin Nåtedal",
    position: "Hyttetursjef",
    color: red[500],
    image: martin,
    phonenumber: "tlf: 984 80 743",
    email: "martin.natedal@gmail.com",
  },
  {
    id: 6,
    name: "Tobias Jortveit",
    position: "Kjellersjef",
    color: red[500],
    image: tobias,
    phonenumber: "tlf: 953 66 176",
    email: "tobiasjortveit@gmail.com",
  },
  {
    id: 7,
    name: "Jenny Temmerud",
    position: "Festsjef",
    color: red[500],
    image: jenny,
    phonenumber: "tlf: 413 88 670",
    email: "jennywtemmerud@gmail.com",
  },
  {
    id: 8,
    name: "Philip Thomas Jenkins",
    position: "Eventsjef",
    color: red[500],
    image: philip,
    phonenumber: "tlf: 955 52 393",
    email: "philipthomasjenkinkins@hotmail.com",
  },
  {
    id: 9,
    name: "Mina Myrstøl",
    position: "PR-sjef",
    color: red[500],
    image: mina,
    phonenumber: "tlf: 477 17 089",
    email: "myrmina@gmail.com",
  },
  {
    id: 10,
    name: "Hans Bertil Olsson",
    position: "Sekretær",
    color: red[500],
    image: hb,
    phonenumber: "tlf: 482 92 265",
    email: "hansbert2002@gmail.com",
  },
];

const AboutPage: NextPageWithLayout = () => {
  return (
    <>
      <Template
        title="Om Janus Linjeforening"
        description="Janus er....."
        nextPost={{ title: "Våre foreninger", slug: "/about/organization" }}
      >
        <Typography variant="body1" paragraph>
          Foreningen for Studentene ved Industriell Økonomi og Teknologiledelse er den øverste instansen
          («moderforeningen») for all studentfrivillighet på masterstudiet Indøk ved NTNU. Foreningen drives av over 200
          ivrige sjeler og over 20 ulike underforeninger, hvor alt fra veldedighet og ølbrygging til fadderuker og
          case-trening står på agendaen.
        </Typography>
        <Typography variant="h3" gutterBottom>
          Janus [jææː.nus]
        </Typography>
        <Typography variant="body1" paragraph>
          Janus er i romersk mytologi guden for portene, dørene, døråpningene, alle begynnelser og enhver slutt. Han er
          som regel avbildet med to ansikter på et hode som er vendt i hver sin retning. En tolkning er at det ene
          ansiktet ser framover i tid og det andre tilbake til fortiden. Janus ble hyppig benyttet for å symbolisere
          endringer og overganger slik som utvikling fra fortiden til framtiden, av en visjon til en annen visjon, unge
          mennesker som vokser opp og endres fra barn til ungdom og fra ungdom til voksen, og fra et univers til et
          annet univers.
        </Typography>

        <Typography variant="h3" gutterBottom>
          Vår oppgave er å sørge for at indøkstudentene får en fantastisk studietid!
        </Typography>
        <Typography variant="body1" paragraph>
          Det første møtet med Janus er 1.klassingenes første skoledag! Vi jobber hardt med å planlegge og gjennomføre
          fadderukene på Indøk slik at alle nye skal føle seg som en del av indøkfamilien så raskt som mulig. Janus
          arrangerer mange forskjellige eventer gjennom hele skoleåret, og har et ønske om å ha et tilbud som gjør at
          alle er med på noe i løpet av året. Dette omfavner alt fra tradisjonsrike Indøk-arrangementer som
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
          ønsker, kan man gi styret beskjed på forhånd at man vil stille til valg, men det er også fullt mulig å
          kunngjøre at man stiller når vi ber kandidatene tre frem. Det er også åpent for benkeforslag fra salen. Om
          våren velges det ny president, nestleder, JanuScript-redaktør, websjef, hyttetursjef og kjellersjef, mens det
          på høsten er festsjef, eventsjef, PR-sjef og sekretær som velges.
        </Typography>
        <Typography variant="body1" paragraph>
          For hvert verv bes kandidatene holde en kort appell for forsamlingen der det redegjøres for motivasjon for
          vervet. Det er også lagt opp til at kandidaten legger inn et element der man på sin egen måte viser hvem man
          er. Deretter vil det åpnes for spørsmål fra salen. Nøl ikke med å ta kontakt dersom det er noe du lurer på:)
        </Typography>
        <Paper>
          <Box p={4} my={3}>
            <Typography variant="h3" textAlign="center">
              @janus_linjeforening
            </Typography>
          </Box>
        </Paper>

        <Typography variant="h3" gutterBottom>
          Janusstyret 2022/2023
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

        <Typography variant="h3" gutterBottom>
          Tidligere Janusstyrer
        </Typography>

        <Grid container spacing={2}>
          <Grid item xs={12} sm={8} md={4}>
            <Card>
              <StyledCardActionArea>
                <StyledCardMedia image="/img/janusstyret_bilder/janusstyret_21_22.JPG" />
                <div>
                  <Typography variant="body1" color="textPrimary">
                    Janusstyret 21/22
                  </Typography>
                </div>
              </StyledCardActionArea>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Card>
              <StyledCardActionArea>
                <StyledCardMedia image="/img/afterski.jpg" />
                <div>
                  <Typography variant="body1" color="textPrimary">
                    Janusstyret 20/21
                  </Typography>
                </div>
              </StyledCardActionArea>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Card>
              <StyledCardActionArea>
                <StyledCardMedia image="" />
                <div>
                  <Typography variant="body1" color="textPrimary">
                    Janusstyret 19/20
                  </Typography>
                </div>
              </StyledCardActionArea>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Card>
              <StyledCardActionArea>
                <StyledCardMedia image="" />
                <div>
                  <Typography variant="body1" color="textPrimary">
                    Janusstyret 18/19
                  </Typography>
                </div>
              </StyledCardActionArea>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Card>
              <StyledCardActionArea>
                <StyledCardMedia image="" />
                <div>
                  <Typography variant="body1" color="textPrimary">
                    Janusstyret 17/18
                  </Typography>
                </div>
              </StyledCardActionArea>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Card>
              <StyledCardActionArea>
                <StyledCardMedia image="" />
                <div>
                  <Typography variant="body1" color="textPrimary">
                    Janusstyret 16/17
                  </Typography>
                </div>
              </StyledCardActionArea>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Card>
              <StyledCardActionArea>
                <StyledCardMedia image="" />
                <div>
                  <Typography variant="body1" color="textPrimary">
                    Janusstyret 15/16
                  </Typography>
                </div>
              </StyledCardActionArea>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Card>
              <StyledCardActionArea>
                <StyledCardMedia image="" />
                <div>
                  <Typography variant="body1" color="textPrimary">
                    Janusstyret 14/15
                  </Typography>
                </div>
              </StyledCardActionArea>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Card>
              <StyledCardActionArea>
                <StyledCardMedia image="" />
                <div>
                  <Typography variant="body1" color="textPrimary">
                    Janusstyret 13/14
                  </Typography>
                </div>
              </StyledCardActionArea>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Card>
              <StyledCardActionArea>
                <StyledCardMedia image="" />
                <div>
                  <Typography variant="body1" color="textPrimary">
                    Janusstyret 12/13
                  </Typography>
                </div>
              </StyledCardActionArea>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Card>
              <StyledCardActionArea>
                <StyledCardMedia image="" />
                <div>
                  <Typography variant="body1" color="textPrimary">
                    Janusstyret 11/12
                  </Typography>
                </div>
              </StyledCardActionArea>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Card>
              <StyledCardActionArea>
                <StyledCardMedia image="" />
                <div>
                  <Typography variant="body1" color="textPrimary">
                    Janusstyret 10/11
                  </Typography>
                </div>
              </StyledCardActionArea>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Card>
              <StyledCardActionArea>
                <StyledCardMedia image="" />
                <div>
                  <Typography variant="body1" color="textPrimary">
                    Janusstyret 09/10
                  </Typography>
                </div>
              </StyledCardActionArea>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Card>
              <StyledCardActionArea>
                <StyledCardMedia image="" />
                <div>
                  <Typography variant="body1" color="textPrimary">
                    Janusstyret 08/09
                  </Typography>
                </div>
              </StyledCardActionArea>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Card>
              <StyledCardActionArea>
                <StyledCardMedia image="" />
                <div>
                  <Typography variant="body1" color="textPrimary">
                    Janusstyret 07/08
                  </Typography>
                </div>
              </StyledCardActionArea>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Card>
              <StyledCardActionArea>
                <StyledCardMedia image="" />
                <div>
                  <Typography variant="body1" color="textPrimary">
                    Janusstyret 06/07
                  </Typography>
                </div>
              </StyledCardActionArea>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Card>
              <StyledCardActionArea>
                <StyledCardMedia image="" />
                <div>
                  <Typography variant="body1" color="textPrimary">
                    Janusstyret 05/06
                  </Typography>
                </div>
              </StyledCardActionArea>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Card>
              <StyledCardActionArea>
                <StyledCardMedia image="" />
                <div>
                  <Typography variant="body1" color="textPrimary">
                    Janusstyret 04/05
                  </Typography>
                </div>
              </StyledCardActionArea>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Card>
              <StyledCardActionArea>
                <StyledCardMedia image="" />
                <div>
                  <Typography variant="body1" color="textPrimary">
                    Janusstyret 03/04
                  </Typography>
                </div>
              </StyledCardActionArea>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Card>
              <StyledCardActionArea>
                <StyledCardMedia image="" />
                <div>
                  <Typography variant="body1" color="textPrimary">
                    Janusstyret 02/03
                  </Typography>
                </div>
              </StyledCardActionArea>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Card>
              <StyledCardActionArea>
                <StyledCardMedia image="" />
                <div>
                  <Typography variant="body1" color="textPrimary">
                    Janusstyret 01/02
                  </Typography>
                </div>
              </StyledCardActionArea>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Card>
              <StyledCardActionArea>
                <StyledCardMedia image="" />
                <div>
                  <Typography variant="body1" color="textPrimary">
                    Janusstyret 00/01
                  </Typography>
                </div>
              </StyledCardActionArea>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Card>
              <StyledCardActionArea>
                <StyledCardMedia image="" />
                <div>
                  <Typography variant="body1" color="textPrimary">
                    Janusstyret 99/00
                  </Typography>
                </div>
              </StyledCardActionArea>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Card>
              <StyledCardActionArea>
                <StyledCardMedia image="" />
                <div>
                  <Typography variant="body1" color="textPrimary">
                    Janusstyret 98/99
                  </Typography>
                </div>
              </StyledCardActionArea>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Card>
              <StyledCardActionArea>
                <StyledCardMedia image="" />
                <div>
                  <Typography variant="body1" color="textPrimary">
                    Janusstyret 97/98
                  </Typography>
                </div>
              </StyledCardActionArea>
            </Card>
          </Grid>
        </Grid>
      </Template>
    </>
  );
  return (
    <>
      <Typography component="div" variant="body1" paragraph>
        <ul>
          <li> Oskar, Fannar, Mina</li>
        </ul>
      </Typography>
    </>
  );
};

AboutPage.getLayout = (page) => <Layout>{page}</Layout>;

export default AboutPage;
