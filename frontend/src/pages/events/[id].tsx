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
  const numberId = typeof id === "string" && parseInt(id);

  return (
    <Layout>
      <div style={{ marginTop: "2em" }}>
        <Link href="/events">
          <Button color="primary">Tilbake til arrangementer</Button>
        </Link>
      </div>
      <div style={{ paddingLeft: "4em", paddingRight: "4em" }}>
        {numberId && <EventDetailPage eventId={numberId} />}
      </div>
    </Layout>
  );
};

export default EventInfo;
