import Layout from "@components/Layout";
import Button from "@components/ui/Button";
import { NextPage } from "next";
import { useRouter } from "next/router";
import React from "react";
import EventDetailPage from "../../components/pages/events/eventDetailPage";

const EventInfo: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;

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
        <div style={{ marginLeft: "auto", marginRight: "auto" }}>{<EventDetailPage eventId={id} />}</div>
      </div>
      <div style={{ marginTop: "2em" }}>
        <Button styling="primary" link="/events" back>
          Tilbake til arrangementer
        </Button>
      </div>
    </Layout>
  );
};

export default EventInfo;
