import { useRouter } from "next/router";

import { Basic } from "./variants/Basic";
import { Drawer } from "./variants/Drawer";

import { routes } from "./constants";

/**
 * Navigation component for the app bar, switches between a navigation drawer and
 * app bar navigation depending on screen size.
 */
export const Navigation: React.FC<React.PropsWithChildren<unknown>> = () => {
  const { route } = useRouter();
  return (
    <>
      <Drawer key={route} routes={routes} />
      <Basic routes={routes} />
    </>
  );
};
