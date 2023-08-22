import { QueryReference, useQuery, useReadQuery } from "@apollo/client";
import { PropsWithChildren } from "react";

import { graphql } from "@/gql";
import { HasPermissionQuery } from "@/gql/graphql";

/**
 * Wrapper component that renders its children if the user has the given permission.
 * Permissions can either be passed as strings, or as a query reference if using `useBackgroundQuery`
 * from @apollo/client. Using the latter can result in better performance, as the permission check can
 * be done in the background while the rest of the page is rendered.
 */
export function PermissionRequired<T extends HasPermissionQuery>(
  props: React.PropsWithChildren<BackgroundQueryProps<T> | PermissionRequiredProps>
) {
  if ("queryRef" in props) {
    return <BackgroundQueryPermissionRequired {...props} />;
  }
  return <QueryPermissionRequired {...props} />;
}

type BackgroundQueryProps<T extends HasPermissionQuery> = {
  queryRef: QueryReference<T>;
};

function BackgroundQueryPermissionRequired<T extends HasPermissionQuery>(
  props: PropsWithChildren<BackgroundQueryProps<T>>
) {
  const { queryRef, children } = props;
  const { data } = useReadQuery(queryRef);

  if (data.hasPermission === null) {
    return null;
  }
  return <>{children}</>;
}

const hasPermissionDocument = graphql(/* GraphQL */ `
  query HasPermission($permission: String!) {
    hasPermission(permission: $permission)
  }
`);

type PermissionRequiredProps = {
  permission: string;
};

function QueryPermissionRequired(props: PropsWithChildren<PermissionRequiredProps>) {
  const { permission, children } = props;
  const { data } = useQuery(hasPermissionDocument, {
    variables: {
      permission,
    },
  });

  if (data?.hasPermission === null) {
    return null;
  }
  return <>{children}</>;
}
