import { Tab, Tabs, TextField } from "@material-ui/core";
import ReactMarkdown from "react-markdown";
import renderers from "@components/pages/listings/markdown/renderers";
import { ChangeEventHandler, useState } from "react";

/**
 * @description component for a simple markdown form with a live preview
 * @todo Add a more user-friendly way of interacting with markdown, i.e. allowing users to set heading level through a UI
 * @param markdown: string, the string containing the markdown content
 * @param onTextChange: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>, the function to be called when editing the markdown content.
 */
const MarkdownForm: React.FC<{
  markdown: string;
  onTextChange: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>;
}> = ({ markdown, onTextChange }) => {
  //state to manage whether
  const [preview, setPreview] = useState<0 | 1>(0);

  return (
    <>
      <Tabs
        value={preview}
        indicatorColor="primary"
        textColor="primary"
        onChange={(_, preview) => setPreview(preview)}
        aria-label="Redigering og forhåndsvisningstabs"
        variant="scrollable"
        scrollButtons="auto"
      >
        <Tab label="Rediger" />
        <Tab label="Forhåndsvisning" />
      </Tabs>
      {preview ? (
        <ReactMarkdown renderers={renderers}>{markdown}</ReactMarkdown>
      ) : (
        <TextField fullWidth rows={20} variant="outlined" value={markdown} multiline onChange={onTextChange} />
      )}
    </>
  );
};

export default MarkdownForm;
