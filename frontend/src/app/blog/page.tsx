"use client";
import { Grid } from "@mui/material";

function Post({ image, author, title, date }: { image: string; author: string; title: string; date: string }) {
  return (
    <p>
      {image}, {author}, {title}, {date}
    </p>
  );
}

function blog() {
  return (
    <Grid>
      <Post image="a" author="b" title="c" date="d"></Post>
    </Grid>
  );
}

export default blog;
