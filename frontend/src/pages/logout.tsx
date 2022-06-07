import { useQuery } from "@apollo/client";
import DeprecatedLayout from "@components/DeprecatedLayout";
import { LOGOUT } from "@graphql/users/mutations";
import { config } from "@utils/config";
import { generateQueryString } from "@utils/helpers";
import { NextPage } from "next";
import { useRouter } from "next/router";

const LogoutPage: NextPage = () => {
  const { loading, error, client } = useQuery<{ idToken: string }>(LOGOUT, {
    onCompleted: ({ idToken }) => {
      // reset the apollo store and redirect. See // https://www.apollographql.com/docs/react/networking/authentication/#reset-store-on-logout
      const queryString = generateQueryString({
        post_logout_redirect_uri: config.FRONTEND_URI,
        id_token_hint: idToken,
      });
      const logOutUrl = "https://auth.dataporten.no/openid/endsession" + queryString;
      router.push(logOutUrl);
      client.resetStore();
    },
  });

  const router = useRouter();

  if (loading) {
    return <p>Logger deg ut ... </p>;
  }

  return <DeprecatedLayout>{error && <div> ERROR: {error.message}</div>}</DeprecatedLayout>;
};

export default LogoutPage;
