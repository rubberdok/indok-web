import { Route } from "./types";

export const routes: Route[] = [
  {
    title: "Arrangementer",
    path: "/events",
  },
  { title: "Verv", path: "/listings" },
  { title: "Hyttebooking", path: "/cabins" },
  { title: "Dokumenter", path: "/archive", permission: "archive.view_archivedocument" },
  { title: "Bilbooking", path: "/cars" },
  { title: "Om oss", path: "/about" },
];
