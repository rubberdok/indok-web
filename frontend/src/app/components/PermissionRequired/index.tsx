import { QueryRef, useQuery, useReadQuery } from "@apollo/client/react";
import { PropsWithChildren } from "react";

import { graphql } from "@/gql";
import { HasPermissionQuery } from "@/gql/graphql";

/**
 * Wrapper component that renders its children if the user has the given permission.
 * Permissions can either be passed as strings, or as a query reference if using `useBackgroundQuery`
 * from @apollo/client. Using the latter can result in better performance, as the permission check can
 * be done in the background while the rest of the page is rendered.
 */
export function PermissionRequired<T>(
  props: React.PropsWithChildren<BackgroundQueryProps<T> | PermissionRequiredProps>
) {
  if ("queryRef" in props) {
    return <BackgroundQueryPermissionRequired {...props} />;
  }
  return <QueryPermissionRequired {...props} />;
}

type BackgroundQueryProps<T> = {
  queryRef: QueryRef<T>;
  isAllowed?: (data: T) => boolean;
};

function BackgroundQueryPermissionRequired<T>(props: PropsWithChildren<BackgroundQueryProps<T>>) {
  const { queryRef, isAllowed, children } = props;
  const { data } = useReadQuery(queryRef);

  const allowed = isAllowed ? isAllowed(data) : (data as HasPermissionQuery | null | undefined)?.hasPermission === true;

  if (allowed) return <>{children}</>;
  return null;
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

  if (data?.hasPermission) return <>{children}</>;
  return null;
}
