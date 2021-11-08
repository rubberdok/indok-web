import { User } from "@interfaces/users";

interface Props {
  title: string;
  text: string;
  publishDate: string;
  firstName: string;
  lastName: string;
}

export const BlogPostDetail: React.VFC<Props> = ({ title, text, publishDate, firstName, lastName }) => {
  return (
    <>
      <h1>{title}</h1>
      <h1>{text}</h1>
      <h1>{publishDate}</h1>
      <h1>{firstName}</h1>
      <h1>{lastName}</h1>
    </>
  );
};
