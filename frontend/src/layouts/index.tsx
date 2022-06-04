import dynamic from "next/dynamic";
import { ReactNode } from "react";

const Header = dynamic(() => import("./header/variants/Basic"));
const HeaderSimple = dynamic(() => import("./header/variants/Simple"));
const Footer = dynamic(() => import("./footer/Footer"));
const FooterSimple = dynamic(() => import("./footer/FooterSimple"));

type Props = {
  children: ReactNode;
  transparentHeader?: boolean;
  disabledHeader?: boolean;
  disabledFooter?: boolean;
  simpleHeader?: boolean;
  simpleFooter?: boolean;
};

const Layout: React.FC<Props> = ({
  children,
  transparentHeader,
  disabledHeader,
  disabledFooter,
  simpleHeader,
  simpleFooter,
}) => {
  return (
    <>
      {!disabledHeader && simpleHeader ? <HeaderSimple /> : <Header transparent={transparentHeader} />}
      {children}
      {!disabledFooter && simpleFooter ? <FooterSimple /> : <Footer />}
    </>
  );
};

export default Layout;
