import { Box, Typography } from "@mui/material";
import { Grid } from "@mui/material";
import React from "react";

import { BlogPostType } from "../BlogPostType";

const BlogPost = (props: { post: BlogPostType }) => {
  const margin = "10px";

  return (
    <Box sx={{ boxShadow: "-2px 10px 5px 0px #aaaaaa", padding: 3, mt: 3 }}>
      <Grid container direction="row" margin={margin}>
        <Grid item container md={8} direction={"column"}>
          <Typography>
            {props.post.author} <span style={{ color: "grey" }}>{props.post.date}</span>
          </Typography>
          <Typography variant="h3">{props.post.title}</Typography>
          <Typography>{props.post.description}</Typography>
        </Grid>
        <Grid item md={4}>
          <Box sx={{ width: 200, height: 200, overflow: "hidden" }}>
            <img height="100%" src={props.post.imageURL} alt="Legg inn missing bilde til senere" />
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default BlogPost;
