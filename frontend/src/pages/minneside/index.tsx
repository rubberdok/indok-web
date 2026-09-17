import { Box, Container, Divider, Link, Stack, Typography } from "@mui/material";
import Head from "next/head";
import Image from "next/image";

import { Layout, RootStyle } from "@/layouts/Layout";
import { NextPageWithLayout } from "@/lib/next";
import Bilde from "~/public/img/timtorvatn.jpg";

const ReportsPage: NextPageWithLayout = () => {
  return (
    <>
      <Head>
        <title>Til minne | Indøk NTNU</title>
        <meta name="description" content="En minneside for Tim Torvatn" />
      </Head>
      <Box
        sx={{
          backgroundColor: "background.default",
          minHeight: "calc(100vh - 64px)",
          py: { xs: 4, md: 8 },
        }}
      >
        <Container maxWidth="md">
          <Stack spacing={{ xs: 4, md: 6 }}>
            <Box sx={{ textAlign: "center" }}>
              <Typography variant="overline" color="text.secondary">
                Til minne
              </Typography>
              <Typography variant="h2" component="h1" sx={{ mt: 1 }}>
                Tim Kristian Andreas Torvatn
              </Typography>
              <Typography variant="h5" component="p" color="text.secondary" sx={{ mt: 2 }}>
                UNDERTITTEL
              </Typography>
            </Box>

            <Box
              sx={{
                position: "relative",
                width: "100%",
                paddingTop: "100%", // 1:1 aspect ratio
                borderRadius: 10,
                overflow: "hidden",
                boxShadow: 3,
                backgroundColor: "background.paper",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Image src={Bilde} alt="Tim Torvatn" objectFit="cover" layout="fill" />
            </Box>

            <Stack spacing={3}>
              <Typography variant="body1" sx={{ fontSize: "1.1rem", lineHeight: 1.8 }}>
                Denne minnesiden er under utarbeidelse. Vi ønsker å fylle den med ord og minner fra menneskene som
                kjente Tim, og med en beskrivelse av betydningen han hadde for instituttet og studentmiljøet.
              </Typography>
              <Divider />
              <Typography variant="body1" sx={{ fontSize: "1.1rem", lineHeight: 1.8 }}>
                Tim har vært en sentral skikkelse på Indøk over mange år - både som underviser og som ansvarlig
                for våre studieprogram og undervisningsaktiviteter. Det er liten tvil om at IndØk er et program som har
                ligget Tims hjerte nært, og vi høster alle frukter av det utrettelige arbeidet som Tim har lagt ned i å
                utvikle IndØk til det det er i dag. Vi kommer til å savne ham dypt og er evig takknemlig.
              </Typography>
              <Box sx={{ borderLeft: 3, borderColor: "divider", pl: 3, py: 1 }}>
                <Typography variant="body1" color="text.secondary" sx={{ fontStyle: "italic", lineHeight: 1.8 }}>
                  Noen mennesker setter spor som lever videre i fellesskapet.
                </Typography>
              </Box>
              <Typography variant="body1" sx={{ fontSize: "1.1rem", lineHeight: 1.8 }} fontWeight="bold">
                Trenger du noen å snakke med?
              </Typography>
              <Typography variant="body1" sx={{ fontSize: "1.1rem", lineHeight: 1.8 }}>
                Kontakt{" "}
                <Link
                  href="https://i.ntnu.no/wiki/-/wiki/Norsk/livssynstjenester+p%C3%A5+campus"
                  rel="noreferrer"
                  target="_blank"
                >
                  livssynstjenester
                </Link>{" "}
                på campus eller{" "}
                <Link href="https://www.sit.no/helse" rel="noreferrer" target="_blank">
                  Sits helsetjeneste
                </Link>{" "}
                i Trondheim. Instituttets studenttillitsvalgte (ITV-er) kan også kontaktes på{" "}
                <Link href="mailto:itv@iot.ntnu.no">itv@iot.ntnu.no</Link>.
              </Typography>
            </Stack>
          </Stack>
        </Container>
      </Box>
    </>
  );
};

export default ReportsPage;

ReportsPage.getLayout = (page) => (
  <Layout>
    <RootStyle>{page}</RootStyle>
  </Layout>
);
