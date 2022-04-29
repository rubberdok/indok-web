import EventCreator from "@components/pages/events/EventCreator";
import { Button, Container, styled } from "@mui/material";
import Link from "next/link";
import React from "react";
import Layout from "src/layouts";
import { HEADER_DESKTOP_HEIGHT, HEADER_MOBILE_HEIGHT } from "src/theme/constants";
import { NextPageWithLayout } from "../_app";

const RootStyle = styled("div")(({ theme }) => ({
  paddingTop: HEADER_MOBILE_HEIGHT,
  [theme.breakpoints.up("md")]: {
    paddingTop: HEADER_DESKTOP_HEIGHT,
  },
}));

/**
 * Component for showing the create event page
 */

const CreateEventsPage: NextPageWithLayout = () => {
  return (
    <RootStyle>
      <Container>
        <Link href="/events" passHref>
          <Button color="primary">Tilbake til arrangementer</Button>
        </Link>
        <EventCreator />
      </Container>
    </RootStyle>
  );
};

CreateEventsPage.getLayout = (page: React.ReactElement) => <Layout>{page}</Layout>;

export default CreateEventsPage;
