import { gql } from "@apollo/client";

export const QUERY_ALL_BLOG_POSTS_THUMBNAIL = gql`
  query Blog($blogId: ID!) {
    blog(blogId: $blogId) {
      blogPosts {
        id
        title
        publishDate
      }
    }
  }
`;

export const QUERY_BLOG_POST = gql`
  query BlogPost($blogPostId: ID!) {
    blogPost(blogPostId: $blogPostId) {
      title
      text
      publishDate
      author {
        firstName
        lastName
      }
    }
  }
`;
