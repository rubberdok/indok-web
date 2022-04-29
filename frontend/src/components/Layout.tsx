import Navbar from "@components/navbar/Navbar";
import ScrollTop from "@components/ui/ScrollTop";
import makeStyles from "@mui/styles/makeStyles";
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

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const classes = useStyles();

  return (
    <>
      <Head>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar />
      <div className={classes.content}>
        <div>{children}</div>
        <Footer />
      </div>
      <ScrollTop />
    </>
  );
};

export default Layout;
