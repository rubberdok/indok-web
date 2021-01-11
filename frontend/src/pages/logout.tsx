import { useMutation } from "@apollo/client";
import Layout from "@components/Layout";
import { DELETE_TOKEN_COOKIE } from "@graphql/auth/mutations";
import { NextPage } from "next";
import { useRouter } from "next/router";

const LogoutPage: NextPage = () => {
  const [deleteCookie, { data, loading, error, client }] = useMutation(DELETE_TOKEN_COOKIE, { errorPolicy: "all" });
  const router = useRouter();

  // Request backend to delete JWT cookie identifying the user
  deleteCookie();
  // If the request was sucessfull, the cookie is now deleted.
  // reset the apollo store and redirect. See // https://www.apollographql.com/docs/react/networking/authentication/#reset-store-on-logout
  if (data && data.deleteTokenCookie.deleted) {
    client.resetStore();
    router.push("/");
    return null;
  }
  if (loading) {
    loading && <p>Logger deg ut ... </p>;
  }

  return <Layout>{error && <div> ERROR: {error.message}</div>}</Layout>;
};

export default LogoutPage;
