import { User } from "../interfaces/users";
import { Organization } from "../interfaces/organizations";

export type Blog = {
  name: string;
  description: string;
  organization: Organization;
};

export type BlogPost = {
  title: string;
  text: string;
  publish_date: string;
  author: User;
  blog: Blog;
};
