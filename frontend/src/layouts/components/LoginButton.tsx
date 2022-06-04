import { useQuery } from "@apollo/client";
import { GET_USER_INFO } from "@graphql/users/queries";
import { UserInfo } from "@interfaces/users";
import { Button } from "@mui/material";
import { generateFeideLoginUrl } from "@utils/auth";
import NextLink from "next/link";
import { User } from "phosphor-react";

const LoginButton = () => {
  const { data } = useQuery<{ user: UserInfo | null }>(GET_USER_INFO);
  const loggedIn = typeof data?.user?.firstName !== "undefined" && data?.user !== null;
  const signInUrl = generateFeideLoginUrl();

  if (loggedIn) {
    return (
      <NextLink href="/profile" passHref>
        <Button endIcon={<User />} variant="contained" color="inherit">
          {data?.user?.firstName}
        </Button>
      </NextLink>
    );
  }
  return (
    <Button variant="contained" href={signInUrl} target="_blank" rel="noopener">
      Logg inn
    </Button>
  );
};

export default LoginButton;
