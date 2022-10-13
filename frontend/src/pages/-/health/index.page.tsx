import { useLazyQuery, useQuery } from "@apollo/client";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";

import { UserDocument, UserFragment } from "@/generated/graphql";
import { addApolloState, initializeApollo } from "@/lib/apolloClient";

const HealthPage = ({ user }: InferGetServerSidePropsType<typeof getServerSideProps>): JSX.Element => {
  const { data } = useQuery(UserDocument, { fetchPolicy: "cache-only" });
  const [loadUser] = useLazyQuery(UserDocument, { fetchPolicy: "network-only" });
  return (
    <>
      <h1>Hi, I am healthy</h1>
      {user && <h4>The server request was made by {user.firstName}</h4>}
      {data?.user && <h4>The live query belongs to {data?.user.firstName}</h4>}
      <button onClick={() => loadUser()}>Update live query</button>
    </>
  );
};

export const getServerSideProps: GetServerSideProps<{ user?: UserFragment | null }> = async (ctx) => {
  const client = initializeApollo({}, ctx);
  const {
    data: { user },
    error,
  } = await client.query({ query: UserDocument });

  if (error) {
    return { notFound: true };
  }

  return addApolloState(client, { props: { user } });
};

export default HealthPage;
