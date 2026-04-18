"use client";

import { useQuery } from "@apollo/client";
import { PersonOutlineRounded } from "@mui/icons-material";
import { Button, Skeleton } from "@mui/material";
import { useMemo } from "react";

import { graphql } from "@/gql";
import { generateFeideLoginUrl } from "@/utils/auth";

import { Link } from "../Link";

type Props = {
  fullWidth?: boolean;
  "data-test-id"?: string;
};

const loggedInUserDocument = graphql(/* GraphQL */ `
  query LoggedInUser {
    user {
      id
      firstName
    }
  }
`);

export const InnerLoginButton: React.FC<Props> = ({ fullWidth, "data-test-id": dataTestId }) => {
  const url = useMemo<string>(() => generateFeideLoginUrl(), []);
  const { data, loading } = useQuery(loggedInUserDocument, {
    ssr: false,
    errorPolicy: "all",
  });

  if (loading) {
    return (
      <Skeleton>
        <Button
          component={Link}
          href="/profile"
          noLinkStyle
          endIcon={<PersonOutlineRounded fontSize="small" />}
          variant="text"
          color="secondary"
          size="medium"
        >
          Laster...
        </Button>
      </Skeleton>
    );
  }

  if (!data?.user) {
    return (
      <Button
        component={Link}
        href={url}
        noLinkStyle
        variant="text"
        color="secondary"
        size="medium"
        data-test-id={dataTestId}
        fullWidth={fullWidth}
      >
        Logg inn
      </Button>
    );
  }

  return (
    <Button
      component={Link}
      href="/profile"
      noLinkStyle
      endIcon={<PersonOutlineRounded fontSize="small" />}
      variant="text"
      color="secondary"
      size="medium"
    >
      {data.user.firstName}
    </Button>
  );
};

export function LoginButton(props: Props) {
  return <InnerLoginButton {...props} />;
}
