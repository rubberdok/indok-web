import { useQuery } from "@apollo/client";

import { graphql } from "@/gql";

type Props = {
  permission: string;
  fallback?: React.ReactElement;
  optimistic?: boolean;
};

const HasPermissionDocument = graphql(/* GraphQL */ `
  query hasPermission($permission: String!) {
    hasPermission(permission: $permission)
  }
`);

export const PermissionRequired: React.FC<React.PropsWithChildren<Props>> = ({
  permission,
  fallback,
  children,
  optimistic,
}) => {
  const { data } = useQuery(HasPermissionDocument, { variables: { permission } });

  if (optimistic) {
    if (data?.hasPermission === false) return <>{fallback}</>;
    return <>{children}</>;
  }

  if (data?.hasPermission) return <>{children}</>;
  return <>{fallback}</>;
};
