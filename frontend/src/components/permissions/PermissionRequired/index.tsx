import { useQuery } from "@apollo/client";
import { HAS_PERMISSION } from "@graphql/utils/time/queries";

type Props = {
  permission: string;
};

const PermissionRequired: React.FC<Props> = ({ permission, children }) => {
  const { data } = useQuery<{ hasPermission: boolean }>(HAS_PERMISSION, {
    variables: {
      permission,
    },
  });
  if (data && data.hasPermission) return <>{children}</>;
  return null;
};

export default PermissionRequired;
