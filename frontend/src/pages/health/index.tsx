import { GET_SERVER_TIME } from "@graphql/utils/time/queries";
import { addApolloState, initializeApollo } from "@lib/apolloClient";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";

const HealthPage = ({ serverTime }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  return (
    <>
      <h1>Hi, I am healthy</h1>
      <h4>The request was made at {serverTime}</h4>
    </>
  );
};

export const getServerSideProps: GetServerSideProps<{ serverTime: string }> = async () => {
  const client = initializeApollo();
  const {
    data: { serverTime },
    error,
  } = await client.query<{ serverTime: string }>({
    query: GET_SERVER_TIME,
  });

  if (error) {
    return {
      notFound: true,
    };
  }

  return addApolloState(client, {
    props: { serverTime },
  });
};

export default HealthPage;
