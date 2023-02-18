import { MailOutline, Phone } from "@mui/icons-material";
import { Card, CardContent, CardHeader, Chip, Container, Divider, Grid, Typography } from "@mui/material";
import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from "next";
import { useRouter } from "next/router";
import ReactMarkdown from "react-markdown";

import { Link } from "@/components";
import * as markdownComponents from "@/components/MarkdownForm/components";
import { Title } from "@/components/Title";
import { Layout } from "@/layouts/Layout";
import { NextPageWithLayout } from "@/pages/_app";
import { Article, getPostBySlug, getPostsSlugs } from "@/utils/posts";

const ArticlePage: NextPageWithLayout<InferGetStaticPropsType<typeof getStaticProps>> = ({ post, frontmatter }) => {
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
              <Card>
                <CardHeader title="Styret" />
                <CardContent>
                  <Grid container direction="column" spacing={2}>
                    {Object.entries(frontmatter.board).map(([key, member], index, array) => (
                      <Grid item key={key}>
                        <Typography variant="body1">{member.name}</Typography>
                        <Typography variant="caption" gutterBottom>
                          {member.title}
                        </Typography>
                        <br />
                        {member.mail && (
                          <Chip
                            component={Link}
                            href={`mailto:${member.mail}`}
                            size="small"
                            label={member.mail}
                            icon={<MailOutline />}
                          />
                        )}
                        {member.mail && member.phoneNumber && <br />}
                        {member.phoneNumber && <Chip size="small" label={member.phoneNumber} icon={<Phone />} />}
                        {index < array.length - 1 && <Divider sx={{ mt: 2 }} />}
                      </Grid>
                    ))}
                  </Grid>
                </CardContent>
              </Card>
            )}
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

ArticlePage.getLayout = (page) => <Layout>{page}</Layout>;

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

export default ArticlePage;
