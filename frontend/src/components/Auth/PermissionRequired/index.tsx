import { useQuery } from "@apollo/client";

import { HasPermissionDocument } from "@/generated/graphql";

type Props = {
  permission: string;
  fallback?: React.ReactElement;
};

export const PermissionRequired: React.FC<React.PropsWithChildren<Props>> = ({ permission, fallback, children }) => {
  const { data } = useQuery(HasPermissionDocument, { variables: { permission } });

  if (data?.hasPermission) return <>{children}</>;
  return <>{fallback}</>;
};
