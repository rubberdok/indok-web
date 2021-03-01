import Layout from "@components/Layout";
import { Container } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import { getSortedPosts } from "@utils/posts";
import { NextPage } from "next";
import Link from "next/link";
import React from "react";

type OrganizationsProps = {
  slug: string;
  frontmatter: {
    description: string;
    title: string;
    image?: string;
  };
  posts: Array<any>;
};

const OrganizationsPage: NextPage<OrganizationsProps> = ({ posts }) => {
  return (
    <Layout>
      <Container>
        <Grid container>
          {posts.map(({ frontmatter: { title, description }, slug }: OrganizationsProps) => (
            <Grid key={slug} item xs={3}>
              <h3>
                <Link href={"./organizations/[slug]"} as={`./organizations/${slug}`}>
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

export default OrganizationsPage;
