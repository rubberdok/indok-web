"use client";

import { useSuspenseQuery } from "@apollo/client";
import { PersonOutlineRounded } from "@mui/icons-material";
import { Button, Skeleton } from "@mui/material";
import { Suspense } from "react";

import { graphql } from "@/gql";

import { Link } from "../Link";
import { LoginRequired } from "../LoginRequired";

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
  const { data } = useSuspenseQuery(loggedInUserDocument);

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
        {data?.user?.firstName}
      </Button>
    </LoginRequired>
  );
};

export function LoginButton(props: Props) {
  return (
    <Suspense
      fallback={
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
      }
    >
      <InnerLoginButton {...props} />
    </Suspense>
  );
}
