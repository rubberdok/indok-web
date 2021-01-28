import Layout from "@components/Layout";
import Button from "@components/ui/Button";
import Content from "@components/ui/Content";
import { Paragraph, Title } from "@components/ui/Typography";
import { NextPage } from "next";
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
