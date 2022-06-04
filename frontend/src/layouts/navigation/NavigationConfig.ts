export type NavigationItemType = {
  title: string;
  path: string;
};

export const navigationConfig: NavigationItemType[] = [
  {
    title: "Arrangementer",
    path: "/events",
  },
  { title: "Verv", path: "/listings" },
  { title: "Hyttebooking", path: "/cabins" },
  { title: "Arkiv", path: "/archive" },
  { title: "Om oss", path: "/about" },
];
