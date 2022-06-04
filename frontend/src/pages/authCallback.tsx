import { useMutation } from "@apollo/client";
import ProfileSkeleton from "@components/pages/profile/ProfileSkeleton";
import { AUTHENTICATE } from "@graphql/users/mutations";
import { User } from "@interfaces/users";
import { Button, Container, Grid, Typography, useTheme } from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import Bug from "public/illustrations/Bug.svg";
import React, { useEffect } from "react";
import Layout from "src/layouts";
import { NextPageWithLayout } from "./_app";

type AuthUser = {
  user: User;
  idToken: string | null;
};

const AuthCallbackPage: NextPageWithLayout = () => {
  const router = useRouter();
  const theme = useTheme();

  const { code, state } = router.query;
  const [authUser, { loading, error }] = useMutation<{ authUser: AuthUser }>(AUTHENTICATE, {
    errorPolicy: "all",
    onCompleted: ({ authUser: { user } }) => {
      if (user.firstLogin) {
        router.push("/register");
      } else if (typeof state === "string") {
        router.push(state);
      } else if (Array.isArray(state) && state.length > 0) {
        router.push(state[0]);
      } else {
        router.push("/profile");
      }
    },
  });

  useEffect(() => {
    if (code) authUser({ variables: { code } });
  }, [code, authUser]);

  const loadingProfile = !error && loading && !state;

  return (
    <Container>
      {loadingProfile && <ProfileSkeleton />}
      {error && (
        <Grid
          container
          direction="column"
          spacing={2}
          justifyContent="center"
          alignItems="center"
          style={{ marginTop: theme.spacing(4) }}
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
      )}
    </Container>
  );
};

AuthCallbackPage.getLayout = (page: React.ReactElement) => (
  <Layout simpleHeader simpleFooter>
    {page}
  </Layout>
);

export default AuthCallbackPage;
