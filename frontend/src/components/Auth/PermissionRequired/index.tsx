import { useQuery } from "@apollo/client";
import { HAS_PERMISSION } from "@graphql/permissions/queries";

type Props = {
  permission: string;
  fallback?: React.ReactElement;
};

const PermissionRequired: React.FC<Props> = ({ permission, fallback, children }) => {
  const { data } = useQuery<{ hasPermission: boolean }>(HAS_PERMISSION, {
    variables: {
      permission,
    },
  });

  if (data?.hasPermission) return <>{children}</>;
  return <>{fallback}</>;
};

export default PermissionRequired;
