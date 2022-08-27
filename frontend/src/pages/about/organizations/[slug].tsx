import * as markdownComponents from "@components/MarkdownForm/components";
import Title from "@components/Title";
import Layout from "@layouts/Layout";
import { MailOutline, Phone } from "@mui/icons-material";
import { Box, Card, Chip, Container, Divider, Grid, Typography } from "@mui/material";
import { Article, getPostBySlug, getPostsSlugs } from "@utils/posts";
import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import ReactMarkdown from "react-markdown";
import { NextPageWithLayout } from "src/pages/_app";

const Article: NextPageWithLayout<InferGetStaticPropsType<typeof getStaticProps>> = ({ post, frontmatter }) => {
  const router = useRouter();
  const { slug } = router.query;

  return (
    <>
      <Title
        title={frontmatter.title}
        bgImage={frontmatter.image}
        variant="dark"
        ImageProps={{
          placeholder: "empty",
          layout: "fill",
        }}
        breadcrumbs={[
          { href: "/", name: "Hjem" },
          { href: "/about/organization", name: "Om oss" },
          { href: `/about/organizations/${slug}`, name: frontmatter.title },
        ]}
      />

      <Container sx={{ mb: 4 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
            <ReactMarkdown components={markdownComponents}>{post.content}</ReactMarkdown>
          </Grid>
          <Grid item xs={12} md={4}>
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
                        {member.phoneNumber && <Chip size="small" label={member.phoneNumber} icon={<Phone />} />}
                      </Box>
                    </Card>
                  </>
                ))}
              </>
            )}
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

Article.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout>{page}</Layout>;
};

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = getPostsSlugs("organizations");

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps<Article> = async ({ params }) => {
  if (params) {
    const { slug } = params;

    let article: Article | undefined;
    if (typeof slug === "string") {
      article = getPostBySlug(slug, "organizations");
    } else if (Array.isArray(slug)) {
      article = getPostBySlug(slug[0], "organizations");
    } else {
      return { notFound: true };
    }

    if (!article) return { notFound: true };
    return { props: article };
  }

  return { notFound: true };
};

export default Article;
