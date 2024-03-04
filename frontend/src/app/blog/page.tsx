"use client";

import { Grid } from "@mui/material";

import { BlogPostType } from "./BlogPostType";
import BlogPost from "./components/BlogPost";

const Blog = () => {
  const blogPosts: BlogPostType[] = [
    {
      imageURL: "https://img.freepik.com/free-photo/stunning-square-portrait-adorable-cute-cat_181624-37290.jpg",
      title: "tittel 1",
      description:
        "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Alias aspernatur odit a impedit ad doloribus aut distinctio, illo, ipsa libero mollitia nulla, error voluptatum rem nisi facere dolorem molestias commodi!",
    },
    {
      imageURL: "https://img.freepik.com/free-photo/stunning-square-portrait-adorable-cute-cat_181624-37290.jpg",
      title: "tittel 2",
      description:
        "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Alias aspernatur odit a impedit ad doloribus aut distinctio, illo, ipsa libero mollitia nulla, error voluptatum rem nisi facere dolorem molestias commodi!",
    },
  ];

  return (
    <div>
      <Grid container direction={"column"}>
        {blogPosts.map((post: BlogPostType, index: number) => (
          <BlogPost post={post} key={index} />
        ))}
      </Grid>
    </div>
  );
};

export default Blog;
