import Layout from "@components/Layout";
import { NextPage, NextPageContext } from "next";
import { ParsedUrlQuery } from "querystring";
import { useEffect } from "react";

interface Props {
  query: ParsedUrlQuery;
}

const CallbackPage: NextPage<Props> = ({ query }) => {
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

CallbackPage.getInitialProps = ({ query }: NextPageContext) => ({ query });

export default CallbackPage;
