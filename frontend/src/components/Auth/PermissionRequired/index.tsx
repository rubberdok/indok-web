import { useQuery } from "@apollo/client";

import { HasPermissionDocument } from "@/generated/graphql";

type Props = {
  permission: string;
  fallback?: React.ReactElement;
};

const PermissionRequired: React.FC<Props> = ({ permission, fallback, children }) => {
  const { data } = useQuery(HasPermissionDocument, { variables: { permission }, ssr: false });

  if (data?.hasPermission) return <>{children}</>;
  return <>{fallback}</>;
};

export default PermissionRequired;
