import { useMutation } from "@apollo/client";
import Layout from "@components/Layout";
import ProfileSkeleton from "@components/pages/profile/skeleton";
import { AUTHENTICATE } from "@graphql/users/mutations";
import { GET_USER } from "@graphql/users/queries";
import { User } from "@interfaces/users";
import { Button, Container, Grid, Typography, useTheme } from "@material-ui/core";
import { config } from "@utils/config";
import { NextPage } from "next";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import Bug from "public/illustrations/Bug.svg";

type AuthUser = {
  user: User;
  idToken: string | null;
};

const AuthCallbackPage: NextPage = () => {
  const router = useRouter();
  const theme = useTheme();

  const { code, state } = router.query;
  const [authUser, { loading, data, error }] = useMutation<{ authUser: AuthUser }>(AUTHENTICATE, {
    errorPolicy: "all",
    refetchQueries: [GET_USER],
  });

  useEffect(() => {
    if (code) authUser({ variables: { code } });
    else router.push("/profile");
  }, [code, authUser, router]);

  if (state && state !== config.DATAPORTEN_STATE) {
    if (typeof window !== "undefined") {
      router.push("/");
      return null;
    }
  }

  if (!loading && data && data.authUser) {
    data.authUser.user.firstLogin ? router.push("/register") : router.push("/profile");
  }

  return (
    <Layout>
      <Container>
        <ProfileSkeleton />
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
              <Image src={Bug} />
            </Grid>
          </Grid>
        )}
      </Container>
    </Layout>
  );
};

export default AuthCallbackPage;
