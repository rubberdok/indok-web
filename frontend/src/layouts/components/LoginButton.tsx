import { useQuery } from "@apollo/client";
import { PersonOutlineRounded } from "@mui/icons-material";
import { Button } from "@mui/material";

import { Link } from "@/components";
import { LoginRequired } from "@/components/Auth/LoginRequired";
import { graphql } from "@/gql/pages";

type Props = {
  fullWidth?: boolean;
  "data-test-id"?: string;
};

export const LoginButton: React.FC<Props> = ({ fullWidth, "data-test-id": dataTestId }) => {
  const { data } = useQuery(graphql(`
    query LoginButtonUser {
      user {
        user {
          id
          firstName
        }
      }
    }
  `));
  const user = data?.user?.user;

  return (
    <LoginRequired size="medium" color="secondary" data-test-id={dataTestId} fullWidth={fullWidth} variant="text">
      <Button
        component={Link}
        href="/profile"
        noLinkStyle
        endIcon={<PersonOutlineRounded fontSize="small" />}
        variant="text"
        color="secondary"
        size="medium"
      >
        {user?.firstName}
      </Button>
    </LoginRequired>
  );
};
