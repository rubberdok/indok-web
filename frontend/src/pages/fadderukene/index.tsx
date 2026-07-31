import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Divider,
  List,
  ListItem,
  ListItemText,
  Stack,
  Typography,
} from "@mui/material";
import Image from "next/image";

import { Title } from "@/components/Title";
import { Layout } from "@/layouts/Layout";
import { NextPageWithLayout } from "@/lib/next";

type ProgramEvent = {
  time?: string;
  title: string;
  location: string;
};

type ProgramDay = {
  day: string;
  date: string;
  guidance: string;
  events: ProgramEvent[];
};

const programDays: ProgramDay[] = [
  //endre dette før ny fadderuke
  {
    day: "Mandag",
    date: "10. august",
    guidance:
      "Pyntet, men ikke dress (særlig relevant for guttene). Tenk sommerfest-antrekk. Til middag: antrekk som gjenspeiler forbokstav i fornavn.",
    events: [
      { time: "11:00", title: "Immatrikulering + omvisning med faddergrupper", location: "S6" },
      { time: "14:00", title: "Felles immatrikulering", location: "Frimerket" },
      { time: "18:00", title: "Middag med forbokstavtema", location: "Faddergrupper" },
    ],
  },
  {
    day: "Tirsdag",
    date: "11. august",
    guidance: "Hippie-klær.",
    events: [
      { time: "19:00", title: "Hippie-hunt", location: "Trondheim" },
      { time: "20:30", title: "Woodøk", location: "Samfundet" },
    ],
  },
  {
    day: "Onsdag",
    date: "12. august",
    guidance: "Oops, jeg kom feil + 'anything but a cup' (ta med alternativ drikkebeholder).",
    events: [
      { time: "17:30", title: "Vors", location: "Faddergrupper" },
      { time: "19:00", title: "Oops, jeg kom feil + anything but a cup", location: "JanHus" },
    ],
  },
  {
    day: "Torsdag",
    date: "13. august",
    guidance: "Badetøy til badstue og bading.",
    events: [
      { time: "TBA", title: "Intro bedpres med PwC + BL", location: "Kjelhuset" },
      { time: "19:00", title: "Badstue og bading", location: "Havet" },
    ],
  },
  {
    day: "Fredag",
    date: "14. august",
    guidance: "Ingen føringer.",
    events: [
      { time: "16:00", title: "Vors", location: "Faddergrupper" },
      { time: "17:00", title: "Leilighetsrunde", location: "Trondheim" },
    ],
  },
  {
    day: "Lørdag",
    date: "15. august",
    guidance: "Dobbeltlaken uten stretch er et pluss (til toga), samt sikkerhetsnåler.",
    events: [
      { time: "18:00", title: "Vors", location: "Faddergrupper" },
      { time: "20:00", title: "Togafest", location: "Samfundet" },
    ],
  },
  {
    day: "Søndag",
    date: "16. august",
    guidance: "Ingen føringer.",
    events: [
      { time: "11:00", title: "Infodag", location: "Kjel" },
      { time: "13:00", title: "Pause", location: "Kjel" },
      { time: "14:00", title: "Kulturdag", location: "Kjel" },
    ],
  },
  {
    day: "Mandag",
    date: "17. august",
    guidance: "Medisin / sykepleie / sykehus-tema.",
    events: [
      { time: "17:00", title: "Vors – medisintema", location: "Faddergrupper" },
      { time: "20:00", title: "Janus x Placebo", location: "The King" },
    ],
  },
  {
    day: "Tirsdag",
    date: "18. august",
    guidance: "Ingen føringer.",
    events: [{ time: "19:00", title: "Spillkveld og middag", location: "Faddergrupper" }],
  },
  {
    day: "Onsdag",
    date: "19. august",
    guidance: "Treningstøy.",
    events: [
      { time: "17:00", title: "OL", location: "Duedalen" },
      { time: "19:00", title: "ØL", location: "Duedalen" },
      { time: "21:00", title: "Etterfest", location: "JanHus" },
    ],
  },
  {
    day: "Torsdag",
    date: "20. august",
    guidance: "Ingen føringer.",
    events: [
      { time: "16:00", title: "BCG showkamp", location: "Dødens dal" },
      { time: "18:00", title: "Quiz og grilling", location: "Høyskoleparken" },
    ],
  },
  {
    day: "Fredag",
    date: "21. august",
    guidance: "Ingen føringer.",
    events: [
      { time: "16:00", title: "Vors", location: "Faddergrupper" },
      { time: "18:00", title: "Janusvalg", location: "R1" },
    ],
  },
  {
    day: "Lørdag",
    date: "22. august",
    guidance: "Fargetema (TBA).",
    events: [
      { time: "18:00", title: "Vors med fargetema", location: "Faddergrupper x Mannhullet" },
      { time: "21:00", title: "Silent Disco", location: "Havet (med andre linjer)" },
    ],
  },
  {
    day: "Søndag",
    date: "23. august",
    guidance: "Ingen føringer.",
    events: [{ title: "Hviledag", location: "Ta det rolig og lad opp" }],
  },
];

const packingList: string[] = [
  "Hippie-klær (til hippie-hunt)",
  "Anything but a cup (alt som holder væske, men ikke et glass)",
  "Badetøy (til badstue og bading på Havet)",
  "Laken til toga (kjøp tidlig, de blir fort utsolgt!)",
  "Legekostyme eller annet medisintema",
  "Treningstøy (til OL og showkamp)",
  "Monokromt antrekk (én farge fra topp til tå)",
];

const PROGRAM_IMAGE_URL = "/static/fadderukene/2026/Fadderuker%202026.PNG"; //enders før nytt år

