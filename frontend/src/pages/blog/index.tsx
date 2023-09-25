import { Container, Typography } from "@mui/material";
import Head from "next/head";

import { Layout, RootStyle } from "@/layouts/Layout";
import { NextPageWithLayout } from "@/lib/next";

const BlogPage: NextPageWithLayout = () => {
  return (
    <>
      <Head>
        <title>Blog | Forening for studenter ved Industriell Økonomi og Teknologiledelse</title>
        <meta name="og:title" content="Blog | Indøk NTNU" key="title" />
      </Head>
      <Container>
        <Typography variant="h3" component="h1" gutterBottom>
          Blog
        </Typography>
        <Typography variant="body1" paragraph>
          Welcome to the blog! Here you will find various posts and articles.
        </Typography>
        {/* Add components to list and display blog posts here */}
      </Container>
    </>
  );
};

export default BlogPage;

BlogPage.getLayout = (page) => (
  <Layout>
    <RootStyle>{page}</RootStyle>
  </Layout>
);
