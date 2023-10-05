"use client";

import { ButtonBase, Container, Stack, Typography, useScrollTrigger } from "@mui/material";
import { useState } from "react";
import Grid from '@mui/material/Grid';
export default function Blog() {

    return (
        <Container sx={{width: "75%", marginTop: "40px"}}>

            <Editor/>

        </Container>
    );

}

function Toolbar() {

    return (
        <div
            style={{width: "100%"}}
            >
            <Stack
            direction="row"
            sx={{
                borderWidth: "1px",
                borderColor: "gray",
                borderStyle: "dashed"
            }}
        >
            <ToolbarButton
                insert="/b{}"
                body={<strong>B</strong>}
            />
            <ToolbarButton
                insert="/i{}"
                body={<strong><i>I</i></strong>}
            />
        </Stack>
        </div>
    )

}

function ToolbarButton({insert, body}: {insert: string, body: any}) {
    return (
        <ButtonBase
            sx={{
                fontSize: "20px",
                minWidth: "50px",
                minHeight: "50px"
            }}
            onClick={() => {
                let e = document.getElementById("input") as HTMLTextAreaElement
                let cursor = e.selectionStart
                e.value = e.value.substring(0, cursor) + insert + e.value.substring(cursor)
                e.focus()
                e.selectionStart = cursor + 3
                e.selectionEnd = cursor + 3
            }}
        >
            {body}
        </ButtonBase>)
}

function Editor() {

    const [text, setText] = useState("");

    function rendered() {

        const outputString = text
            .replace(/\/b\{(.*?)\}/g, (match, p1) => `<strong>${p1}</strong>`)
            .replaceAll(/\/i\{(.*?)\}/g, (match, p1) => `<i>${p1}</i>`)
            .replaceAll("\n", (match) => `<br>`)
            .replaceAll(" ", (match) => " ")
            .replaceAll(/\/s([0-9]*)\{(.*?)\}/g, (match, p1, p2) => `<span style="font-size: ${p1}px">${p2}</span>`)


        return <div
            dangerouslySetInnerHTML={{__html: outputString}}
        />
    }

    return (
        <Grid container columnSpacing={2}>

            <Grid item md={6}>
                <Toolbar/>
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
                        fontSize: "100%"
                    }}
                    autoFocus={true}
                    onChange={(e) => {setText(e.target.value); console.log(e.target.value)}}
                    placeholder="Skriv den jævla bloggen din her ..."
                />
            </Grid>

            <Grid md={6} item>
                {rendered()}
            </Grid>

        </Grid>
    )

}