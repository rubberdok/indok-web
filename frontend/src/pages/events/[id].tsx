import Layout from "@components/Layout";
import { Button } from "@material-ui/core";
import { NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import EventDetailPage from "../../components/pages/events/eventDetailPage";

const EventInfo: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;

  return (
    <Layout>
      <div style={{ marginTop: "2em" }}>
        <Link href="/events">
          <Button color="primary">Tilbake til arrangementer</Button>
        </Link>
      </div>
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
    </Layout>
  );
};

export default EventInfo;
