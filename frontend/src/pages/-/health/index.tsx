import { useLazyQuery } from "@apollo/client";
import { GET_USER_PROFILE } from "@graphql/users/queries";
import { addApolloState, initializeApollo } from "@lib/apolloClient";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { User } from "src/types/users";

const HealthPage = ({ user }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const [loadServerTime] = useLazyQuery(GET_USER_PROFILE);
  return (
    <>
      <h1>Hi, I am healthy</h1>
      {user ? <h4>The request was made by {user.firstName}</h4> : <h4>The request was made without being logged in</h4>}
      <button onClick={() => loadServerTime()}>Click me</button>
    </>
  );
};

export const getServerSideProps: GetServerSideProps<{ user: User | null }> = async (ctx) => {
  const client = initializeApollo({}, ctx);
  const {
    data: { user },
    error,
  } = await client.query<{ user: User | null }>({
    query: GET_USER_PROFILE,
  });

  if (error) {
    return {
      notFound: true,
    };
  }

  return addApolloState(client, {
    props: { user },
  });
};

export default HealthPage;
