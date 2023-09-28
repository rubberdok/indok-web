import { useQuery } from "@apollo/client";

import { HasPermissionDocument } from "@/generated/graphql";

type Props = {
  permission: string;
  fallback?: React.ReactElement;
  optimistic?: boolean;
};

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
