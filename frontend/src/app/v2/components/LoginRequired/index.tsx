import { useSuspenseQuery } from "@apollo/client";
import { Button, ButtonProps } from "@mui/material";
import React, { useMemo } from "react";

import { generateFeideLoginUrl } from "@/utils/auth";

import { Link } from "../../../components/Link";
import { graphql } from "@/gql/app";

type Props = {
  redirect?: boolean;
  redirectPath?: string;
  children?: React.ReactNode;
  fallback?: React.ReactNode;
  "data-test-id"?: string;
};



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
  const { data } = useSuspenseQuery(graphql(`
    query AppLoginRequiredUser {
      user {
        user {
          id
          firstName
        }
      }
    }
  `), {
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
