import Layout from "@components/Layout";
import { NextPage } from "next";
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
                <div style={{ marginLeft: "auto", marginRight: "auto" }}>
                    {numberId && <EventDetailPage eventId={numberId} />}
                </div>
            </div>
            <div style={{ marginTop: "2em" }}>
                <Button style="primary" link="/events" back>
                    Tilbake til arrangementer{" "}
                </Button>{" "}
            </div>
        </Layout>
    );
};

export default EventInfo;
