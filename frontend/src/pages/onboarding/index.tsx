import { GetServerSideProps, InferGetServerSidePropsType, NextPage } from "next";
import Layout from "@components/Layout";
import { Container } from "@material-ui/core";
import OnboardingForm from "@components/OnboardingForm";
import client from "../apollo-client";
import { GET_USER } from "@graphql/users/queries";
import { gql } from "@apollo/client";

const OnboardingPage: NextPage = ({ data }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  return (
    <Layout>
      <Container>
        <OnboardingForm user={data.user}/>
      </Container>
    </Layout>
  )
}

export default OnboardingPage;

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const { data } = await client.query({
    query: GET_USER,
    context: {
      headers: {
        Authorization: `JWT ${req.cookies.JWT}`
      },
    }
  });

  if (!data || !data.user || !data.user.firstLogin) {
    return {
      notFound: true
    }
  }

  return {
    props: {
      data,
    }
  }
}