import * as markdownComponents from "@components/MarkdownForm/components";
import Layout, { RootStyle } from "@layouts/Layout";
import { MailOutline, Phone } from "@mui/icons-material";
import { Box, Card, Chip, Container, Divider, Grid, Paper, Typography } from "@mui/material";
import { getPostBySlug, getPostsSlugs } from "@utils/posts";
import { GetStaticPaths, GetStaticProps } from "next";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import { NextPageWithLayout } from "src/pages/_app";
import { Post } from "src/types/posts";

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
    board: Record<string, BoardMember>;
  };
  nextPost: Post | null;
  previousPost: Post | null;
};

type BoardMember = {
  name: string;
  mail: string;
  title: string;
  phoneNumber: string;
};

const Article: NextPageWithLayout<ArticleProps> = ({ post, frontmatter }) => {
  return (
    <>
      <Box mt="-60px" position="relative" sx={{ color: "white", zIndex: -1 }} height={350}>
        <Box
          sx={{
            width: "100%",
            height: "100%",
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
            backgroundImage: `linear-gradient(to top, rgb(0 0 0 / 50%), rgb(0 0 0 / 60%)),
            url(${frontmatter.image})`,
          }}
          display="flex"
          alignItems="center"
          flexDirection="column"
          justifyContent="center"
        ></Box>
      </Box>

      <RootStyle>
        <Container>
          <Grid justifyContent="center" container>
            <Grid item xs={10}>
              <Paper sx={{ marginTop: -112, textAlign: "center" }}>
                <Box mb="56px" py="40px" px="56px" display="flex" alignItems="center" justifyContent="space-between">
                  <Typography variant="h4">{frontmatter.title}</Typography>
                  <img height={100} alt={frontmatter.alt} src={frontmatter.logo}></img>
                </Box>
              </Paper>
            </Grid>
          </Grid>

          <Grid container spacing={4}>
            <Grid item xs={8}>
              <ReactMarkdown components={markdownComponents}>{post.content}</ReactMarkdown>
            </Grid>
            <Grid item xs={4}>
              {frontmatter.board && (
                <>
                  <Typography variant="h5" gutterBottom>
                    Styret
                  </Typography>
                  {Object.entries(frontmatter.board).map(([key, member], index) => (
                    <>
                      {index != 0 && <Divider />}
                      <Card key={key}>
                        <Box p={4}>
                          <Typography variant="body2">{member.name}</Typography>
                          <Typography variant="caption" gutterBottom>
                            {member.title}
                          </Typography>
                          <br />
                          {member.mail && (
                            <Link href={`mailto:${member.mail}`}>
                              <Chip size="small" label={member.mail} icon={<MailOutline />} />
                            </Link>
                          )}
                          {member.mail && member.phoneNumber && <br />}
                          {member.phoneNumber && (
                            <Chip
                              size="small"
                              label={<a href={`tel:${member.phoneNumber}`}>{member.phoneNumber}</a>}
                              icon={<Phone />}
                            />
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
      </RootStyle>
    </>
  );
};

Article.getLayout = function getLayout(page: React.ReactElement) {
  return (
    <Layout>
      <RootStyle>{page}</RootStyle>
    </Layout>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = getPostsSlugs("organizations");

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  if (params) {
    const { slug } = params;
    let postData = undefined;
    if (typeof slug === "string") {
      postData = getPostBySlug(slug, "organizations");
    } else if (Array.isArray(slug)) {
      postData = getPostBySlug(slug[0], "organizations");
    } else {
      return { notFound: true };
    }
    return { props: postData };
  }
  return { notFound: true };
};

export default Article;
