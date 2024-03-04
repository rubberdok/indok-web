"use client";

import { Grid } from "@mui/material";
import BlogPost from "./components/BlogPost";
import { BlogPostType } from "./BlogPost";

const Blog = () => {

  const blogPosts: BlogPostType[] = [ {}, {} ];

  return <div>

    <Grid container direction={"column"}>
      {blogPosts.map( post => <BlogPost post={post} /> )}
    </Grid>

  </div>;

};

export default Blog;
