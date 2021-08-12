const links = [
  {
    id: 1,
    title: "Hjem",
    href: "/",
  },
  {
    id: 2,
    title: "Om Foreningen",
    href: "/about",
    dropdown: [
      {
        id: 2_1,
        title: "Om oss",
        href: "/about",
      },
      {
        id: 2_2,
        title: "Organisasjoner",
        href: "/about/organization",
      },
      {
        id: 2_3,
        title: "Hovedstyret",
        href: "/about/board",
      },
    ],
  },
  {
    id: 3,
    title: "Arrangementer",
    href: "/events",
  },
  {
    id: 4,
    title: "Verv",
    href: "/listings",
  },
  {
    id: 5,
    title: "Indøkhyttene",
    href: "/cabins",
  },
  {
    id: 6,
    title: "Varsler",
    href: "/reports",
  },
];

export default links;
