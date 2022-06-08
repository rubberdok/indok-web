import { useMutation } from "@apollo/client";
import { config } from "@utils/config";
import { generateQueryString } from "@utils/helpers";
import { useRouter } from "next/router";
import { LogoutDocument } from "@generated/graphql";
import { Button, ButtonProps } from "@mui/material";
import { LoadingButton } from "@mui/lab";

const Logout: React.FC<ButtonProps> = ({ ...props }) => {
  const router = useRouter();
  const [logoutAction, { loading, client }] = useMutation(LogoutDocument, {
    onCompleted: ({ logout }) => {
      // reset the apollo store and redirect. See // https://www.apollographql.com/docs/react/networking/authentication/#reset-store-on-logout
      client.resetStore();
      const queryString = generateQueryString({
        post_logout_redirect_uri: config.FRONTEND_URI,
        id_token_hint: logout?.idToken,
      });
      const logOutUrl = "https://auth.dataporten.no/openid/endsession" + queryString;
      router.push(logOutUrl);
    },
  });

  if (loading) {
    return (
      <LoadingButton color="warning" {...props}>
        Logg ut
      </LoadingButton>
    );
  }

  return (
    <Button color="error" variant="contained" {...props} onClick={() => logoutAction()}>
      Logg ut
    </Button>
  );
};

export default Logout;
