import { FeaturePermission } from "@/gql/app/graphql";

type NavigationProps = {
    routes: Route[];
  };

  type Route = {
    title: string;
    path: string;
    segment: string;
    permission?: FeaturePermission;
  };

  export type { NavigationProps, Route}