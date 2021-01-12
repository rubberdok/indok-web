import { useMutation } from "@apollo/client";
import Layout from "@components/Layout";
import { AUTHENTICATE } from "@graphql/auth/mutations";
import { GET_USER } from "@graphql/auth/queries";
import { User } from "@interfaces/users";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect } from "react";

const AuthCallbackPage: NextPage = () => {
  const router = useRouter();
  const { code, state } = router.query;

  if (state && state !== process.env.NEXT_PUBLIC_DATAPORTEN_STATE) {
    if (typeof window !== "undefined") {
      router.push("/");
      return null;
    }
  }

  const [authUser, { loading, data, error }] = useMutation<{ authUser: { user: User } }>(AUTHENTICATE, {
    errorPolicy: "all",
  });

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

  if (!loading && data) {
    router.push("/profile");
    return null;
  }
  return (
    <Layout>
      {error ? (
        <div> ERROR: {error.message}</div>
      ) : data ? (
        <div>Logged in as data.authUser.user.username </div>
      ) : (
        <div>Logging you in...</div>
      )}
    </Layout>
  );
};

export default AuthCallbackPage;
