import { Button, Container, Grid, Typography } from "@mui/material";
import Head from "next/head";
import Image from "next/image";

import { Link } from "@/components";
import { Layout } from "@/layouts/Layout";
import { NextPageWithLayout } from "@/lib/next";
import _404 from "~/public/illustrations/404.svg";

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
            <Button component={Link} href="/" noLinkStyle>
              Tilbake til hjemmesiden
            </Button>
          </Grid>
          <Grid container item direction="row" justifyContent="center" alignItems="center">
            <Grid item xs={8} sm={5}>
              <Image
                src={_404}
                alt="404, fant ikke siden."
                style={{ objectFit: "contain", objectPosition: "center", width: "100%", height: "100%" }}
              />
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
