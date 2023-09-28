"use client";

import { useState } from "react";

function MarkdownEditor() {
  const [markdown, setMarkdown] = useState<string>("");

  const renderMarkdown = (text: string) => {
    let renderedText = text;

    // Render bold text: **bold**
    renderedText = renderedText.replace(/\/b\{(.*?)\}/g, "<strong>$1</strong>");

    // Render italic text: *italic*
    renderedText = renderedText.replace(/\/i\{(.*?)\}/g, "<em>$1</em>");

    // Render links to photos: ![alt text](url)
    renderedText = renderedText.replace(/\/img\{(.*?)\}/g, "<img src='$1' />");

    // Render links to websites: [link text](url)
    renderedText = renderedText.replace(/\[(.*?)\]\((.*?)\)/g, "<a href='$2' target='_blank'>$1</a>");

    return { __html: renderedText };
  };

  return (
    <div>
      <textarea
        value={markdown}
        onChange={(e) => setMarkdown(e.target.value)}
        style={{ width: "100%", minHeight: "100px" }}
      />
      <div style={{ marginTop: "20px" }}>
        <strong>Rendered Markdown:</strong>
        <div dangerouslySetInnerHTML={renderMarkdown(markdown)} />
      </div>
    </div>
  );
}

export default function Blog() {
  return (
    <div>
      <h1>Markdown Editor</h1>
      <MarkdownEditor />
    </div>
  );
}