import { gql } from "@apollo/client";

export const QUERY_ALL_BLOG_POSTS_THUMBNAIL = gql`
  query AllBlogPostsThumbnail($blogId: ID!) {
    blog(blogId: $blogId) {
      id
      blogPosts {
        id
        title
        publishDate
        author {
          firstName
          lastName
        }
      }
      organization {
        id
        name
      }
    }
  }
`;
