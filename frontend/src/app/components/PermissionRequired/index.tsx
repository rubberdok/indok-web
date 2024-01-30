import { QueryReference, useQuery, useReadQuery } from "@apollo/client";
import { PropsWithChildren } from "react";

import { graphql } from "@/gql/app";
import { FeaturePermission, HasFeaturePermissionQuery } from "@/gql/app/graphql";

/**
 * Wrapper component that renders its children if the user has the given permission.
 * Permissions can either be passed as strings, or as a query reference if using `useBackgroundQuery`
 * from @apollo/client. Using the latter can result in better performance, as the permission check can
 * be done in the background while the rest of the page is rendered.
 */
export function PermissionRequired<T extends HasFeaturePermissionQuery>(
  props: React.PropsWithChildren<BackgroundQueryProps<T> | PermissionRequiredProps>
) {
  if ("queryRef" in props) {
    return <BackgroundQueryPermissionRequired {...props} />;
  }
  return <QueryPermissionRequired {...props} />;
}

type BackgroundQueryProps<T extends HasFeaturePermissionQuery> = {
  queryRef: QueryReference<T>;
};

function BackgroundQueryPermissionRequired<T extends HasFeaturePermissionQuery>(
  props: PropsWithChildren<BackgroundQueryProps<T>>
) {
  const { queryRef, children } = props;
  const { data } = useReadQuery(queryRef);

  if (data.hasFeaturePermission) return <>{children}</>;
  return null;
}

type PermissionRequiredProps = {
  permission: FeaturePermission;
};

function QueryPermissionRequired(props: PropsWithChildren<PermissionRequiredProps>) {
  const { permission, children } = props;
  const { data } = useQuery(
    graphql(`
      query HasFeaturePermission($data: HasFeaturePermissionInput!) {
        hasFeaturePermission(data: $data) {
          id
          hasFeaturePermission
        }
      }
    `),
    {
      variables: {
        data: {
          featurePermission: permission,
        },
      },
    }
  );

  if (data?.hasFeaturePermission) return <>{children}</>;
  return null;
}
