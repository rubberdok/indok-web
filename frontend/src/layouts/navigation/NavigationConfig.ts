export type NavigationItemType = {
  title: string;
  path: string;
};

export const navigationConfig: NavigationItemType[] = [
  { title: "Hjem", path: "/" },
  { title: "Om oss", path: "/about" },
  {
    title: "Arrangementer",
    path: "/events",
  },
  { title: "Verv", path: "/listings" },
  { title: "Hyttebooking", path: "/cabins" },
];
