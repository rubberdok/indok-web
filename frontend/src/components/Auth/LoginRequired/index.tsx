import { useQuery } from "@apollo/client";
import { Button, ButtonProps, Skeleton } from "@mui/material";
import { useRouter } from "next/router";
import React, { useMemo } from "react";

import { Link } from "@/components";
import { UserDocument } from "@/generated/graphql";
import { generateFeideLoginUrl } from "@/utils/auth";

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
  const url = useMemo<string>(() => generateFeideLoginUrl(path), [path]);
  const { data, loading } = useQuery(UserDocument);
  const { fullWidth } = buttonProps;

  if (loading) {
    return (
      <Skeleton variant="rectangular" {...(fullWidth && { width: "100%" })}>
        <Button
          size="medium"
          variant="contained"
          color="primary"
          component={Link}
          noLinkStyle
          href={url}
          {...buttonProps}
        >
          Logg inn
        </Button>
      </Skeleton>
    );
  }

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
