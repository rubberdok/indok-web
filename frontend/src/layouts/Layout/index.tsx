import dynamic from "next/dynamic";
import { ReactNode } from "react";

const Header = dynamic(() => import("../header/variants/Basic"));
const HeaderSimple = dynamic(() => import("../header/variants/Simple"));
const Footer = dynamic(() => import("../footer/Footer"));
const FooterSimple = dynamic(() => import("../footer/FooterSimple"));

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
      <div className="content">{children}</div>
      {!disabledFooter && <footer className="footer">{simpleFooter ? <FooterSimple /> : <Footer />}</footer>}
    </>
  );
};

export default Layout;

export { RootStyle } from "../styles";
