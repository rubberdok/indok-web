import Layout from "@components/Layout";
import { Box, Card, Chip, Container, Divider, Grid, makeStyles, Paper, Typography } from "@material-ui/core";
import MailOutlineIcon from "@material-ui/icons/MailOutline";
import PhoneIcon from "@material-ui/icons/Phone";
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
  avatar: {
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
            {frontmatter.styre && (
              <>
                <Typography variant="h5" gutterBottom>
                  Styret
                </Typography>
                {Object.keys(frontmatter.styre).map((item: any, index) => (
                  <>
                    {index != 0 && <Divider />}
                    <Card key={item}>
                      <Box p={4}>
                        <Typography variant="body2">{frontmatter.styre[item].navn}</Typography>
                        <Typography variant="caption" gutterBottom>
                          {frontmatter.styre[item].tittel}
                        </Typography>
                        <br />
                        {frontmatter.styre[item].mail && (
                          <Chip size="small" label={frontmatter.styre[item].mail} icon={<MailOutlineIcon />} />
                        )}
                        {frontmatter.styre[item].mail && frontmatter.styre[item].telefon && <br />}
                        {frontmatter.styre[item].telefon && (
                          <Chip size="small" label={frontmatter.styre[item].telefon} icon={<PhoneIcon />} />
                        )}
                      </Box>
                    </Card>
                  </>
                ))}
              </>
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
    <Typography variant="body1" paragraph>
      {props.children}
    </Typography>
  );
};

export default Article;
