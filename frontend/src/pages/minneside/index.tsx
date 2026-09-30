import { Box, Container, Divider, Link, Stack, Typography } from "@mui/material";
import Head from "next/head";
import Image from "next/image";
import Script from "next/script";

import { Layout, RootStyle } from "@/layouts/Layout";
import { NextPageWithLayout } from "@/lib/next";
import MaccuPiccuBilde from "~/public/img/timtorvatn/maccupiccutim.jpg";
import BunadBilde from "~/public/img/timtorvatn/tim17mai.jpg";
import PortrettBilde from "~/public/img/timtorvatn/timhalvfigur.jpg";

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
          py: { xs: 4, md: 9 },
        }}
      >
        <Container maxWidth="sm">
          <Stack spacing={{ xs: 4, md: 5 }}>
            <Box sx={{ textAlign: "center", px: { xs: 1, sm: 3 } }}>
              <Typography variant="overline" color="text.secondary" sx={{ letterSpacing: "0.12em" }}>
                Til minne
              </Typography>
              <Typography variant="h3" component="h1" sx={{ mt: 1, fontWeight: 600 }}>
                Tim Kristian Andreas Torvatn
              </Typography>
            </Box>

            <Box
              sx={{
                width: "min(100%, 560px)",
                mx: "auto",
                borderRadius: 2,
                overflow: "hidden",
                boxShadow: 3,
                backgroundColor: "background.paper",
              }}
            >
              <Image
                src={PortrettBilde}
                alt="Tim Torvatn"
                width={PortrettBilde.width}
                height={PortrettBilde.height}
                priority
                style={{ display: "block", width: "100%", height: "auto" }}
              />
            </Box>

            <Stack spacing={{ xs: 2.5, md: 3 }} sx={{ maxWidth: 680, mx: "auto", width: "100%" }}>
              <Divider />
              <Typography variant="body1" sx={{ fontSize: "1.08rem", lineHeight: 1.85 }}>
                Tim Torvatn var en merittert underviser, høyt respektert forsker og kjær kollega ved Institutt for
                industriell økonomi og teknologiledelse ved NTNU.
              </Typography>
              <Typography variant="body1" sx={{ fontSize: "1.08rem", lineHeight: 1.85 }}>
                Som student på et av de aller første indøkkullene var Tim en sentral skikkelse i utviklingen av Indøk,
                fra de første årene og frem til det Indøk er i dag.
              </Typography>
              <Typography variant="body1" sx={{ fontSize: "1.08rem", lineHeight: 1.85 }}>
                For mange indøkere var Tim en av de første personene de møtte på studiet. Han var medarrangør av
                Teknostart i en årrekke, og ansvarlig for den årlige Stiklestadturen. Tim var særlig flink til å skape
                gode rammer for trygge og hyggelige sosiale miljøer allerede fra starten av for de nye indøkkullene,
                blant annet gjennom den velkjente «Amøbeleken» under Stiklestadturen.
              </Typography>
              <Box
                sx={{
                  width: "100%",
                  borderRadius: 2,
                  overflow: "hidden",
                }}
              >
                <Image
                  src={BunadBilde}
                  alt="Tim Torvatn med kone i bunad på 17. mai"
                  width={BunadBilde.width}
                  height={BunadBilde.height}
                  style={{ display: "block", width: "100%", height: "auto" }}
                />
              </Box>
              <Typography variant="body1" sx={{ fontSize: "1.08rem", lineHeight: 1.85 }}>
                I 2024 var han også gjest i Indøks tidligere podcast «Typisk Indøk», og var en gjenganger i Indøkrevyen.
                I tillegg hadde Indøks Veldedige Initiativ (IVI) en årlig pakke hvor middag og aktivitet med Tim var
                premien, en pakke som alltid gikk for en høy pris.
              </Typography>
              <Box
                sx={{
                  width: "100%",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 1.5,
                }}
              >
                <Box
                  component="blockquote"
                  className="instagram-media"
                  data-instgrm-permalink="https://www.instagram.com/p/CzmCDcxCt2Z/"
                  data-instgrm-version="14"
                  sx={{
                    width: "100%",
                    maxWidth: 540,
                    minWidth: 0,
                    my: 0,
                    mx: "auto",
                    border: 0,
                    borderRadius: 1,
                    boxShadow: "0 1px 8px rgba(0, 0, 0, 0.12)",
                    overflow: "hidden",
                  }}
                >
                  <Link
                    href="https://www.instagram.com/p/CzmCDcxCt2Z/"
                    target="_blank"
                    rel="noreferrer"
                    sx={{ display: "block", p: 2, textAlign: "center" }}
                  >
                    Se innlegget fra Typisk Indøk på Instagram
                  </Link>
                </Box>
                <Script src="https://www.instagram.com/embed.js" strategy="lazyOnload" />
              </Box>
              <Typography variant="body1" sx={{ fontSize: "1.08rem", lineHeight: 1.85 }}>
                Tim var en høyt anerkjent underviser blant indøkstudentene, og vant flere ganger instituttets
                undervisningspris. Han var dyktig til å utvikle og prøve ut nye undervisningsmetoder i fagene sine, til
                studentenes glede og med økt læringsutbytte. Samtidig var han alltid raus med studentene, og tok seg tid
                til å møte dem med interesse og engasjement, også utenfor undervisningssituasjonen.
              </Typography>
              <Box
                sx={{
                  width: "100%",
                  borderRadius: 2,
                  overflow: "hidden",
                }}
              >
                <Image
                  src={MaccuPiccuBilde}
                  alt="Tim Torvatn ved Machu Picchu"
                  width={MaccuPiccuBilde.width}
                  height={MaccuPiccuBilde.height}
                  style={{ display: "block", width: "100%", height: "auto" }}
                />
              </Box>
              <Typography variant="body1" sx={{ fontSize: "1.08rem", lineHeight: 1.85 }}>
                Som person var Tim glad i skuespill, brettspill og ikke minst reising. Han drev selv med skuespill i en
                lang årrekke, hadde én av Norges største brettspillsamlinger, og var på alle verdens kontinenter gjennom
                livet sitt, flere av dem mer enn én gang.
              </Typography>
              <Typography variant="body1" sx={{ fontSize: "1.08rem", lineHeight: 1.85 }}>
                For mange var Tim selve personifikasjonen av Indøk: nysgjerrig, ambisiøs og raus i alt han gjorde.
              </Typography>
              <Typography variant="body1" sx={{ fontSize: "1.08rem", lineHeight: 1.85 }}>
                Tim vil bli dypt savnet av studentene i Janus Linjeforening, så vel som av en hel generasjon alumni,
                forskere og øvrige ansatte ved NTNU.
              </Typography>
              <Typography variant="h6" component="h2" sx={{ mt: 1 }}>
                Trenger du noen å snakke med?
              </Typography>
              <Typography variant="body1" sx={{ fontSize: "1.08rem", lineHeight: 1.85 }}>
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
