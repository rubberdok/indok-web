import { NextPage } from "next";
import Link from "next/link";
import React from "react";
import Navbar from "@components/navbar/Navbar";

import CreateEvent from "../../components/pages/events/createEvent";

const CreateEventsPage: NextPage = () => {
    return (
        <div>
            <Navbar />
            <div
                style={{
                    border: "solid",
                    borderRadius: "1em",
                    padding: "2em",
                    backgroundColor: "#fff",
                    borderColor: "#6A9997",
                    width: "450px",
                    margin: "0 auto",
                }}
            >
                {" "}
                <div style={{ marginLeft: "auto", marginRight: "auto" }}>
                    <CreateEvent />
                </div>
            </div>

            <Link href="/events"> Tilbake til arrangementer </Link>
        </div>
    );
};

export default CreateEventsPage;
