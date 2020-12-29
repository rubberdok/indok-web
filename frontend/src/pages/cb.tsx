import { useMutation } from "@apollo/client";
import Layout from "@components/Layout";
import { AUTHENTICATE } from "@graphql/auth/mutations";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const CallbackPage: NextPage = () => {
  const router = useRouter();
  const { code } = router.query;

  const [authUser, { data, error }] = useMutation(AUTHENTICATE, { errorPolicy: "all" });
  // const [userInfo, setUserInfo] = useState<{ username?: string }>({});
  // const [errors, setErrors] = useState<string>("");

  useEffect(() => {
    if (code) {
      console.log("sending to backend");
      authUser({ variables: { code } });
    }
  }, [code]);

  return (
    <Layout>
      {error ? (
        <div> ERROR: {error.message}</div>
      ) : data ? (
        <>
          <div>Logged in as </div>
          <pre>{JSON.stringify(data.authUser.user, null, 2)}</pre>
        </>
      ) : (
        <div>Logging you in...</div>
      )}{" "}
    </Layout>
  );
};

export default CallbackPage;
