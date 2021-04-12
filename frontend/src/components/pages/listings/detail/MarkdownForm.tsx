import { Card, CardContent, Grid, Tab, Tabs, TextField } from "@material-ui/core";
import ReactMarkdown from "react-markdown";
import renderers from "../markdown/renderer";
import { useState } from "react";

interface MarkdownProps {
  markdown: string,
  onChange: (e: any) => void,
}


const Markdown: React.FC<MarkdownProps> = ({ markdown, onChange }) => {
  const [preview, setPreview] = useState(0);

  const handleChange = (_: React.ChangeEvent<{}>, newValue: number) => {
    setPreview(newValue)
  }

  return (
    <Card>
      <CardContent>
        <Tabs 
          value={preview}
          indicatorColor="primary"
          textColor="primary"
          onChange={handleChange}
          aria-label="Redigering og forhåndsvisningstabs"
        >

          <Tab label="Rediger" />
          <Tab label="Forhåndsvisning" />
        </Tabs>
        {preview
          ? <ReactMarkdown
              renderers={renderers}
            >
              {markdown}
            </ReactMarkdown>
          
          : <TextField
              fullWidth
              rows={24}
              variant="outlined"
              value={markdown} 
              multiline
              onChange={onChange}
            />

        } 
      </CardContent>
    </Card>
  )
}

export default Markdown;