import { useMutation } from "@apollo/client";
import Layout from "@components/Layout";
import { AUTHENTICATE } from "@graphql/auth/mutations";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect } from "react";

const CallbackPage: NextPage = () => {
  const router = useRouter();
  const { code } = router.query;

  const [authUser, { data, error }] = useMutation(AUTHENTICATE, { errorPolicy: "all" });

  useEffect(() => {
    if (code) {
      authUser({ variables: { code } });
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
