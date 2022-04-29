import Layout from "@components/Layout";
import { Button, Container, Grid, Typography, useTheme } from "@mui/material";
import { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import _404 from "public/illustrations/404.svg";

const Custom404: NextPage = () => {
  const theme = useTheme();
  return (
    <Layout>
      <Head>
        <title>404, fant ikke siden | Forening for Industriell Økonomi og Teknologiledelse</title>
      </Head>
      <Container>
        <Grid
          container
          direction="column"
          spacing={4}
          style={{ marginTop: theme.spacing(4), marginBottom: theme.spacing(4) }}
          justifyContent="center"
          alignItems="center"
        >
          <Grid item md={6} xs={10}>
            <Typography variant="h2" component="h1">
              Her var det tomt...
            </Typography>
          </Grid>
          <Grid item md={6} xs={10}>
            <Link href="/" passHref>
              <Button>Tilbake til hjemmesiden</Button>
            </Link>
          </Grid>
          <Grid item md={6} xs={10}>
            <Image src={_404} />
          </Grid>
        </Grid>
      </Container>
    </Layout>
  );
};

export default Custom404;
