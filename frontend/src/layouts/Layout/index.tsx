import { useTheme } from "@mui/material/styles";
import Head from "next/head";
import { ReactNode } from "react";

import { Footer } from "../footer/Footer";
import { FooterSimple } from "../footer/FooterSimple";
import { Basic as Header } from "../header/variants/Basic";
import { Simple as HeaderSimple } from "../header/variants/Simple";

export { RootStyle } from "../styles";

type Props = {
  children: ReactNode;
  simpleHeader?: boolean;
  simpleFooter?: boolean;
};

export const Layout: React.FC<React.PropsWithChildren<Props>> = ({ children, simpleHeader, simpleFooter }) => {
  const theme = useTheme();
  return (
    <>
      <Head>
        <meta name="theme-color" content={theme.palette.background.default} key="theme-color" />
      </Head>
      {simpleHeader ? <HeaderSimple /> : <Header />}
      <main className="content">{children}</main>
      <footer className="footer">{simpleFooter ? <FooterSimple /> : <Footer />}</footer>
    </>
  );
};
