import Layout from "@components/Layout";
import { NextPage } from "next";
import { useEffect } from "react";

const CallbackPage: NextPage = ({ query }) => {
  const signIn = async () => {
    const resp = await fetch("http://localhost:8000/get-token/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(query),
    });
    const data = await resp.json();
    console.log("resp", data);
  };
  useEffect(() => {
    if (query) {
      console.log(query);
      console.log("sending to backend");
      signIn();
    }
  }, [query]);
  return (
    <Layout>
      <div>Logging you in...!</div>
    </Layout>
  );
};

CallbackPage.getInitialProps = ({ query }) => {
  return { query };
};

export default CallbackPage;
