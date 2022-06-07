import { useQuery } from "@apollo/client";
import LoginRequired from "@components/authz/LoginRequired";
import { GET_USER_INFO } from "@graphql/users/queries";
import { UserInfo } from "@interfaces/users";
import { Button } from "@mui/material";
import NextLink from "next/link";
import { User } from "phosphor-react";

const LoginButton: React.FC = () => {
  const { data } = useQuery<{ user: UserInfo | null }>(GET_USER_INFO);

  return (
    <LoginRequired size="small" color="inherit" data-test-id="login">
      <NextLink href="/profile" passHref>
        <Button endIcon={<User />} variant="outlined" color="inherit" size="small">
          {data?.user?.firstName}
        </Button>
      </NextLink>
    </LoginRequired>
  );
};

export default LoginButton;
