import Layout from "@components/Layout";
import { Button, Container, Typography } from "@material-ui/core";
import { NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { GetUserDocument, useAuthUserMutation, UserFragment } from "src/api/generated/graphql";

const AuthCallbackPage: NextPage = () => {
  const router = useRouter();
  const { code, state } = router.query;

  if (state && state !== process.env.NEXT_PUBLIC_DATAPORTEN_STATE) {
    if (typeof window !== "undefined") {
      router.push("/");
      return null;
    }
  }
  const [authUser, { loading, data, error }] = useAuthUserMutation({
    errorPolicy: "all",
  });

  useEffect(() => {
    if (code && typeof code === "string") {
      authUser({
        variables: { code },
        update: (cache, { data }) => {
          if (!data || !data.authUser || !data.authUser.user) {
            return;
          }
          cache.writeQuery<UserFragment>({ query: GetUserDocument, data: data.authUser.user });
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
            <Link href="/">
              <Button variant="contained">Tilbake til hjemmesiden</Button>
            </Link>
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
