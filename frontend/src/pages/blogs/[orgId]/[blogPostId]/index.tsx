import { useRouter } from "next/router";
import { NextPage } from "next";
import { useQuery } from "@apollo/client";
import { BlogPost } from "src/types/blogs";
import { QUERY_BLOG_POST } from "@graphql/blogs/queries";
import Layout from "@components/Layout";
import { BlogPostDetail } from "@components/pages/blogs/BlogPostDetail";

const DetailBlogPost: NextPage = () => {
  const router = useRouter();
  const { blogPostId } = router.query;
  const { data } = useQuery<{ blogPost: BlogPost }>(QUERY_BLOG_POST, {
    variables: { blogPostId: parseInt(blogPostId as string) },
  });

  console.log(data);

  return (
    <>
      <Layout>
        {data?.blogPost ? (
          <BlogPostDetail
            title={data.blogPost.title}
            text={data.blogPost.text}
            publishDate={data.blogPost.publishDate}
            firstName={data.blogPost.author.firstName}
            lastName={data.blogPost.author.lastName}
          />
        ) : null}
      </Layout>
    </>
  );
};

export default DetailBlogPost;
