export type NavigationProps = {
  routes: Route[];
};

export type Route = {
  title: string;
  path: string;
  permission?: string;
};
