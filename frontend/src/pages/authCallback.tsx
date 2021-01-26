import { useMutation } from "@apollo/client";
import Layout from "@components/Layout";
import { AUTHENTICATE } from "@graphql/auth/mutations";
import { GET_USER } from "@graphql/auth/queries";
import { User } from "@interfaces/users";
import { Button, Container, Typography } from "@material-ui/core";
import { NextPage } from "next";
import { useRouter } from "next/router";
import React, { useEffect } from "react";

const AuthCallbackPage: NextPage = () => {
  const router = useRouter();
  const { code, state } = router.query;

  if (state && state !== process.env.NEXT_PUBLIC_DATAPORTEN_STATE) {
    if (typeof window !== "undefined") {
      router.push("/");
      return null;
    }
  }

  const [authUser, { loading, data, error }] = useMutation<{ authUser: { user: User } }>(AUTHENTICATE, {
    errorPolicy: "all",
  });

  useEffect(() => {
    if (code) {
      authUser({
        variables: { code },
        update: (cache, { data }) => {
          if (!data || !data.authUser || !data.authUser.user) {
            return;
          }
          cache.writeQuery<User>({ query: GET_USER, data: data.authUser.user });
        },
      });
    }
  }, [code]);

  if (!loading && data?.authUser) {
    router.push("/profile");
    return null;
  }
  return (
    <Layout>
      <Container>
        <Typography variant="h2">Feide-innlogging</Typography>
        {error ? (
          <>
            <Typography variant="body1" color="error">
              {" "}
              FEIL: {error.message}
            </Typography>
            <Button variant="contained" href="/">
              Tilbake til hjemmesiden
            </Button>
          </>
        ) : data ? (
          <Typography variant="body1" color="primary">
            Logget inn som data.authUser.user.firstName{" "}
          </Typography>
        ) : (
          <Typography variant="body1">Logger deg inn...</Typography>
        )}
      </Container>
    </Layout>
  );
};

export default AuthCallbackPage;
