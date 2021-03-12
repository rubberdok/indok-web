import Layout from "@components/Layout";
import { NextPage } from "next";
import { useRouter } from "next/router";
import React from "react";
import EventDetailPage from "../../components/pages/events/eventDetailPage";

const EventInfo: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;

  return (
    <Layout>
      <div style={{ paddingLeft: "4em", paddingRight: "4em" }}>
        {id && typeof id === "string" && <EventDetailPage eventId={id} />}
      </div>
    </Layout>
  );
};

export default EventInfo;
