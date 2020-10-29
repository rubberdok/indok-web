import Layout from "@components/Layout";
import Navbar from "@components/navbar/Navbar";
import { NextPage } from "next";
import Link from "next/link";
import Button from "@components/ui/Button";
import { useRouter } from "next/router";
import React from "react";
import EventDetailPage from "../../components/pages/events/eventDetailPage";

const EventInfo: NextPage = () => {
    const router = useRouter();
    const { id } = router.query;
    const numberId = typeof id === "string" && parseInt(id);

    return (
        <Layout>
            <Navbar />
            <div
                style={{
                    border: "solid",
                    borderRadius: "1em",
                    padding: "2em",
                    backgroundColor: "#fff",
                    borderColor: "#6A9997",
                    width: "70%",
                    margin: "0 auto",
                }}
            >
                {" "}
                <div style={{ marginLeft: "auto", marginRight: "auto" }}>
                    {numberId && <EventDetailPage eventId={numberId} />}
                    <Button url="/events"> Tilbake til arrangementer </Button>
                </div>
            </div>
        </Layout>
    );
};

export default EventInfo;
