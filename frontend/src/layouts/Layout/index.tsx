import { useTheme } from "@mui/material/styles";
import dynamic from "next/dynamic";
import Head from "next/head";
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
  const theme = useTheme();
  return (
    <>
      <Head>
        <meta name="theme-color" content={`${theme.palette.background.default}`} key="theme-color" />
      </Head>
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
