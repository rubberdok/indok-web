import Navbar from "@components/navbar/Navbar";
import ScrollTop from "@components/ui/ScrollTop";
import { makeStyles } from "@material-ui/core";
import Head from "next/head";
import Footer from "./Footer";

const useStyles = makeStyles(() => ({
  content: {
    minHeight: "calc(100vh - 75px)",
    display: "flex",
    justifyContent: "space-between",
    flexDirection: "column",
  },
}));

const Layout = ({ children }: { children: React.ReactNode }) => {
  const classes = useStyles();

  return (
    <>
      <Head>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar />
      <div className={classes.content}>
        <div>{children}</div>
        <ScrollTop />
        <Footer />
      </div>
    </>
  );
};

export default Layout;
