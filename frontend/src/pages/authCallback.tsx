import Layout from "@components/Layout";
import ProfileSkeleton from "@components/pages/profile/ProfileSkeleton";
import { AUTHENTICATE } from "@graphql/users/mutations";
import { User } from "@interfaces/users";
import { addApolloState, initializeApollo } from "@lib/apolloClient";
import { Container } from "@material-ui/core";
import { GetServerSideProps, InferGetServerSidePropsType, NextPage } from "next";
import React from "react";

type AuthUser = {
  user: User;
  idToken: string | null;
};

const AuthCallbackPage: NextPage = (props: InferGetServerSidePropsType<typeof getServerSideProps>): JSX.Element => {
  return (
    <Layout>
      <Container>
        <ProfileSkeleton />
      </Container>
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const client = initializeApollo({}, ctx);

  const { code, state } = ctx.query;

  let redirect;

  try {
    const { data } = await client.mutate<{ authUser: AuthUser }>({ mutation: AUTHENTICATE, variables: { code } });
    if (data) {
      if (data.authUser.user.firstLogin) {
        redirect = "/register";
      } else if (state) {
        if (Array.isArray(state)) {
          redirect = state.join("");
        } else {
          redirect = state;
        }
      } else {
        redirect = "/profile";
      }

      // TODO: Get cookie from mutation and add to responseHeader (format ["JWT=123", "csrftoken=5677"])
      let cookiesFromMutation: any;
      ctx.res.setHeader("Cookie", cookiesFromMutation);
    }
    if (!data) {
      return { notFound: true };
    }
    return {
      ...addApolloState(client, { props: { user: data.authUser.user || null } }),
      redirect: { destination: redirect, permanent: true },
    };
  } catch (e) {
    return {
      notFound: true,
    };
  }
};

export default AuthCallbackPage;
