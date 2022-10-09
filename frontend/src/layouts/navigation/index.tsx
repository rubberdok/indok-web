import dynamic from "next/dynamic";
import { useRouter } from "next/router";

import { routes } from "./constants";

// https://nextjs.org/docs/advanced-features/dynamic-import
const Drawer = dynamic(() => import("./variants/Drawer").then((mod) => mod.Drawer));
const Basic = dynamic(() => import("./variants/Basic").then((mod) => mod.Basic));

/**
 * Navigation component for the app bar, switches between a navigation drawer and
 * app bar navigation depending on screen size.
 */
export const Navigation: React.FC = () => {
  const { route } = useRouter();
  return (
    <>
      <Drawer key={route} routes={routes} />
      <Basic routes={routes} />
    </>
  );
};
