import { useSuspenseQuery } from "@apollo/client";
import { Button, ButtonProps } from "@mui/material";
import React from "react";

import { graphql } from "@/gql/app";
import { config } from "@/utils/config";

import { NextLinkComposed } from "../Link";

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
  const url = new URL(`/auth/login`, config.API_URL);
  url.searchParams.set("redirect", `${config.FRONTEND_URI}/profile`);
  const { data } = useSuspenseQuery(
    graphql(`
      query AppLoginRequiredUser {
        user {
          user {
            id
            firstName
          }
        }
      }
    `)
  );

  if (data?.user.user) {
    return <>{children}</>;
  }

  if (fallback) {
    return <>{fallback}</>;
  }

  return (
    <Button
      component={NextLinkComposed}
      to={url}
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
