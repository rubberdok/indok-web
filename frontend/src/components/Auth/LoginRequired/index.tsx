import { useMutation, useQuery } from "@apollo/client";
import { RedirectUrlDocument, UserDocument } from "@generated/graphql";
import { Button, ButtonProps, Skeleton } from "@mui/material";
import { useRouter } from "next/router";
import React from "react";

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

  const [mutation] = useMutation(RedirectUrlDocument, {
    variables: {
      state: path,
    },
    onCompleted(data) {
      const { redirectUrl } = data;
      router.push(redirectUrl);
    },
  });
  const { data, loading } = useQuery(UserDocument);
  const { fullWidth } = buttonProps;

  if (loading) {
    return (
      <Skeleton variant="rectangular" {...(fullWidth && { width: "100%" })}>
        <Button size="medium" variant="contained" color="primary" {...buttonProps}>
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
      size="medium"
      variant="contained"
      color="primary"
      data-test-id={dataTestId}
      {...buttonProps}
      onClick={() => mutation()}
    >
      Logg inn
    </Button>
  );
};

export default LoginRequired;
