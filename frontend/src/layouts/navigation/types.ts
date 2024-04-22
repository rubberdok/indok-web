import { FeaturePermission } from "@/gql/app/graphql";

export type NavigationProps = {
  routes: Route[];
};

export type Route = {
  title: string;
  path: string;
  permission?: FeaturePermission;
};
