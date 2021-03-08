import Layout from "@components/Layout";
import { Container } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import { getSortedPosts } from "@utils/posts";
import { NextPage } from "next";
import Link from "next/link";
import React from "react";

type Props = {
  slug: string;
  frontmatter: {
    description: string;
    title: string;
    image?: string;
    tag?: string;
  };
  posts: Array<any>;
};

const SportsPage: NextPage<Props> = ({ posts }) => {
  return (
    <Layout>
      <Container>
        <Grid container>
          {posts
            .filter((post) => post.frontmatter.tag == "idrett")
            .map(({ frontmatter: { title, description }, slug }: Props) => (
              <Grid key={slug} item xs={3}>
                <h3>
                  <Link href={"./[slug]"} as={`./${slug}`}>
                    <a className="text-4xl font-bold text-yellow-600 font-display">{title}</a>
                  </Link>
                </h3>
                <p>{description}</p>
              </Grid>
            ))}
        </Grid>
      </Container>
    </Layout>
  );
};

export async function getStaticProps() {
  const posts = getSortedPosts("organizations");

  return {
    props: {
      posts,
    },
  };
}

export default SportsPage;
