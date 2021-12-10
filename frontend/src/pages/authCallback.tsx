import { useMutation } from "@apollo/client";
import Layout from "@components/Layout";
import { AUTHENTICATE } from "@graphql/users/mutations";
import { GET_USER } from "@graphql/users/queries";
import { User } from "@interfaces/users";
import { Button, Container, Typography } from "@material-ui/core";
import { config } from "@utils/config";
import { NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect } from "react";

type AuthUser = {
  user: User;
  idToken: string | null;
};

const AuthCallbackPage: NextPage = () => {
  const router = useRouter();

  const { code, state } = router.query;
  const [authUser, { loading, data, error }] = useMutation<{ authUser: AuthUser }>(AUTHENTICATE, {
    errorPolicy: "all",
    refetchQueries: [GET_USER],
  });

  useEffect(() => {
    if (code) authUser({ variables: { code } });
  }, [code, authUser]);

  if (state && state !== config.DATAPORTEN_STATE) {
    if (typeof window !== "undefined") {
      router.push("/");
      return null;
    }
  }

  if (!loading && data && data.authUser) {
    data.authUser.user.firstLogin ? router.push("/register") : router.push("/profile");
    return null;
  }

  return (
    <Layout>
      <Container>
        <Typography variant="h2">Feide-innlogging</Typography>
        {loading && <Typography variant="body1">Logger deg inn...</Typography>}
        {error && (
          <>
            <Typography variant="body1" color="error">
              FEIL: {error.message}
            </Typography>
            <Link passHref href="/">
              <Button variant="contained">Tilbake til hjemmesiden</Button>
            </Link>
          </>
        )}
      </Container>
    </Layout>
  );
};

export default AuthCallbackPage;
