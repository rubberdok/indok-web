import { Route } from "./types";

export const routes: Route[] = [
  {
    title: "Arrangementer",
    path: "/events",
  },
  { title: "Ledige vervstillinger", path: "/listings" },
  { title: "Booking", path: "/booking" },
  { title: "Dokumenter", path: "/archive", permission: "archive.view_archivedocument" },
  { title: "Om oss", path: "/about" },
];
