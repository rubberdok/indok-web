import Logo from "@components/Logo";
import { Container, Divider, Grid, Link, Paper, Stack, styled, SxProps, Typography } from "@mui/material";
import rubberdokLogo from "@public/img/rubberdok_logo_black.svg";
import NextImage from "next/image";
import NextLink, { LinkProps } from "next/link";
import { ReactNode, useState } from "react";
import HallOfFame from "src/layouts/footer/HallOfFame";
import { useResponsive } from "../../hooks";

const Watermark = styled("div")(({ theme }) => ({
  background: "url('/nth.svg')",
  backgroundSize: 500,
  backgroundPosition: "right center",
  backgroundRepeat: "no-repeat",
  opacity: 0.1,
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

const Footer: React.FC = () => {
  const isDesktop = useResponsive("up", "md");
  const [open, setOpen] = useState(false);

  return (
    <>
      <Divider />
      <Paper sx={{ bgcolor: "background.neutral" }}>
        <Container sx={{ position: "relative", py: { xs: 8, md: 10 } }}>
          <Grid container spacing={3} justifyContent={{ md: "space-between" }}>
            <Grid item xs={12} md={3}>
              <Stack alignItems="flex-start" spacing={3}>
                <Logo />
                <Typography variant="body3" sx={{ color: "text.secondary" }}>
                  Foreningen for Studentene ved Industriell Økonomi og Teknologiledelse, NTNU Kolbjørn Hejes vei 1E,
                  7034 Trondheim Org.nr. 994 778 463
                </Typography>
              </Stack>
            </Grid>

            <Grid item xs={12} md={7}>
              <Stack alignItems="flex-start">
                <Typography variant="h6">Lenker</Typography>
                <NextLinkItem href="#">Baksida</NextLinkItem>
                <NextLinkItem href="#">Om oss</NextLinkItem>
                <NextLinkItem href="#">Studieside</NextLinkItem>
              </Stack>
            </Grid>
            {isDesktop && <Watermark />}
          </Grid>
        </Container>
      </Paper>

      <Divider />

      <Container>
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={2.5}
          justifyContent="space-between"
          alignItems="center"
          sx={{ py: 3, textAlign: "center" }}
        >
          <Typography variant="body3" sx={{ color: "text.secondary" }}>
            Kopirett © 2022 Foreningen for Studentene ved Indøk. Alle rettigheter reservert
          </Typography>
          <Stack direction="row" spacing={3} justifyContent="center" alignItems="center">
            <Link href="mailto:feedback@rubberdok.no" variant="body3" sx={{ color: "text.secondary" }}>
              Oppdaget feil ved nettsiden?
            </Link>
            <Link onClick={() => setOpen(!open)} variant="body3" sx={{ color: "text.secondary" }}>
              Hall of Fame
            </Link>
            <a href="https://github.com/rubberdok/indok-web" rel="noreferrer noopener" style={{ height: "100%" }}>
              <NextImage src={rubberdokLogo} alt="Rubberdøk logo" width="64px" height="32px" layout="fixed" />
            </a>
          </Stack>
        </Stack>
      </Container>
      <HallOfFame open={open} setOpen={setOpen} />
    </>
  );
};

interface NextLinkItemProps extends LinkProps {
  children: ReactNode;
  sx?: SxProps;
}

const NextLinkItem: React.FC<NextLinkItemProps> = ({ children, sx, ...other }) => {
  return (
    <NextLink passHref {...other}>
      <Link
        variant="body3"
        sx={{
          mt: 1,
          color: "text.secondary",
          "&:hover": {
            color: "text.primary",
          },
          ...sx,
        }}
      >
        {children}
      </Link>
    </NextLink>
  );
};

export default Footer;
