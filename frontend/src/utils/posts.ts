import fs from "fs";
import matter from "gray-matter";

export const getPostsFolders = (page: string) => {
  // Get all posts folders located in `content/posts`
  const postsFolders = fs.readdirSync(`${process.cwd()}/content/${page}/`).map((file) => ({
    filename: `${file}`,
  }));

  return postsFolders;
};

export const getSortedPosts = (page: string) => {
  const postFolders = getPostsFolders(page);

  const posts = postFolders.map(({ filename }) => {
    // Get raw content from file
    const markdownWithMetadata = fs.readFileSync(`content/${page}/${filename}`).toString();

    // Parse markdown, get frontmatter data, excerpt and content.
    const { data, excerpt, content } = matter(markdownWithMetadata);

    const frontmatter = {
      ...data,
    };

    // Remove .md file extension from post name
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

  return { frontmatter, post: { content, excerpt } };
};
