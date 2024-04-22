import { FeaturePermission } from "@/gql/app/graphql";

import { Route } from "./types";

export const routes: Route[] = [
  {
    title: "Arrangementer",
    path: "/events",
  },
  { title: "Verv", path: "/listings" },
  { title: "Hyttebooking", path: "/cabins" },
  { title: "Bang", path: "bangg.pages.dev" },
  { title: "Dokumenter", path: "/documents", permission: FeaturePermission.ArchiveViewDocuments },
  { title: "Om oss", path: "/about" },
];
