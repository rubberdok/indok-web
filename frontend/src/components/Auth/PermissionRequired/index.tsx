import { useQuery } from "@apollo/client";
import { HasPermissionDocument } from "@graphql";

type Props = {
  permission: string;
  fallback?: React.ReactElement;
};

const PermissionRequired: React.FC<Props> = ({ permission, fallback, children }) => {
  const { data } = useQuery(HasPermissionDocument, {
    variables: {
      permission,
    },
  });

  if (data?.hasPermission) return <>{children}</>;
  return <>{fallback}</>;
};

export default PermissionRequired;
