import { Box, Button, Container, Stack, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import Image from "next/image";

import { Link } from "@/components";
import Hovedbygget from "~/public/static/landing/hovedbygget.webp";

export const LandingSection: React.FC = () => {
  const theme = useTheme();
  return (
    <Box
      sx={{
        bgcolor: "grey.900",
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
        sx={{ alignSelf: "center", gridColumn: "2 / -1", gridRow: "1", textAlign: { xs: "center", md: "left" } }}
      >
        <Stack
          direction="column"
          alignItems={{ xs: "center", md: "flex-start" }}
          justifyContent="center"
          sx={{ color: "common.white", py: { xs: 6, md: 12 }, pl: { xs: 0, md: 3 } }}
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
      </Container>
    </Box>
  );
};
