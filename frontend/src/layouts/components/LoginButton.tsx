import { useQuery } from "@apollo/client";
import LoginRequired from "@components/Auth/LoginRequired";
import { GET_USER_INFO } from "@graphql/users/queries";
import { UserInfo } from "@interfaces/users";
import { Button } from "@mui/material";
import NextLink from "next/link";
import { UserIcon } from "@heroicons/react/outline";

const LoginButton: React.FC = () => {
  const { data } = useQuery<{ user: UserInfo | null }>(GET_USER_INFO);

  return (
    <LoginRequired size="medium" color="inherit" data-test-id="login">
      <NextLink href="/profile" passHref>
        <Button endIcon={<UserIcon height={20} width={20} />} variant="outlined" color="inherit" size="medium">
          {data?.user?.firstName}
        </Button>
      </NextLink>
    </LoginRequired>
  );
};

export default LoginButton;
