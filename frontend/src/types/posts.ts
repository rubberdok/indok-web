export type Post = {
  slug: string;
  frontmatter: {
    [x: string]: any;
  };
  excerpt: string | undefined;
  content: string;
};
