import { useQuery } from "@apollo/client";
import { Button, ButtonProps, Skeleton } from "@mui/material";
import { useRouter } from "next/router";
import React from "react";

import { graphql } from "@/gql/pages";
import { config } from "@/utils/config";

import { NextLinkComposed } from "../../Link";

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
> = ({ redirect, redirectPath, children, fallback, "data-test-id": dataTestId, ...buttonProps }) => {
  const router = useRouter();
  let path: string | undefined = redirectPath;
  if (redirect) {
    path ||= router.asPath;
  }
  const { data, loading } = useQuery(
    graphql(`
      query PagesLoginRequiredUser {
        user {
          user {
            id
            firstName
          }
        }
      }
    `),
    {}
  );
  const { fullWidth } = buttonProps;

  if (data?.user.user) {
    return <>{children}</>;
  }

  const loginUrl = new URL("/auth/login", config.API_URL);
  loginUrl.searchParams.set("return-to", `${config.FRONTEND_URI}${path ?? "/profile"}`);

  if (loading) {
    return (
      <Skeleton variant="rounded" {...(fullWidth && { width: "100%" })}>
        <Button
          size="medium"
          variant="contained"
          color="primary"
          component={NextLinkComposed}
          to={loginUrl}
          {...buttonProps}
        >
          Logg inn
        </Button>
      </Skeleton>
    );
  }

  if (fallback) {
    return <>{fallback}</>;
  }

  return (
    <Button
      component={NextLinkComposed}
      to={loginUrl}
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
