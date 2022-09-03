import { useQuery } from "@apollo/client";
import { GET_USER_INFO } from "@graphql/users/queries";
import { UserInfo } from "@interfaces/users";
import { Button, ButtonProps, Skeleton } from "@mui/material";
import { generateFeideLoginUrl } from "@utils/auth";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useMemo } from "react";

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
export const LoginRequired: React.FC<Props & ButtonProps> = ({
  redirect,
  redirectPath,
  children,
  fallback,
  "data-test-id": dataTestId,
  ...buttonProps
}) => {
  const router = useRouter();
  let path: string | undefined = redirectPath;
  if (redirect) {
    path ||= router.asPath;
  }
  const url = useMemo<string>(() => generateFeideLoginUrl(path), [path]);
  const { data, loading } = useQuery<{ user?: UserInfo | null }>(GET_USER_INFO);
  const { fullWidth } = buttonProps;

  if (loading) {
    return (
      <Skeleton variant="rectangular" {...(fullWidth && { width: "100%" })}>
        <Link href={url} passHref>
          <Button size="medium" variant="contained" color="primary" {...buttonProps}>
            Logg inn
          </Button>
        </Link>
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
    <Link href={url} passHref>
      <Button size="medium" variant="contained" color="primary" data-test-id={dataTestId} {...buttonProps}>
        Logg inn
      </Button>
    </Link>
  );
};

export default LoginRequired;
