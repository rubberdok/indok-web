import useResponsive from "@hooks/useResponsive";
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
  const mobile = useResponsive({ query: "down", key: "md" });
  const { pathname } = useRouter();
  if (mobile) {
    /**
     * Supplying a key here forces state resets for the drawer when
     * pathname changes, which will close the drawer
     */
    return <Drawer routes={routes} key={pathname} />;
  }
  return <Basic routes={routes} />;
};

export default Navigation;
