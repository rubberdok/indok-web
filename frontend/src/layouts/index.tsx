import dynamic from "next/dynamic";
import { ReactNode } from "react";

const Header = dynamic(() => import("./header/Header"), { ssr: false });
const HeaderSimple = dynamic(() => import("./header/HeaderSimple"), { ssr: false });
const Footer = dynamic(() => import("./footer/Footer"), { ssr: false });
const FooterSimple = dynamic(() => import("./footer/FooterSimple"), { ssr: false });

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
      {disabledHeader ? null : simpleHeader ? <HeaderSimple /> : <Header transparent={transparentHeader} />}

      {children}

      {disabledFooter ? null : simpleFooter ? <FooterSimple /> : <Footer />}
    </>
  );
};

export default Layout;
