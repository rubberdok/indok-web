import { useQuery } from "@apollo/client";
import { PersonOutlineRounded } from "@mui/icons-material";
import { Button } from "@mui/material";

import { Link } from "@/components";
import { LoginRequired } from "@/components/Auth/LoginRequired";
import { UserDocument } from "@/generated/graphql";

type Props = {
  fullWidth?: boolean;
  "data-test-id"?: string;
};

export const LoginButton: React.FC<Props> = ({ fullWidth, "data-test-id": dataTestId }) => {
  const { data } = useQuery(UserDocument);

  return (
    <LoginRequired size="medium" color="contrast" data-test-id={dataTestId} fullWidth={fullWidth} variant="text">
      <Button
        component={Link}
        href="/profile"
        noLinkStyle
        endIcon={<PersonOutlineRounded fontSize="small" />}
        variant="text"
        color="contrast"
        size="medium"
      >
        {data?.user?.firstName}
      </Button>
    </LoginRequired>
  );
};
