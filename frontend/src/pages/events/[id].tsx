import { styled } from "@mui/material";
import { useRouter } from "next/router";
import React from "react";
import Layout from "src/layouts";
import { HEADER_DESKTOP_HEIGHT, HEADER_MOBILE_HEIGHT } from "src/theme/constants";
import EventDetailPage from "../../components/pages/events/EventDetails";
import { NextPageWithLayout } from "../_app";

/**
 * Component for showing the detail page of an event
 */

const RootStyle = styled("div")(({ theme }) => ({
  paddingTop: HEADER_MOBILE_HEIGHT,
  [theme.breakpoints.up("md")]: {
    paddingTop: HEADER_DESKTOP_HEIGHT,
  },
}));

const EventInfo: NextPageWithLayout = () => {
  const router = useRouter();
  const { id } = router.query;

  return <RootStyle>{id && typeof id === "string" ? <EventDetailPage eventId={id} /> : <></>}</RootStyle>;
};

EventInfo.getLayout = (page: React.ReactElement) => <Layout>{page}</Layout>;

export default EventInfo;
