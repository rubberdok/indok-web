import Layout from "@components/Layout";
import { Box, Card, Container, Grid, makeStyles, Paper, Typography } from "@material-ui/core";
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
    logo?: string;
    alt?: string;
    image?: string;
    styre: Array<any>;
  };
  nextPost: any;
  previousPost: any;
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
  heroCard: {
    marginTop: -112,
    textAlign: "center",
  },
  logo: {
    height: 100,
  },
}));

const Article: NextPage<ArticleProps> = ({ post, frontmatter }) => {
  const classes = useStyles();

  return (
    <Layout>
      <Box mt="-60px" position="relative" className={classes.title} height={350}>
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
        ></Box>
      </Box>

      <Container>
        <Grid justify="center" container>
          <Grid item xs={10}>
            <Paper className={classes.heroCard}>
              <Box mb="56px" py="40px" px="56px" display="flex" alignItems="center" justifyContent="space-between">
                <Typography variant="h4">{frontmatter.title}</Typography>
                <img className={classes.logo} alt={frontmatter.alt} src={frontmatter.logo}></img>
              </Box>
              {/* <Box px="56px" mb="56px" pb="24px" display="flex" alignItems="center" justifyContent="space-between">
                {previousPost ? (
                  <Link href={"/about/organizations/[slug]"} as={`/about/organizations/${previousPost.slug}`}>
                    <a>← {previousPost.frontmatter.title}</a>
                  </Link>
                ) : (
                  <div />
                )}

                <a href="./../organizations">Oversikt</a>

                {nextPost ? (
                  <Link href={"/about/organizations/[slug]"} as={`/about/organizations/${nextPost.slug}`}>
                    <a>{nextPost.frontmatter.title} →</a>
                  </Link>
                ) : (
                  <div />
                )}
              </Box> */}
            </Paper>
          </Grid>
        </Grid>

        <Grid container spacing={4}>
          <Grid item xs={8}>
            <ReactMarkdown
              escapeHtml={false}
              source={post.content}
              renderers={{ heading: HeadingRenderer, paragraph: ParagraphRenderer }}
            />
          </Grid>
          <Grid item xs={4}>
            {frontmatter.styre ? (
              <>
                <Typography variant="h5" gutterBottom>
                  Personer
                </Typography>
                {Object.keys(frontmatter.styre).map((item: any) => (
                  <>
                    <Card key={item}>
                      <Box py={3} pt={5} px={5}>
                        <Typography variant="body2">{frontmatter.styre[item].navn}</Typography>
                        <Typography variant="body2">
                          {frontmatter.styre[item].tittel} - {frontmatter.styre[item].mail}
                        </Typography>
                      </Box>
                    </Card>
                    <br />
                  </>
                ))}
              </>
            ) : (
              " "
            )}
          </Grid>
        </Grid>
      </Container>
    </Layout>
  );
};

export const getStaticPaths = async () => {
  const paths = getPostsSlugs("organizations");

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps = async ({ params }: ArticleProps) => {
  const { slug } = params;

  const postData = getPostBySlug(slug, "organizations");

  if (!postData.previousPost) {
    postData.previousPost = null;
  }

  if (!postData.nextPost) {
    postData.nextPost = null;
  }

  return { props: postData };
};

const HeadingRenderer = (props: { children: React.ReactNode }) => {
  return (
    <Typography variant="h5" gutterBottom>
      {props.children}
    </Typography>
  );
};

const ParagraphRenderer = (props: { children: React.ReactNode }) => {
  return (
    <Typography variant="body2" paragraph>
      {props.children}
    </Typography>
  );
};

export default Article;
