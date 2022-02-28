import { useLazyQuery, useQuery } from "@apollo/client";
import { GET_USER_PROFILE } from "@graphql/users/queries";
import { addApolloState, initializeApollo } from "@lib/apolloClient";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { User } from "src/types/users";

const HealthPage = ({ user }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const { data } = useQuery<{ user: User }>(GET_USER_PROFILE, {
    fetchPolicy: "cache-only",
  });
  const [loadUser] = useLazyQuery<{ user: User | null }>(GET_USER_PROFILE, { fetchPolicy: "network-only" });
  return (
    <>
      <h1>Hi, I am healthy</h1>
      {user && <h4>The server request was made by {user.firstName}</h4>}
      {data?.user && <h4>The live query belongs to {data?.user.firstName}</h4>}
      <button onClick={() => loadUser()}>Update live query</button>
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
