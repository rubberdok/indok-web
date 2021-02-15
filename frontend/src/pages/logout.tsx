import { useMutation } from "@apollo/client";
import Layout from "@components/Layout";
import { LOG_OUT_USER } from "@graphql/auth/mutations";
import { NextPage } from "next";
import { useRouter } from "next/router";

const LogoutPage: NextPage = () => {
  const [deleteCookie, { data, loading, error, client }] = useMutation(LOG_OUT_USER, { errorPolicy: "all" });
  const router = useRouter();

  // Request backend to delete JWT cookie identifying the user
  deleteCookie();
  // If the request was sucessfull, the cookie is now deleted.
  // reset the apollo store and redirect. See // https://www.apollographql.com/docs/react/networking/authentication/#reset-store-on-logout
  if (data && data.logOutUser && data.logOutUser.deleted && data.logOutUser.id_token) {
    console.log(data);
    router.push(
      `https://auth.dataporten.no/openid/endsession?post_logout_redirect_uri=http://localhost:3000&id_token_hint=${data.logOutUser.id_token}`
    );
    client.resetStore();
    return null;
  }
  if (loading) {
    loading && <p>Logger deg ut ... </p>;
  }

  return <Layout>{error && <div> ERROR: {error.message}</div>}</Layout>;
};

export default LogoutPage;
