import Layout from "@components/Layout";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useQuery } from "@apollo/client";
import { BlogPost } from "../../../types/blogs";
import { QUERY_ALL_BLOG_POSTS_THUMBNAIL } from "@graphql/blogs/queries";
import { BlogPostThumbnail } from "@components/pages/blogs/BlogPostThumbnail";
import { Grid, Container, Box } from "@material-ui/core";

const MainBlogPage: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const { data, error } = useQuery<{ blogPost: BlogPost[] }>(QUERY_ALL_BLOG_POSTS_THUMBNAIL, {
    variables: { blogId: id },
  });

  const BlogPostThumbnails: React.VFC = () => {
    return (
      <Grid container>
        <BlogPostThumbnail title={"innlegg"} />
        <BlogPostThumbnail title={"innlegg"} />
        <BlogPostThumbnail title={"innlegg"} />
      </Grid>
    );
  };

  return (
    <Layout>
      <Container>
        <Box>
          <BlogPostThumbnails />
        </Box>
      </Container>
    </Layout>
  );
};

export default MainBlogPage;
