import dynamic from "next/dynamic";
import { routes } from "./constants";

const Drawer = dynamic(() => import("./variants/Drawer"));
const Basic = dynamic(() => import("./variants/Basic"));

/**
 * Navigation component for the app bar, switches between a navigation drawer and
 * app bar navigation depending on screen size.
 */
const Navigation: React.FC = () => {
  return (
    <>
      <Drawer routes={routes} />
      <Basic routes={routes} />
    </>
  );
};

export default Navigation;
