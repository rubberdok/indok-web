import Layout from "@components/Layout";
import SurveyAnswer from "@components/pages/surveys/surveyAnswer";
import { Container } from "@material-ui/core";
import { GetServerSideProps, InferGetServerSidePropsType, NextPage } from "next";

const SurveyPage: NextPage<InferGetServerSidePropsType<typeof getServerSideProps>> = ({ id }) => (
  <Layout>
    <Container>
      <SurveyAnswer surveyId={id[0]} />
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
