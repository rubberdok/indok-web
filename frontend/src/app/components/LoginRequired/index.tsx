import { useSuspenseQuery } from "@apollo/client";
import { Button, ButtonProps } from "@mui/material";
import React, { useMemo } from "react";

import { graphql } from "@/gql";
import { generateFeideLoginUrl } from "@/utils/auth";

import { Link } from "../Link";

type Props = {
  redirect?: boolean;
  redirectPath?: string;
  children?: React.ReactNode;
  fallback?: React.ReactNode;
  "data-test-id"?: string;
};

const loggedInUserDocument = graphql(/* GraphQL */ `
  query UserWithId {
    user {
      id
    }
  }
`);

/**
 * Wrapper for stuff that requires a user to be logged in to view.
 * If the user is not logged in, it renders the fallback component, defaulting to a log in button.
 * If a user is logged in, it renders the children.
 * While loading, will render as a rectangular skeleton.
 */
export const LoginRequired: React.FC<
  React.PropsWithChildren<Props & Pick<ButtonProps, "color" | "fullWidth" | "size" | "variant">>
> = ({ children, fallback, "data-test-id": dataTestId, ...buttonProps }) => {
  const url = useMemo<string>(() => generateFeideLoginUrl(), []);
  const { data } = useSuspenseQuery(loggedInUserDocument, {
    returnPartialData: true,
  });

  if (data?.user) {
    return <>{children}</>;
  }

  if (fallback) {
    return <>{fallback}</>;
  }

  return (
    <Button
      component={Link}
      noLinkStyle
      href={url}
      size="medium"
      variant="contained"
      color="primary"
      data-test-id={dataTestId}
      {...buttonProps}
    >
      Logg inn
    </Button>
  );
};
