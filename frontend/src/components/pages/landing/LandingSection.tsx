import { Box, Button, Container, Stack, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import Image from "next/image";

import { Link } from "@/components";
import Hovedbygget from "~/public/static/landing/hovedbygget.webp";

export const LandingSection: React.FC = () => {
  const theme = useTheme();
  return (
    <Box
      data-color-scheme="dark"
      bgcolor="background.elevated"
      sx={{
        display: { xs: "block", md: "grid" },
        gridTemplateColumns: "repeat(2, 1fr)",
        position: "relative",
      }}
    >
      <Box
        sx={{
          position: "relative",
          gridColumn: "1/2",
          gridRow: "1",
          height: { xs: 250, md: "auto" },
        }}
      >
        <Image
          src={Hovedbygget}
          fill
          style={{ objectFit: "cover", objectPosition: "center" }}
          placeholder="blur"
          alt=""
          priority
          sizes={`
            (max-width: ${theme.breakpoints.values.xs}px) 100vw,
            50vw,
          `}
        />
      </Box>
      <Container
        sx={{
          gridColumn: "1 / -1",
          gridRow: "1",
          textAlign: { xs: "center", md: "left" },
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
        }}
      >
        <Box gridColumn={{ xs: "-1 / 1", md: "2 / -1" }}>
          <Stack
            direction="column"
            ml={{ xs: 0, md: 4 }}
            color="common.white"
            my={{ xs: 6, md: 12 }}
            alignItems={{ xs: "center", md: "flex-start" }}
            justifyContent="center"
          >
            <Typography variant="overline" sx={{ color: "grey.300" }}>
              Samarbeid og kommunikasjon
            </Typography>
            <Typography variant="h2">Hovedstyret i foreningen</Typography>
            <Typography maxWidth={450} textAlign="left" sx={{ mt: 3, mb: 5, opacity: 0.72 }}>
              Hovedstyrets fremste oppgave er å sørge for god kommunikasjon og samarbeid mellom de ulike
              studentinitiativene, og forvalte og disponere Indøks midler på en forsvarlig måte.
            </Typography>

            <Button component={Link} href="/about/board" noLinkStyle variant="contained" size="medium">
              Les mer
            </Button>
          </Stack>
        </Box>
      </Container>
    </Box>
  );
};
