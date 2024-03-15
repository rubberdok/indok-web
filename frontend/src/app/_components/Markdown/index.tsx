import ReactMarkdown, { Options } from "react-markdown";

import * as markdownComponents from "./components";

export const Markdown: React.FC<Options> = ({ children, ...props }) => {
  return (
    <ReactMarkdown components={markdownComponents} {...props}>
      {children}
    </ReactMarkdown>
  );
};
