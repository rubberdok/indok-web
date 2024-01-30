import { useQuery } from "@apollo/client";

import { graphql } from "@/gql/pages";
import { FeaturePermission } from "@/gql/pages/graphql";

type Props = {
  permission: FeaturePermission;
  fallback?: React.ReactElement;
  optimistic?: boolean;
};

export const PermissionRequired: React.FC<React.PropsWithChildren<Props>> = ({
  permission,
  fallback,
  children,
  optimistic,
}) => {
  const { data } = useQuery(
    graphql(`
      query PagesPermissionRequired($data: HasFeaturePermissionInput!) {
        hasFeaturePermission(data: $data) {
          id
          hasFeaturePermission
        }
      }
    `),
    { variables: { data: { featurePermission: permission } } }
  );

  if (optimistic) {
    if (data?.hasFeaturePermission.hasFeaturePermission === false) return <>{fallback}</>;
    return <>{children}</>;
  }

  if (data?.hasFeaturePermission.hasFeaturePermission) return <>{children}</>;
  return <>{fallback}</>;
};
