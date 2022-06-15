import { useMutation } from "@apollo/client";
import { AuthUserDocument } from "@generated/graphql";
import Layout from "@layouts/Layout";
import { Button, CircularProgress, Container, Grid, Stack, Typography } from "@mui/material";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import Bug from "public/illustrations/Bug.svg";
import React, { useEffect } from "react";
import { NextPageWithLayout } from "./_app";

const AuthCallbackPage: NextPageWithLayout<InferGetServerSidePropsType<typeof getServerSideProps>> = ({
  code,
  state,
}) => {
  const router = useRouter();

  const [authUser, { error }] = useMutation(AuthUserDocument, {
    errorPolicy: "none",
    onCompleted: ({ authUser }) => {
      if (authUser) {
        const { user } = authUser;
        if (user.firstLogin) {
          router.replace("/register");
        } else if (typeof state === "string") {
          router.replace(state);
        } else if (Array.isArray(state) && state.length > 0) {
          router.replace(state[0]);
        } else {
          router.replace("/profile");
        }
      }
    },
  });

  useEffect(() => {
    authUser({ variables: { code } });
  }, []);

  if (error) {
    return (
      <Container>
        <Grid
          container
          direction="column"
          spacing={2}
          justifyContent="center"
          alignItems="center"
          sx={{ mt: (theme) => theme.spacing(4) }}
        >
          <Grid item md={6}>
            <Typography variant="h2" component="h1">
              Uff da
            </Typography>
          </Grid>
          <Grid item md={6}>
            <Typography>Her var det noe som gikk galt...</Typography>
          </Grid>
          <Grid>
            <Link passHref href="/">
              <Button variant="text">Tilbake til hjemmesiden</Button>
            </Link>
          </Grid>
          <Grid item md={6}>
            <Image src={Bug} alt="" />
          </Grid>
        </Grid>
      </Container>
    );
  }
  return (
    <Container sx={{ height: "100%" }}>
      <Stack justifyContent="center" alignItems="center" height="100%" spacing={4}>
        <Typography variant="subtitle1">Logger deg inn...</Typography>
        <CircularProgress />
      </Stack>
    </Container>
  );
};

AuthCallbackPage.getLayout = (page: React.ReactElement) => (
  <Layout simpleHeader simpleFooter>
    {page}
  </Layout>
);

export const getServerSideProps: GetServerSideProps<{ code: string; state?: string | string[] }> = async (ctx) => {
  const { code, state } = ctx.query;
  if (typeof code !== "string") {
    return { notFound: true };
  }

  if (typeof state === "undefined") {
    return {
      props: {
        code,
      },
    };
  }

  return {
    props: {
      code,
      state,
    },
  };
};

export default AuthCallbackPage;
