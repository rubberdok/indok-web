import { useQuery } from "@apollo/client";
import { GET_USER_INFO } from "@graphql/users/queries";
import { UserInfo } from "@interfaces/users";
import { Button } from "@mui/material";
import { Skeleton } from "@mui/material";
import { generateFeideLoginUrl } from "@utils/auth";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useMemo } from "react";

type Props = {
  redirect?: boolean;
  redirectPath?: string;
  children?: React.ReactNode;
  fallback?: React.ReactNode;
};

export const LoginRequired: React.FC<Props> = ({ redirect, redirectPath, children, fallback }) => {
  const router = useRouter();
  let path: string | undefined = redirectPath;
  if (redirect) {
    path ||= router.asPath;
  }
  const url = useMemo<string>(() => generateFeideLoginUrl(path), [path]);
  const { data, loading } = useQuery<{ user?: UserInfo }>(GET_USER_INFO);

  if (loading) {
    return (
      <Skeleton variant="rectangular">
        <Link href={url} passHref>
          <Button size="medium" variant="contained" color="primary">
            Log inn
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
      <Button size="medium" variant="contained" color="primary">
        Logg inn
      </Button>
    </Link>
  );
};

export default LoginRequired;
