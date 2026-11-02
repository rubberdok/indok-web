import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { Box, Button, Container, Typography } from "@mui/material";
import Image from "next/image";

import { NextLinkComposed } from "@/app/components/Link";
import TimPortrett from "~/public/img/timtorvatn/timtorvatn.jpg";

export const LandingMinneside: React.FC = () => {
  return (
    <Box
      component="section"
      aria-labelledby="landing-minneside-title"
      sx={{
        borderTop: 1,
        borderBottom: 1,
        borderColor: "divider",
        backgroundColor: "action.hover",
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "minmax(0, 1fr) minmax(0, 1.15fr)" },
            alignItems: "center",
            gap: { xs: 3, md: 7 },
            py: { xs: 4, md: 7 },
          }}
        >
          <Box
            component="figure"
            sx={{
              m: 0,
              width: "100%",
              maxWidth: { xs: 260, md: 360 },
              mx: "auto",
              overflow: "hidden",
              borderRadius: 1,
              boxShadow: 2,
            }}
          >
            <Image
              src={TimPortrett}
              alt="Portrett av Tim Torvatn"
              width={TimPortrett.width}
              height={TimPortrett.height}
              style={{ display: "block", width: "100%", height: "auto" }}
            />
          </Box>
          <Box sx={{ maxWidth: 620, textAlign: { xs: "center", md: "left" }, mx: { xs: "auto", md: 0 } }}>
            <Typography variant="overline" color="text.secondary" sx={{ letterSpacing: "0.12em" }}>
              Til minne
            </Typography>
            <Typography id="landing-minneside-title" variant="h4" component="h2" sx={{ mt: 0.5, mb: 2 }}>
              Tim Kristian Andreas Torvatn
            </Typography>
            <Typography
              color="text.secondary"
              sx={{ maxWidth: 560, mx: { xs: "auto", md: 0 }, mb: 3, lineHeight: 1.8 }}
            >
              09.11.1965 - 13.09.2026
            </Typography>
            <Button component={NextLinkComposed} to="/minneside" variant="contained" endIcon={<ArrowForwardIcon />}>
              Les minnesiden
            </Button>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};
