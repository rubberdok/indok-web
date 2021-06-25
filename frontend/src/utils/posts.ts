import fs from "fs";
import matter from "gray-matter";
import { Post } from "src/types/posts";

export const getPostsFolders = (page: string) => {
  const postsFolders = fs.readdirSync(`${process.cwd()}/content/${page}/`).map((file) => ({
    filename: `${file}`,
  }));

  return postsFolders;
};

export const getSortedPosts = (page: string): Post[] => {
  const postFolders = getPostsFolders(page);

  const posts = postFolders.map(({ filename }) => {
    const markdownWithMetadata = fs.readFileSync(`content/${page}/${filename}`).toString();

    const { data, excerpt, content }: matter.GrayMatterFile<string> = matter(markdownWithMetadata);

    const frontmatter = {
      ...data,
    };

    const slug = filename.replace(".md", "");

    return {
      slug,
      frontmatter,
      excerpt,
      content,
    };
  });

  return posts;
};

export const getPostsSlugs = (page: string) => {
  const postFolders = getPostsFolders(page);

  const paths = postFolders.map(({ filename }) => ({
    params: {
      slug: filename.replace(".md", ""),
    },
  }));

  return paths;
};

export const getPostBySlug = (slug: string, page: string) => {
  const posts = getSortedPosts(page);

  const postIndex = posts.findIndex(({ slug: postSlug }) => postSlug === slug);

  const { frontmatter, content, excerpt } = posts[postIndex];

  const previousPost: Post | undefined =
    postIndex >= 0 && postIndex < posts.length - 1 ? posts[postIndex + 1] : undefined;
  const nextPost: Post | undefined = postIndex > 1 && postIndex <= posts.length ? posts[postIndex - 1] : undefined;

  return { frontmatter, post: { content, excerpt }, previousPost, nextPost, slug };
};
