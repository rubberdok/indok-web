import { Box, Typography } from "@mui/material";
import { Grid } from "@mui/material";
import React from "react";

import { BlogPostType } from "../BlogPostType";

const BlogPost = (props: { post: BlogPostType }) => {
  return (
    <Grid item container direction="column">
      <Grid item>
        <Box component="img" src={props.post.imageURL} alt="Legg inn missing bilde til senere"></Box>
      </Grid>
      <Grid item>
        <Typography>{props.post.title}</Typography>
      </Grid>
      <Grid item>
        <Typography>{props.post.description}</Typography>
      </Grid>
    </Grid>
  );
};

export default BlogPost;
