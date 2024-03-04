"use client";

import { Box, Container } from "@mui/material";

import { BlogPostType } from "./BlogPostType";
import BlogPost from "./components/BlogPost";

const Blog = () => {
  const blogPosts: BlogPostType[] = [
    {
      imageURL: "https://img.freepik.com/free-photo/stunning-square-portrait-adorable-cute-cat_181624-37290.jpg",
      title: "tittel 1",
      description:
        "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Alias aspernatur odit a impedit ad doloribus aut distinctio, illo, ipsa libero mollitia nulla, error voluptatum rem nisi facere dolorem molestias commodi!",
      author: "Mr. Lysen",
      date: "1998-40-01",
    },
    {
      imageURL:
        "https://img.freepik.com/free-photo/cute-domestic-kitten-sits-window-staring-outside-generative-ai_188544-12519.jpg",
      title: "tittel 2",
      description:
        "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Alias aspernatur odit a impedit ad doloribus aut distinctio, illo, ipsa libero mollitia nulla, error voluptatum rem nisi facere dolorem molestias commodi!",
      author: "Torgeir",
      date: "2024-01-01",
    },
  ];

  return (
    <div>
      <Container sx={{ display: "flex", justifyContent: "center" }}>
        <Box sx={{ width: "70%" }}>
          {blogPosts.map((post: BlogPostType, index: number) => (
            <BlogPost post={post} key={index} />
          ))}
        </Box>
      </Container>
    </div>
  );
};

export default Blog;
