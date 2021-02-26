import { useMutation } from "@apollo/client";
import Layout from "@components/Layout";
import { AUTHENTICATE } from "@graphql/auth/mutations";
import { GET_USER } from "@graphql/auth/queries";
import { User } from "@interfaces/users";
import { Button, Container, Typography } from "@material-ui/core";
import { generateQueryString } from "@utils/helpers";
import { NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect } from "react";

const AuthCallbackPage: NextPage = () => {
  const router = useRouter();
  const { code, state, enrolled } = router.query;

  if (state && state !== process.env.NEXT_PUBLIC_DATAPORTEN_STATE) {
    if (typeof window !== "undefined") {
      router.push("/");
      return null;
    }
  }

  const [authUser, { loading, data, error }] = useMutation<{
    authUser: { user: User; isIndokStudent: boolean; idToken: string | null };
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
    if (!data.authUser.isIndokStudent && data.authUser.idToken) {
      // User does not attend indøk, log them out of Feide and redirect to this page without enrolled=false querystring
      const queryString = generateQueryString({
        post_logout_redirect_uri: process.env.NEXT_PUBLIC_FRONTEND_URI + "/authCallback?enrolled=false",
        id_token_hint: data.authUser.idToken,
      });
      const logOutUrl = "https://auth.dataporten.no/openid/endsession" + queryString;

      router.push(logOutUrl);
      return null;
    }
    router.push("/profile");
    return null;
  }
  return (
    <Layout>
      <Container>
        <Typography variant="h2">Feide-innlogging</Typography>
        {loading ? (
          <Typography variant="body1">Logger deg inn...</Typography>
        ) : error ? (
          <>
            <Typography variant="body1" color="error">
              FEIL: {error.message}
            </Typography>
            <Link href="/">
              <Button variant="contained">Tilbake til hjemmesiden</Button>
            </Link>
          </>
        ) : enrolled === "false" ? (
          <>
            <Typography variant="body1" color="error">
              Beklager, kun studenter som studerer Industriell Økonomi og Teknologiledelse (MTIØT) kan logge inn.
            </Typography>
            <Link href="/">
              <Button variant="contained">Tilbake til hjemmesiden</Button>
            </Link>
          </>
        ) : (
          <></>
        )}
      </Container>
    </Layout>
  );
};

export default AuthCallbackPage;
