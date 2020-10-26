import { NextPage } from "next";
import Link from "next/link";
import Layout from "../components/Layout";
import React, { Component } from "react";
import AllDocuments from "../components/pages/archive/allDocuments";
import { useState } from "react";

const FetchThumbnails = () => {
    return (
        <div>
            <img
                src="https://drive.google.com/thumbnail?id=1ReOTT8xJVh5NTDdYI8ZF8NYHS9L1Er_uUXFZ7zicayI"
                style={{
                    maxWidth: "80%",
                    maxHeight: "80%",
                    transform: "scale(-50%, -50%)",
                }}
                alt="docu"
            />
        </div>
    );
};

const Button = () => {
    const [active1, setActive1] = useState(false);
    const [active2, setActive2] = useState(false);
    const [active3, setActive3] = useState(false);
    const [active4, setActive4] = useState(false);
    const [active5, setActive5] = useState(false);
    const [active6, setActive6] = useState(false);

    return (
        <div>
            <h1>Filtrer dokumenter</h1>
            <button style={{ background: active1 ? "#065A5A" : "transparent" }} onClick={() => setActive1(!active1)}>
                Budsjetter og vedtekter
            </button>
            <button
                style={{ background: active2 ? "#065A5A" : "transparent", margin: "0.5%" }}
                onClick={() => setActive2(!active2)}
            >
                Vedtekter og statutter
            </button>
            <button
                style={{ background: active3 ? "#065A5A" : "transparent", margin: "0.5%" }}
                onClick={() => setActive3(!active3)}
            >
                Årbøker
            </button>
            <button
                style={{ background: active4 ? "#065A5A" : "transparent", margin: "0.5%" }}
                onClick={() => setActive4(!active4)}
            >
                Retningslinjer
            </button>
            <button
                style={{ background: active5 ? "#065A5A" : "transparent", margin: "0.5%" }}
                onClick={() => setActive5(!active5)}
            >
                Referater
            </button>
            <button
                style={{ background: active6 ? "#065A5A" : "transparent", margin: "0.5%" }}
                onClick={() => setActive6(!active6)}
            >
                Annet
            </button>
        </div>
    );
};

const Archive: NextPage = () => (
    <Layout>
        <div>
            <Button />
            <h1> Arkiv</h1>
            <FetchThumbnails />
            <AllDocuments />
        </div>
    </Layout>
);

export default Archive;
