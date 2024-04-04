import fs from "fs";

import matter from "gray-matter";

type BoardMember = {
  name: string;
  mail: string;
  title: string;
  phoneNumber: string;
};

type Frontmatter = {
  description: string;
  title: string;
  logo?: string;
  alt?: string;
  tag?: string;
  image?: string;
  board: Record<string, BoardMember>;
};

type Post = {
  content: string;
  excerpt?: string;
};

export type Article = {
  slug: string;
  frontmatter: Frontmatter;
  post: Post;
  next?: Article | null;
  prev?: Article | null;
};

const isFrontMatter = (obj: Record<string, unknown>): obj is Frontmatter => {
  return obj.description !== undefined && obj.title !== undefined;
};

export const getPostsFolders = (page: string) => {
  const postsFolders = fs.readdirSync(`${process.cwd()}/content/${page}/`).map((file) => ({
    filename: `${file}`,
  }));

  return postsFolders;
};

export const getSortedPosts = (page: string): Article[] => {
  const postFolders = getPostsFolders(page);

  const posts = postFolders.map(({ filename }) => {
    const markdownWithMetadata = fs.readFileSync(`content/${page}/${filename}`).toString();

    const { data, excerpt, content }: matter.GrayMatterFile<string> = matter(markdownWithMetadata);

    let frontmatter: Frontmatter;
    if (isFrontMatter(data)) {
      frontmatter = data;
    } else {
      throw new Error(`Frontmatter is not defined for ${filename}`);
    }

    const post = {
      content,
      excerpt,
    };

    const slug = filename.replace(".md", "");

    return {
      slug,
      frontmatter,
      post,
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

export const getPostBySlug = (slug: string, page: string): Article | undefined => {
  const posts = getSortedPosts(page);

  const postIndex = posts.findIndex(({ slug: postSlug }) => postSlug === slug);

  if (postIndex === -1) {
    return undefined;
  }

  const { frontmatter, post } = posts[postIndex];

  const next: Article | null = postIndex >= 0 && postIndex < posts.length - 1 ? posts[postIndex + 1] : null;
  const prev: Article | null = postIndex > 1 && postIndex <= posts.length ? posts[postIndex - 1] : null;

  return { frontmatter, post, next, prev, slug };
};
