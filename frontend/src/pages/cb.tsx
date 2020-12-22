import { useMutation } from "@apollo/client";
import Layout from "@components/Layout";
import { AUTHENTICATE } from "@graphql/auth/mutations";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const CallbackPage: NextPage = () => {
  const router = useRouter();
  const query = router.query;

  const [authUser] = useMutation(AUTHENTICATE);
  const [userInfo, setUserInfo] = useState({});

  useEffect(() => {
    if ("code" in query) {
      console.log("sending to backend");
      console.log(query);
      authUser({ variables: query }).then((res) => {
        console.log(res);
        setUserInfo(res.data.authUser.user);
      });
    }
  }, [query]);
  return (
    <Layout>
      {userInfo.username ? <div>Logged in as {Object.values(userInfo).join("\n")}</div> : <div>Logging you in...!</div>}{" "}
    </Layout>
  );
};

export default CallbackPage;
