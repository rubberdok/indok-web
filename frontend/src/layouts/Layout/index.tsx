import dynamic from "next/dynamic";
import { ReactNode } from "react";

// https://nextjs.org/docs/advanced-features/dynamic-import
const Header = dynamic(() => import("../header/variants/Basic").then((mod) => mod.Basic));
const HeaderSimple = dynamic(() => import("../header/variants/Simple").then((mod) => mod.Simple));
const Footer = dynamic(() => import("../footer/Footer").then((mod) => mod.Footer));
const FooterSimple = dynamic(() => import("../footer/FooterSimple").then((mod) => mod.FooterSimple));

export { RootStyle } from "../styles";

type Props = {
  children: ReactNode;
  disableGutter?: boolean;
  transparentHeader?: boolean;
  disabledHeader?: boolean;
  disabledFooter?: boolean;
  simpleHeader?: boolean;
  simpleFooter?: boolean;
};

export const Layout: React.FC<React.PropsWithChildren<Props>> = ({
  children,
  transparentHeader,
  disabledHeader,
  disabledFooter,
  simpleHeader,
  simpleFooter,
  disableGutter,
}) => {
  return (
    <>
      {!disabledHeader && simpleHeader ? <HeaderSimple /> : <Header transparent={transparentHeader} />}
      <div className="content">{children}</div>
      {!disabledFooter && (
        <footer className="footer">
          {simpleFooter ? <FooterSimple disableGutter={disableGutter} /> : <Footer disableGutter={disableGutter} />}
        </footer>
      )}
    </>
  );
};
