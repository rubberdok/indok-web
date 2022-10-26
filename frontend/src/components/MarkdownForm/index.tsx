import { Tab, Tabs, TextField } from "@mui/material";
import { ChangeEventHandler, useState } from "react";
import ReactMarkdown from "react-markdown";

import * as markdownComponents from "./components";

type Props = {
  /** The markdown text to edit/render */
  markdown: string;
  /** Function to call when text changes */
  onTextChange: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>;
};

/**
 * Component for a simple markdown form with a live preview.
 * @todo Add a more user-friendly way of interacting with markdown, i.e. allowing users to set heading level through a UI.
 */
export const MarkdownForm: React.FC<React.PropsWithChildren<Props>> = ({ markdown, onTextChange }) => {
  const [view, setView] = useState<"edit" | "preview">("edit");

  return (
    <>
      <Tabs
        value={view}
        indicatorColor="primary"
        textColor="primary"
        onChange={(_, view) => setView(view)}
        aria-label="Redigering og forhåndsvisningstabs"
        variant="scrollable"
        scrollButtons="auto"
      >
        <Tab label="Rediger" value="edit" />
        <Tab label="Forhåndsvisning" value="preview" />
      </Tabs>
      {view === "edit" && <TextField fullWidth multiline rows={20} value={markdown} onChange={onTextChange} />}
      {view === "preview" && <ReactMarkdown components={markdownComponents}>{markdown}</ReactMarkdown>}
    </>
  );
};
