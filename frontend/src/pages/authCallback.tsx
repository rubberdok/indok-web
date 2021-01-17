import { useMutation } from "@apollo/client";
import Layout from "@components/Layout";
import Button from "@components/ui/Button";
import Content from "@components/ui/Content";
import { Paragraph, Title } from "@components/ui/Typography";
import { AUTHENTICATE } from "@graphql/auth/mutations";
import { GET_USER } from "@graphql/auth/queries";
import { User } from "@interfaces/users";
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
      <Content>
        <Title>Feide-innlogging</Title>
        {error ? (
          <>
            <Paragraph> FEIL: {error.message}</Paragraph>
            <Button link="/" back>
              Tilbake til hjemmesiden
            </Button>
          </>
        ) : data ? (
          <Paragraph>Logget inn som data.authUser.user.firstName </Paragraph>
        ) : (
          <Paragraph>Logger deg inn...</Paragraph>
        )}
      </Content>
    </Layout>
  );
};

export default AuthCallbackPage;
