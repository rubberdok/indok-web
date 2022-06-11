import Layout from "@components/Layout";
import { NextPage } from "next";
import { useRouter } from "next/router";
import React from "react";
import EventDetailPage from "../../components/pages/events/EventDetails";

/**
 * Component for showing the detail page of an event
 */

const EventInfo: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;

  return <Layout>{id && typeof id === "string" ? <EventDetailPage eventId={id} /> : <></>}</Layout>;
};

export default EventInfo;
