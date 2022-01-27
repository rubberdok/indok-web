import { useQuery } from "@apollo/client";
import { GET_USER } from "@graphql/users/queries";
import { User } from "@interfaces/users";
import { Button } from "@material-ui/core";
import { generateFeideLoginUrl } from "@utils/auth";
import Link from "next/link";
import { useMemo } from "react";
import { Skeleton } from "@material-ui/lab";

type Props = {
  redirect?: string;
  children?: React.ReactNode;
  fallback?: React.ReactNode;
};

export const LoginRequired = ({ redirect, children, fallback }: Props) => {
  const url = useMemo<string>(() => generateFeideLoginUrl(redirect), [redirect]);
  const { data, loading } = useQuery<{ user?: User }>(GET_USER);

  if (loading) {
    return (
      <Skeleton variant="rect">
        <Link href={url} passHref>
          <Button variant="contained" color="primary">
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
