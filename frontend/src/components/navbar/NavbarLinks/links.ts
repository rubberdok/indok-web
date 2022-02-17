/** Config type for links in the navbar. */
export type NavbarLink = {
  id: number;
  title: string;
  href: string;
  dropdown?: NavbarLink[];
  loginRequired?: boolean;

  /** Backend permission that the user must have to see this link in the navbar. */
  permissionRequired?: string;

  /** Whether navbar link leads to a different site. */
  external?: boolean;
};

const links: NavbarLink[] = [
  {
    id: 1,
    title: "Arrangementer",
    href: "/events",
  },
  {
    id: 2,
    title: "Verv",
    href: "/listings",
  },
  {
    id: 3,
    title: "Hyttebooking",
    href: "/cabins",
  },
  {
    id: 4,
    title: "Arkiv",
    href: "/archives",
    loginRequired: true,
    permissionRequired: "archive.view_archivedocument",
  },
  {
    id: 5,
    title: "Om oss",
    href: "/about",
    dropdown: [
      {
        id: 5_1,
        title: "Våre foreninger",
        href: "/about/organization",
      },
      {
        id: 5_2,
        title: "Hovedstyret",
        href: "/about/board",
      },
      {
        id: 5_3,
        title: "Om studiet",
        href: "https://www.ntnu.no/studier/mtiot",
        external: true,
      },
    ],
  },
];

export default links;
