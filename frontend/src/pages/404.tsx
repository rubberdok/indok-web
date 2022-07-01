import Layout from "@layouts/Layout";
import { Box, Button, Container, Grid, Typography } from "@mui/material";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import _404 from "public/illustrations/404.svg";
import { NextPageWithLayout } from "./_app";

const Custom404: NextPageWithLayout = () => {
  return (
    <>
      <Head>
        <title>404, fant ikke siden | Forening for Industriell Økonomi og Teknologiledelse</title>
      </Head>
      <Container>
        <Grid
          container
          direction="column"
          spacing={4}
          sx={{ mt: (theme) => theme.spacing(4), mb: (theme) => theme.spacing(4) }}
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
          <Grid container item direction="row" justifyContent="center" alignItems="center">
            <Grid item xs={8} sm={5}>
              <Box
                sx={{ overflow: "hidden", borderRadius: "50%", width: "100%", aspectRatio: "1", position: "relative" }}
              >
                <Image
                  src={_404}
                  alt="404, fant ikke siden."
                  layout="fill"
                  objectFit="contain"
                  objectPosition="center"
                />
              </Box>
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

Custom404.getLayout = (page) => (
  <Layout simpleHeader simpleFooter>
    {page}
  </Layout>
);

export default Custom404;
