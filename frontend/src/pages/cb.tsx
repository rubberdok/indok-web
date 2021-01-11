import { useMutation } from "@apollo/client";
import Layout from "@components/Layout";
import { AUTHENTICATE } from "@graphql/auth/mutations";
import { GET_USER } from "@graphql/auth/queries";
import { User } from "@interfaces/users";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect } from "react";

const CallbackPage: NextPage = () => {
  const router = useRouter();
  const { code } = router.query;

  const [authUser, { data, error }] = useMutation<{ authUser: { user: User } }>(AUTHENTICATE, { errorPolicy: "all" });

  useEffect(() => {
    if (code) {
      authUser({
        variables: { code },
        update: (cache, { data }) => {
          if (!data || !data.authUser.user) {
            return;
          }
          cache.writeQuery<User>({ query: GET_USER, data: data.authUser.user });
        },
      });
    }
  }, [code]);

  return (
    <Layout>
      {error ? (
        <div> ERROR: {error.message}</div>
      ) : data ? (
        <pre>
          <div>Logged in as </div>
          {JSON.stringify(data.authUser.user, null, 4)}
        </pre>
      ) : (
        <div>Logging you in...</div>
      )}
    </Layout>
  );
};

export default CallbackPage;
