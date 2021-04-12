import { useMutation } from "@apollo/client";
import Layout from "@components/Layout";
import { GET_ID_TOKEN } from "@graphql/users/mutations";
import { generateQueryString } from "@utils/helpers";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useDeleteTokenCookieMutation } from "src/api/generated/graphql";

const LogoutPage: NextPage = () => {
  const [
    deleteCookie,
    { data: deleteCookieData, loading: deleteCookieLoading, error: deleteCookieError, client },
  ] = useDeleteTokenCookieMutation({
    errorPolicy: "all",
  });
  const [getIdToken, { data, loading, error }] = useMutation<{ getIdToken: { idToken: string } }>(GET_ID_TOKEN, {
    errorPolicy: "all",
  });

  const router = useRouter();

  useEffect(() => {
    // Get id_token of user to use during feide-logout
    getIdToken();
    // Request backend to delete JWT cookie identifying the user
    deleteCookie();
  }, []);

  // If the request was sucessfull, the cookie is now deleted.
  // reset the apollo store and redirect. See // https://www.apollographql.com/docs/react/networking/authentication/#reset-store-on-logout
  if (deleteCookieData && data) {
    const queryString = generateQueryString({
      post_logout_redirect_uri: process.env.NEXT_PUBLIC_FRONTEND_URI,
      id_token_hint: data.getIdToken.idToken,
    });
    const logOutUrl = "https://auth.dataporten.no/openid/endsession" + queryString;

    router.push(logOutUrl);
    client.resetStore();
    return null;
  }
  if (loading || deleteCookieLoading) {
    return <p>Logger deg ut ... </p>;
  }

  return (
    <Layout>
      {error && <div> ERROR: {error.message}</div>}
      {deleteCookieError && <div> ERROR: {deleteCookieError.message}</div>}
    </Layout>
  );
};

export default LogoutPage;
