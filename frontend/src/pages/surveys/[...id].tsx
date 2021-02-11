import { NextPage, GetServerSideProps, InferGetServerSidePropsType } from "next";
import Layout from "@components/Layout";
import SurveyDetail from "@components/pages/surveys/survey";
import { Container } from "@material-ui/core";

const SurveyPage: NextPage<InferGetServerSidePropsType<typeof getServerSideProps>> = ({ id }) => (
  <Layout>
    <Container>
      <SurveyDetail id={id[0]} />
    </Container>
  </Layout>
);

export default SurveyPage;

export const getServerSideProps: GetServerSideProps<{ id: string }> = async (context) => {
  const id = (context.query.id as string[])[0];
  return {
    props: { id },
  };
};
