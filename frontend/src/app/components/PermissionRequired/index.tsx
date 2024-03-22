"use client";
import { QueryReference, useReadQuery, useSuspenseQuery } from "@apollo/client";
import { PropsWithChildren } from "react";

import { graphql } from "@/gql/app";
import { FeaturePermission, HasFeaturePermissionQuery } from "@/gql/app/graphql";

type PermissionRequiredProps<T extends HasFeaturePermissionQuery> =
  | BackgroundQueryProps<T>
  | QueryPermissionRequiredProps;

type SharedProps = {
  optimistic?: boolean;
  fallback?: React.ReactNode;
};

/**
 * Wrapper component that renders its children if the user has the given permission.
 * Permissions can either be passed as strings, or as a query reference if using `useBackgroundQuery`
 * from @apollo/client. Using the latter can result in better performance, as the permission check can
 * be done in the background while the rest of the page is rendered.
 */
export function PermissionRequired<T extends HasFeaturePermissionQuery>(
  props: React.PropsWithChildren<PermissionRequiredProps<T>>
) {
  if ("queryRef" in props) {
    return <BackgroundQueryPermissionRequired {...props} />;
  }
  return <QueryPermissionRequired {...props} />;
}

type BackgroundQueryProps<T extends HasFeaturePermissionQuery> = {
  queryRef: QueryReference<T>;
} & SharedProps;

function BackgroundQueryPermissionRequired<T extends HasFeaturePermissionQuery>(
  props: PropsWithChildren<BackgroundQueryProps<T>>
) {
  const { queryRef, children } = props;
  const { data } = useReadQuery(queryRef);

  if (data.hasFeaturePermission.hasFeaturePermission) return <>{children}</>;
  if (props.optimistic) return <>{children}</>;
  if (props.fallback) return props.fallback;
  return null;
}

type QueryPermissionRequiredProps = {
  permission: FeaturePermission;
} & SharedProps;

function QueryPermissionRequired(props: PropsWithChildren<QueryPermissionRequiredProps>) {
  const { permission, children } = props;
  const { data } = useSuspenseQuery(
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

  if (data?.hasFeaturePermission.hasFeaturePermission) return <>{children}</>;
  if (props.optimistic) return <>{children}</>;
  if (props.fallback) return props.fallback;
  return null;
}
