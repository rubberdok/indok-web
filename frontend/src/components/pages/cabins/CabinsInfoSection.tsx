import { Box, Container, Grid, Typography } from "@mui/material";
import Image from "next/image";
import BookNow from "./BookNow";

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
    <Container>
      <Grid container direction="row-reverse" justifyContent="space-between" alignItems="stretch" spacing={8} mb={4}>
        <Grid container item xs={12} md={6}>
          <Grid item xs={12}>
            <BookNow />
          </Grid>
        </Grid>
        <Grid
          item
          container
          xs={12}
          md={6}
          sx={{
            textAlign: "left",
          }}
          direction="column"
        >
          <Grid container spacing={4} justifyContent="space-between">
            {facilitiesData.map((facility) => (
              <Grid item md={4} sm={4} xs={6} key={facility.text}>
                <Box textAlign="center">
                  {facility.icon}
                  <Typography variant="body2">{facility.text}</Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
};

export default CabinsInfoSection;
