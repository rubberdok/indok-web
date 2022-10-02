import dynamic from "next/dynamic";
import { useRouter } from "next/router";

import { routes } from "./constants";

const Drawer = dynamic(() => import("./variants/Drawer"));
const Basic = dynamic(() => import("./variants/Basic"));

/**
 * Navigation component for the app bar, switches between a navigation drawer and
 * app bar navigation depending on screen size.
 */
const Navigation: React.FC = () => {
  const { route } = useRouter();
  return (
    <>
      <Drawer key={route} routes={routes} />
      <Basic routes={routes} />
    </>
  );
};

export default Navigation;
