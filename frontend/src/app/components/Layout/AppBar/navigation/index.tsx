import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";

import { FeaturePermission } from "@/gql/app/graphql";
import { Route } from "./variants/props";

const routes: Route[] = [
  {
    title: "Arrangementer",
    path: "/events",
    segment: "events",
  },
  { title: "Verv", path: "/listings", segment: "listings" },
  { title: "Hyttebooking", path: "/cabins", segment: "cabins" },
  { title: "Dokumenter", path: "/archive", segment: "archive", permission: FeaturePermission.ArchiveViewDocuments },
  { title: "Om oss", path: "/about", segment: "about" },
];

// https://nextjs.org/docs/advanced-features/dynamic-import
const Drawer = dynamic(() => import("./variants/Drawer").then((mod) => mod.Drawer));
const Basic = dynamic(() => import("./variants/Basic").then((mod) => mod.Basic));

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
