import Template from "@components/pages/about/Template";
import { Typography } from "@material-ui/core";
import { getPostBySlug, getPostsSlugs } from "@utils/posts";
import { NextPage } from "next";
import React from "react";
import ReactMarkdown from "react-markdown";

type ArticleProps = {
  params: {
    slug: string;
  };
  post: {
    content: string;
    excerpt: string;
  };
  frontmatter: {
    description: string;
    title: string;
    image?: string;
  };
  slug: string;
};

const Article: NextPage<ArticleProps> = ({ post, frontmatter, slug }) => {
  return (
    <Template
      img={frontmatter.image}
      title={frontmatter.title}
      page={slug}
      description={frontmatter.description || post.excerpt}
    >
      <ReactMarkdown
        escapeHtml={false}
        source={post.content}
        renderers={{ heading: HeadingRenderer, paragraph: ParagraphRenderer }}
      />
    </Template>
  );
};

export const getStaticPaths = async () => {
  const paths = getPostsSlugs("about");

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps = async ({ params }: ArticleProps) => {
  const { slug } = params;

  const postData = getPostBySlug(slug, "about");

  if (!postData.previousPost) {
    postData.previousPost = null;
  }

  if (!postData.nextPost) {
    postData.nextPost = null;
  }

  return { props: postData };
};

const HeadingRenderer = (props: { children: React.ReactNode }) => {
  return (
    <Typography variant="h5" gutterBottom>
      {props.children}
    </Typography>
  );
};

const ParagraphRenderer = (props: { children: React.ReactNode }) => {
  return (
    <Typography variant="body2" paragraph>
      {props.children}
    </Typography>
  );
};

export default Article;
