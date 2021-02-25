import { useMutation } from "@apollo/client";
import Layout from "@components/Layout";
import { DELETE_TOKEN_COOKIE, GET_ID_TOKEN } from "@graphql/auth/mutations";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect } from "react";

const LogoutPage: NextPage = () => {
  const [getIdToken, { data, loading, error }] = useMutation(GET_ID_TOKEN, { errorPolicy: "all" });
  const [
    deleteCookie,
    { data: deleteCookieData, loading: deleteCookieLoading, error: deleteCookieError, client },
  ] = useMutation(DELETE_TOKEN_COOKIE, { errorPolicy: "all" });
  const router = useRouter();

  useEffect(() => {
    // Get id_token of user to use during feide-logout
    getIdToken();
    // Request backend to delete JWT cookie identifying the user
    deleteCookie();
  }, []);

  // If the request was sucessfull, the cookie is now deleted.
  // reset the apollo store and redirect. See // https://www.apollographql.com/docs/react/networking/authentication/#reset-store-on-logout
  if (
    deleteCookieData &&
    deleteCookieData.deleteTokenCookie &&
    deleteCookieData.deleteTokenCookie.deleted &&
    data &&
    data.getIdToken &&
    data.getIdToken.idToken &&
    data.getIdToken.idToken
  ) {
    let logOutUrl = "https://auth.dataporten.no/openid/endsession";
    logOutUrl += `?post_logout_redirect_uri=${process.env.NEXT_PUBLIC_HOST_NAME}`;
    logOutUrl += `&id_token_hint=${data.getIdToken.idToken}`;
    // TODO: make queryparam generator function
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
