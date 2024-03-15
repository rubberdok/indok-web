import { usePathname } from "next/navigation";

import { FeaturePermission } from "@/gql/app/graphql";

import { Basic } from "./variants/Basic";
import { Drawer } from "./variants/Drawer";
import { Route } from "./variants/props";

const routes: Route[] = [
  { title: "Arrangementer", path: "/events", segment: "events" },
  { title: "Verv", path: "/listings", segment: "listings" },
  { title: "Hyttebooking", path: "/cabins", segment: "cabins" },
  { title: "Dokumenter", path: "/documents", segment: "documents", permission: FeaturePermission.ArchiveViewDocuments },
  { title: "Om oss", path: "/about", segment: "about" },
];

/**
 * Navigation component for the app bar, switches between a navigation drawer and
 * app bar navigation depending on screen size.
 */
export const Navigation: React.FC<React.PropsWithChildren<unknown>> = () => {
  const pathname = usePathname();
  return (
    <>
      <Drawer key={pathname} routes={routes} />
      <Basic routes={routes} />
    </>
  );
};