const FadderukenePage: NextPageWithLayout = () => {
  return (
    <>
      <Title variant="normal" sx={{ textAlign: "center", py: 5 }}>
        <Typography
          variant="h1"
          component="h1"
          sx={{
            fontSize: { xs: "2.5rem", sm: "3.5rem", md: "4rem" },
            lineHeight: 1.1,
            overflowWrap: "anywhere",
          }}
        >
          Fadderukene
        </Typography>
      </Title>

      <Container maxWidth="lg" sx={{ pb: 10 }}>
        <Stack spacing={{ xs: 3, md: 4 }}>
          <Card sx={{ height: "100%" }}>
            <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
              <Typography variant="h5" gutterBottom sx={{ textAlign: { xs: "center", md: "left" } }}>
                Velkommen til fadderukene på INDØK! 🎉
              </Typography>
              <Typography variant="body1" sx={{ mb: 2, textAlign: { xs: "center", md: "left" } }}>
                Vi i Janus linjeforening gleder oss stort til å møte dere og ta dere med på opplegget vi har laget for
                dere. Her er litt praktisk informasjon om fadderukene som kan være nyttig å vite før avreise.
              </Typography>
              <Typography variant="body1" sx={{ textAlign: { xs: "center", md: "left" } }}>
                Verdt å tenke på: noen dager har temaer og opplegg som kan kreve litt ekstra bagasjeplass eller
                idémyldring.
              </Typography>

              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={2}
                sx={{ mt: 3 }}
                alignItems={{ xs: "stretch", sm: "flex-start" }}
              >
                <Button
                  component="a"
                  href="https://www.ntnu.no/studier/mtiot/studiestart"
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="contained"
                  sx={{ width: { xs: "100%", sm: "auto" }, textAlign: "center" }}
                >
                  Informasjon fra NTNU om studiestart
                </Button>
                <Button
                  component="a"
                  href="https://www.instagram.com/janus_linjeforening/"
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="contained"
                  sx={{ width: { xs: "100%", sm: "auto" }, textAlign: "center" }}
                >
                  Følg @janus_linjeforening på Instagram
                </Button>
              </Stack>
            </CardContent>
          </Card>

          <Box
            sx={{
              display: "grid",
              gap: 3,
              gridTemplateColumns: { xs: "1fr", md: "minmax(0, 7fr) minmax(0, 5fr)" },
              alignItems: "stretch",
            }}
          >
            <Card sx={{ height: "100%" }}>
              <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
                <Typography variant="h5" gutterBottom sx={{ textAlign: { xs: "center", md: "left" } }}>
                  Programmet
                </Typography>

                <Box
                  sx={{
                    textAlign: "center",
                    borderRadius: 2,
                    overflow: "hidden",
                    border: "1px solid",
                    borderColor: "divider",
                  }}
                >
                  <Image
                    src={PROGRAM_IMAGE_URL}
                    alt="Fadderukene program"
                    style={{ maxWidth: "100%", height: "auto", display: "block" }}
                    width={1200}
                    height={900}
                  />
                </Box>

                <Stack
                  direction={{ xs: "column", sm: "row" }}
                  spacing={1.5}
                  sx={{ mt: 2 }}
                  alignItems={{ xs: "stretch", sm: "flex-start" }}
                >
                  <Button
                    component="a"
                    href={PROGRAM_IMAGE_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    variant="contained"
                    sx={{ width: { xs: "100%", sm: "auto" }, textAlign: "center" }}
                  >
                    Åpne programmet i ny fane
                  </Button>
                  <Button
                    component="a"
                    href={PROGRAM_IMAGE_URL}
                    download
                    variant="contained"
                    sx={{ width: { xs: "100%", sm: "auto" }, textAlign: "center" }}
                  >
                    Last ned programmet
                  </Button>
                </Stack>
              </CardContent>
            </Card>

            <Card sx={{ height: "100%" }}>
              <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
                <Typography variant="h5" gutterBottom sx={{ textAlign: { xs: "center", md: "left" } }}>
                  Pakkeliste
                </Typography>
                <List dense sx={{ pt: 0 }}>
                  {packingList.map((item) => (
                    <ListItem key={item} disableGutters>
                      <ListItemText primary={`• ${item}`} />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Box>

          <Box>
            <Typography variant="h4" sx={{ mb: 2, textAlign: { xs: "center", md: "left" } }}>
              Dag for dag program
            </Typography>

            <Box
              sx={{
                display: "grid",
                gap: 2,
                gridTemplateColumns: {
                  xs: "1fr",
                  md: "repeat(2, minmax(0, 1fr))",
                  lg: "repeat(3, minmax(0, 1fr))",
                },
              }}
            >
              {programDays.map((day) => (
                <Card key={`${day.day}-${day.date}`} sx={{ height: "100%" }}>
                  <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
                    <Typography variant="h6">
                      {day.day} {day.date}
                    </Typography>

                    <Typography variant="body2" sx={{ mt: 1, opacity: 0.85 }}>
                      {day.guidance}
                    </Typography>

                    <Divider sx={{ my: 1.5 }} />

                    <List dense disablePadding>
                      {day.events.map((event, index) => (
                        <ListItem key={`${day.day}-${day.date}-${event.title}-${index}`} disableGutters>
                          <ListItemText
                            primary={event.time ? `${event.time} · ${event.title}` : event.title}
                            secondary={event.location}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </CardContent>
                </Card>
              ))}
            </Box>
          </Box>
        </Stack>
      </Container>
    </>
  );
};

FadderukenePage.getLayout = (page) => <Layout>{page}</Layout>;

export default FadderukenePage;
