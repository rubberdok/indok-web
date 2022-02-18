import { useMutation } from "@apollo/client";
import Layout from "@components/Layout";
import ProfileSkeleton from "@components/pages/profile/ProfileSkeleton";
import { AUTHENTICATE } from "@graphql/users/mutations";
import { GET_USER_INFO } from "@graphql/users/queries";
import { User } from "@interfaces/users";
import { Button, Container, Grid, Typography, useTheme } from "@material-ui/core";
import { NextPage } from "next";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import Bug from "public/illustrations/Bug.svg";
import React, { useEffect } from "react";

type AuthUser = {
  user: User;
  idToken: string | null;
};

const AuthCallbackPage: NextPage = () => {
  const router = useRouter();
  const theme = useTheme();

  const { code, state } = router.query;
  const [authUser, { data, error }] = useMutation<{ authUser: AuthUser }>(AUTHENTICATE, {
    errorPolicy: "all",
    onCompleted: (data) => {
      if (data.authUser.user.firstLogin) {
        router.push("/register");
      } else if (state) {
        if (Array.isArray(state)) {
          router.push(state.join(""));
        } else {
          router.push(state);
        }
      } else {
        router.push("/profile");
      }
    },
    update(cache, { data }) {
      if (data?.authUser) {
        const { user } = data.authUser;
        cache.writeQuery({
          query: GET_USER_INFO,
          data: { user },
        });
      }
    },
  });
  useEffect(() => {
    if (code) authUser({ variables: { code } });
  }, [code, authUser]);

  const loadingProfile = !error && !data?.authUser?.user?.firstLogin && !state;

  return (
    <Layout>
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
              <Image src={Bug} />
            </Grid>
          </Grid>
        )}
      </Container>
    </Layout>
  );
};

export default AuthCallbackPage;
