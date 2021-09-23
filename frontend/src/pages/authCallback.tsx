import { useMutation } from "@apollo/client";
import Layout from "@components/Layout";
import { AUTHENTICATE } from "@graphql/users/mutations";
import { GET_USER } from "@graphql/users/queries";
import { User } from "@interfaces/users";
import { Button, Container, Typography } from "@material-ui/core";
import { NextPage } from "next";
import Link from "next/link";
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

  const [authUser, { loading, data, error }] = useMutation<{
    authUser: { user: User; idToken: string | null };
  }>(AUTHENTICATE, {
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

  if (!loading && data && data.authUser) {
    router.push("/profile");
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
            <Link href="/">
              <Button variant="contained">Tilbake til hjemmesiden</Button>
            </Link>
          </>
        )}
      </Container>
    </Layout>
  );
};

export default AuthCallbackPage;
