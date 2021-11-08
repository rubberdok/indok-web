import { User } from "../interfaces/users";
import { Organization } from "../interfaces/organizations";
import internal from "stream";

export type Blog = {
  blogPosts: BlogPost[];
};

export type BlogPost = {
  id: string;
  title: string;
  publishDate: string;
  text: string;
  author: User;
};
