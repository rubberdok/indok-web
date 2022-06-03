import { Box, Button, Container, Grid, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import Image from "next/image";
import NextLink from "next/link";

const RootStyle = styled("div")(({ theme }) => ({
  position: "relative",
  display: "flex",
  [theme.breakpoints.down("md")]: {
    padding: theme.spacing(8, 0),
  },
}));

const facilitiesData = [
  {
    icon: <Image alt="" src="/img/undraw_home.svg" width={100} height={100} />,
    text: "Varmekabler",
  },
  {
    icon: <Image alt="" src="/img/undraw_electricity.svg" width={100} height={100} />,
    text: "Innlagt strøm",
  },
  {
    icon: <Image alt="" src="/img/undraw_speaker.svg" width={100} height={100} />,
    text: "Høyttaleranlegg",
  },
  {
    icon: <Image alt="" src="/img/undraw_bed.svg" width={100} height={100} />,
    text: "18 soveplasser",
  },
  {
    icon: <Image alt="" src="/img/undraw_cooking.svg" width={100} height={100} />,
    text: "Kjøkken",
  },
  {
    icon: <Image alt="" src="/img/undraw_cabin.svg" width={100} height={100} />,
    text: "Badstue",
  },
];

const CabinsInfoSection: React.FC = () => {
  return (
    <RootStyle>
      <Container>
        <Grid container justifyContent="space-between" alignItems="center">
          <Grid item xs={12} md={6} lg={5}>
            <Grid container spacing={4} justifyContent="center">
              {facilitiesData.map((facility) => (
                <Grid item md={4} sm={6} xs={6} key={facility.text}>
                  <Box textAlign="center">
                    {facility.icon}
                    <Typography variant="body2">{facility.text}</Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Grid>
          <Grid
            item
            xs={12}
            md={6}
            lg={5}
            sx={{
              textAlign: { xs: "center", md: "left" },
              my: { xs: 0, md: 10 },
              mt: 10,
            }}
          >
            <Typography variant="overline" sx={{ color: "primary.main", mb: 2, display: "block" }}>
              Foreningens hytter
            </Typography>
            <Typography variant="h2">Indøkhyttene - Oksen og Bjørnen</Typography>
            <Typography sx={{ mt: 3, mb: 5, opacity: 0.72 }}>
              De to identiske nabohyttene ligger idyllisk til, kun et steinkast unna Stølen alpinsenter i Oppdal.
              Hyttene har flere bruksområder; alt fra strategiske samlinger og egne arrangementer til sosiale, spontane
              venneturer. Det er en gyllen mulighet til å få en liten pause fra det travle bylivet. Indøks egne
              Hytteturstyre arrangerer flere forskjellige turer i løpet av året. Dette er en flott mulighet til både å
              bli kjent med hyttene, området rundt hyttene, og å bli kjent med andre indøkere på tvers av
              klassetrinnene. <NextLink href="/about/organizations/hyttestyret"> Hytteforeningen</NextLink>
              har det daglige ansvaret for drift og vedlikehold av Indøkhyttene og organisering av utleie.
            </Typography>
            <NextLink href="/about/organizations/hyttestyret" passHref>
              <Button variant="contained" size="large">
                Les om Hyttestyret
              </Button>
            </NextLink>
          </Grid>
        </Grid>
      </Container>
    </RootStyle>
  );
};

export default CabinsInfoSection;
