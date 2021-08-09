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

type LayoutProps = {
  children: React.ReactNode;
  /* The page title, should be concise. Should not start with Indok NTNU or something similar. Use this title to describe the content on the page, e.g. the name of the event. Can optionally append '| Indok NTNU' at the end of the title.  */
  title: string;
  /* A page's description meta tag gives Google and other search engines a summary of what the page is about. A page's title may be a few words or a phrase, whereas a page's description meta tag might be a sentence or two or even a short paragraph. Like the <title> tag, the description meta tag is placed within the <head> element of your HTML document. */
  description?: string;
  /* Removed '| Indok NTNU' from the end of the title. */
  excludeTitleSuffix?: boolean;
};

const Layout: React.FC<LayoutProps> = ({ children, title, description, excludeTitleSuffix }) => {
  const classes = useStyles();
  const titleWithSuffix = `${title}${!excludeTitleSuffix && " | Indøk NTNU"}`;

  return (
    <>
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <title>{titleWithSuffix}</title>
        <meta property="og:title" content={titleWithSuffix} key="title"></meta>
        <meta name="description" content={description} />
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
