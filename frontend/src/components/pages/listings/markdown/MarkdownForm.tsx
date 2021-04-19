import { Tab, Tabs, TextField } from "@material-ui/core";
import ReactMarkdown from "react-markdown";
import renderers from "@components/pages/listings/markdown/renderers";
import { ChangeEventHandler, useState } from "react";

/**
 * @description component for a simple markdown form with a live preview
 * @todo Add a more user-friendly way of interacting with markdown, i.e. allowing users to set heading level through a UI
 */
const MarkdownForm: React.FC<{
  markdown: string;
  onChange?: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>;
  onBlur?: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>;
}> = ({ markdown, onChange, onBlur }) => {
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
        <TextField 
          id="markdown"
          fullWidth
          multiline
          rows={20}
          variant="outlined"
          value={markdown}
          onChange={onChange}
          onBlur={onBlur}
        />
      )}
      {view === "preview" && <ReactMarkdown renderers={renderers}>{markdown}</ReactMarkdown>}
    </>
  );
};

export default MarkdownForm;
