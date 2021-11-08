import Layout from "@components/Layout";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useQuery } from "@apollo/client";
import { Blog, BlogPost } from "../../../types/blogs";
import { QUERY_ALL_BLOG_POSTS_THUMBNAIL } from "@graphql/blogs/queries";
import { BlogPostThumbnail } from "@components/pages/blogs/BlogPostThumbnail";
import { Grid, Container, Box } from "@material-ui/core";

const MainBlogPage: NextPage = () => {
  const router = useRouter();
  const { orgId } = router.query;
  const { data } = useQuery<{ blog: Blog }>(QUERY_ALL_BLOG_POSTS_THUMBNAIL, {
    variables: { blogId: parseInt(orgId as string) },
  });

  console.log(data);

  const BlogPostThumbnails: React.VFC = () => {
    return (
      <Grid container spacing={2}>
        {data?.blog?.blogPosts
          ? data.blog.blogPosts.map((item: BlogPost) => (
              <BlogPostThumbnail title={item.title} blogId={item.id} key={`blogpost-${item.id}`} />
            ))
          : null}
      </Grid>
    );
  };

  return (
    <Layout>
      <Container>
        <Box mt={10} mb={10}>
          <BlogPostThumbnails />
        </Box>
      </Container>
    </Layout>
  );
};

export default MainBlogPage;
