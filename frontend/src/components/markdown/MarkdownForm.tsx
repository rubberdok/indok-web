import { Tab, Tabs, TextField } from "@mui/material";
import ReactMarkdown from "react-markdown";
import * as markdownComponents from "@components/markdown/components";
import { ChangeEventHandler, useState } from "react";

/**
 * Component for a simple markdown form with a live preview.
 * @todo Add a more user-friendly way of interacting with markdown, i.e. allowing users to set heading level through a UI.
 *
 * Props:
 * - the markdown text to edit/render
 * - onTextChange callback
 */
const MarkdownForm: React.FC<{
  markdown: string;
  onTextChange: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>;
}> = ({ markdown, onTextChange }) => {
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
      {view === "edit" && (
        <TextField fullWidth multiline rows={20} variant="outlined" value={markdown} onChange={onTextChange} />
      )}
      {view === "preview" && <ReactMarkdown components={markdownComponents}>{markdown}</ReactMarkdown>}
    </>
  );
};

export default MarkdownForm;
