"use client";

import { ButtonBase, Container, Stack, Typography } from "@mui/material";
import Grid from "@mui/material/Grid";
import { useState } from "react";
export default function Blog() {
  return (
    <Container sx={{ width: "75%", marginTop: "40px" }}>
      <Editor />
    </Container>
  );
}

function Toolbar() {
  return (
    <div style={{ width: "100%" }}>
      <Stack
        direction="row"
        sx={{
          borderWidth: "1px",
          borderColor: "gray",
          borderStyle: "dashed",
        }}
      >
        <ToolbarButton insert="/b{}" body={<strong>B</strong>} />
        <ToolbarButton
          insert="/i{}"
          body={
            <strong>
              <i>I</i>
            </strong>
          }
        />
        <ToolbarButton insert="/28{}" body={<Typography sx={{ fontSize: "28px" }}>h1</Typography>} />
        <ToolbarButton insert="/24{}" body={<Typography sx={{ fontSize: "24px" }}>h2</Typography>} />
        <ToolbarButton insert="/20{}" body={<Typography sx={{ fontSize: "20px" }}>p</Typography>} />
        <ToolbarButton insert="/img 50{}" body={<Typography sx={{ fontSize: "20px" }}>Img</Typography>} />
        <ToolbarButton insert="/c{}" body={<code>int</code>} />
      </Stack>
    </div>
  );
}

function ToolbarButton({ insert, body }: { insert: string; body: any }) {
  return (
    <ButtonBase
      sx={{
        fontSize: "20px",
        minWidth: "50px",
        minHeight: "50px",
      }}
      onClick={() => {
        const e = document.getElementById("input") as HTMLTextAreaElement;
        const cursor = e.selectionStart;
        e.value = e.value.substring(0, cursor) + insert + e.value.substring(cursor);
        e.focus();
        e.selectionStart = cursor + insert.length - 1;
        e.selectionEnd = cursor + insert.length - 1;
      }}
    >
      {body}
    </ButtonBase>
  );
}

function Editor() {
  const [text, setText] = useState("");

  function rendered() {

    const outputString = text
      .replaceAll(/\/b\{(.*?)\}/g, (_, p1) => `<strong>${p1}</strong>`)
      .replaceAll(/\/i\{(.*?)\}/g, (_, p1) => `<i>${p1}</i>`)
      .replaceAll("\n", (_) => `<br>`)
      .replaceAll(" ", (_) => " ")
      .replaceAll(/\/([0-9]*)\{(.*?)\}/g, (_, p1, p2) => `<span style="font-size: ${p1}px">${p2}</span>`)
      .replaceAll(/\/img([0-9]*)\{(.*?)\}/g, (_, p1, p2) => `<img src=${p1} width="${p2}" ></img>`)
      .replaceAll(/\/c\{(.*?)\}/g, (_, p1) => `<code>${p1}</code>`)



    return <div dangerouslySetInnerHTML={{ __html: outputString }} />;
  }

  return (
    <Grid container columnSpacing={2}>
      <Grid item md={6}>
        <Toolbar />
      </Grid>

      <Grid item md={6}>
        <h2>Rendered</h2>
      </Grid>

      <Grid item md={6}>
        <textarea
          id="input"
          style={{
            width: "100%",
            height: "100vh",
            fontSize: "100%",
          }}
          autoFocus={true}
          onChange={(e) => {
            setText(e.target.value);
          }}
          placeholder="Skriv den jævla bloggen din her ..."
        />
      </Grid>

      <Grid md={6} item>
        {rendered()}
      </Grid>
    </Grid>
  );
}
