import { Box, Container, Divider, Grid, Paper, Stack, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useState } from "react";

import { Link, LinkProps } from "@/components";
import { LogoFull } from "@/components/LogoFull";
import { Vercel } from "@/components/Vercel";
import dayjs from "@/lib/date";
import rubberdokLogo from "~/public/img/rubberdok_logo_black.svg";

// https://nextjs.org/docs/advanced-features/dynamic-import
const HallOfFame = dynamic(() => import("./HallOfFame").then((mod) => mod.HallOfFame));

const Watermark = styled("div")(({ theme }) => ({
  background: "url('/janus_new.svg')",
  backgroundSize: 320,
  backgroundPosition: "right center",
  backgroundRepeat: "no-repeat",
  opacity: 0.1,
  [theme.getColorSchemeSelector("dark")]: {
    opacity: 0.1,
    filter: "invert(1)",
  },
  position: "absolute",
  width: "600px",
  height: "100%",
  top: 0,
  right: 0,

  [theme.breakpoints.down("lg")]: {
    width: "100%",
    left: 0,
  },
}));

export const Footer: React.FC = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Divider sx={{ mt: 4 }} />
      <Paper sx={{ bgcolor: "background.elevated" }}>
        <Container sx={{ position: "relative", py: { xs: 6, md: 10 } }}>
          <Grid container spacing={3} justifyContent={{ md: "space-between" }}>
            <Grid item xs={12} md={3}>
              <Stack alignItems="flex-start" spacing={3}>
                <LogoFull />
                <Typography variant="caption">
                  Janus Linjeforening, NTNU Kolbjørn Hejes vei 1E, 7034 Trondheim Org.nr. 994 778 463
                </Typography>
                <Typography variant="caption">
                  {`Janus linjeforening ved Indøk © ${dayjs().format("YYYY")}`}
                </Typography>
              </Stack>
            </Grid>

            <Grid item xs={12} md={7}>
              <Stack alignItems="flex-start">
                <Typography variant="h6" component="p" mb={1}>
                  Lenker
                </Typography>
                <LinkItem href="/baksida">Baksida</LinkItem>
                <LinkItem href="https://drive.google.com/file/d/13bOYLhCvhgWReODUv1CN9E3TlenNvW44/view">
                  IØT adferdskodeks
                </LinkItem>
                <LinkItem href="/about">Om oss</LinkItem>
                <LinkItem href="https://www.indøk.no">Studieside</LinkItem>
                <LinkItem href="https://github.com/rubberdok/indok-web/issues/new/choose">Oppdaget en feil?</LinkItem>
                <Box mt={2}>
                  <Vercel />
                </Box>
              </Stack>
            </Grid>
            <Watermark sx={{ display: { xs: "none", md: "block" } }} />
          </Grid>
        </Container>
      </Paper>

      <Container>
        <Stack
          py={3}
          spacing={3}
          direction="row-reverse"
          justifyContent="space-between"
          alignItems="center"
          width="100%"
        >
          <Stack direction="row" spacing={3} alignItems="center" justifyContent="center">
            <LinkItem sx={{ mt: 0 }} onClick={() => setOpen(!open)} href="#">
              Hall of Fame
            </LinkItem>
            <Link
              href="https://github.com/rubberdok/indok-web"
              rel="noreferrer noopener"
              sx={(theme) => ({
                [theme.getColorSchemeSelector("dark")]: {
                  filter: "invert(1)",
                  opacity: 0.8,
                },
              })}
            >
              <Image
                src={rubberdokLogo}
                alt="Rubberdøk"
                style={{
                  width: "48px",
                  height: "24px",
                }}
              />
            </Link>
          </Stack>
        </Stack>
      </Container>
      {open && <HallOfFame open={open} setOpen={setOpen} />}
    </>
  );
};

const LinkItem: React.FC<LinkProps> = ({ sx, ...props }) => {
  return (
    <Link
      variant="caption"
      sx={{
        mt: 1,
        color: "text.secondary",
        "&:hover": {
          color: "text.primary",
        },
        ...sx,
      }}
      {...props}
    />
  );
};
