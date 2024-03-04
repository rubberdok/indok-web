import React from "react";
import { BlogPostType } from "../BlogPost";
import { Box } from "@mui/material";
import { Grid } from "@mui/material"

const BlogPost = (props: {post: BlogPostType}) => {

  return <Grid item>
    <Box bgcolor={"blue"} width={"100px"} height={"100px"} margin={"10px"}>

    </Box>
  </Grid>

};

export default BlogPost;
