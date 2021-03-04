import Layout from "@components/Layout";
import Wrapper from "@components/pages/about/Template";
import { Box, Breadcrumbs, Container, Grid, makeStyles, Paper, Typography } from "@material-ui/core";
import { getPostBySlug, getPostsSlugs } from "@utils/posts";
import { NextPage } from "next";
import React from "react";
import ReactMarkdown from "react-markdown";

type ArticleProps = {
  params: {
    slug: string;
  };
  post: {
    content: string;
    excerpt: string;
  };
  frontmatter: {
    description: string;
    title: string;
    image?: string;
  };
};

const useStyles = makeStyles(() => ({
  title: {
    color: "white",
    zIndex: -1,
  },
  titleImage: {
    width: "100%",
    height: "100%",
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
  },
  navItem: {
    fontWeight: 600,
    fontSize: 12,
    textTransform: "uppercase",
    color: "black",
    "&:hover": {
      cursor: "pointer",
    },
  },
  breadcrumb: {
    fontSize: "13px",
    textTransform: "uppercase",
    color: "#676767",
    marginTop: -32,
  },
  heroCard: {
    marginTop: -112,
    padding: "56px 64px",
    textAlign: "center",
  },
}));

const Article: NextPage<ArticleProps> = ({ post, frontmatter }) => {
  const classes = useStyles();

  return (
    <Layout>
      <Box mt="-60px" position="relative" className={classes.title} height={450}>
        <Box
          display="flex"
          alignItems="center"
          flexDirection="column"
          justifyContent="center"
          className={classes.titleImage}
          style={{
            backgroundImage: `linear-gradient(to top, rgb(0 0 0 / 50%), rgb(0 0 0 / 60%)),
                  url(${frontmatter.image})`,
          }}
        >
          <Typography variant="h2">{frontmatter.title}</Typography>
        </Box>
      </Box>
      <Container>
        <Grid justify="center" container>
          <Grid item xs={10}>
            <Paper className={classes.heroCard}>
              <Box display="flex" flexDirection="column" alignItems="center">
                <Box>
                  <Breadcrumbs className={classes.breadcrumb} aria-label="breadcrumb">
                    <p color="inherit">Om foreningen</p>
                    <p>{frontmatter.title}</p>
                  </Breadcrumbs>
                </Box>
                <Typography variant="subtitle1">{frontmatter.description || post.excerpt}</Typography>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>
      <Wrapper>
        <ReactMarkdown escapeHtml={false} source={post.content} renderers={{ heading: HeadingRenderer }} />
      </Wrapper>
    </Layout>
  );
};

export const getStaticPaths = async () => {
  const paths = getPostsSlugs("about");

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps = async ({ params }: ArticleProps) => {
  const { slug } = params;

  const postData = getPostBySlug(slug, "about");

  if (!postData.previousPost) {
    postData.previousPost = null;
  }

  if (!postData.nextPost) {
    postData.nextPost = null;
  }


  return { props: postData };
};

const HeadingRenderer = (props: { children: React.ReactNode }) => {
  return <Typography variant="h5">{props.children}</Typography>;
};

export default Article;
