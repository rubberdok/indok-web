import Layout from "@components/Layout";
import EmailForm from "@components/pages/events/EventEmail";
import { Container, Typography } from "@material-ui/core";
import { NextPage } from "next";
import { useRouter } from "next/router";
import React from "react";

const EventAdminPage: NextPage = () => {
  const router = useRouter();
  const { eventId } = router.query;
  const numberId = typeof eventId === "string" && parseInt(eventId);
  console.log(eventId, numberId);

  return (
    <Layout>
      <Container>
        <Typography variant="h1">Adminside for Event {numberId}</Typography>
        <Typography variant="body1">
          Dette er adminsiden for et gitt arrangement. Her skal man kunne detaljert admin-informasjon angående eventet
          og kunne redigere eventet. Man skal kunne se en liste over påmeldte (navn, trinn, tlf(korona), allergier,
          extra_info) og ha mulighet til å eksportere dette som CSV-fil (eller noe som kan åpnes i excel). Tenker på
          /events/ og /events/[id] burde man kunne finne en link som tar deg til denne siden dersom du er superuser
          eller medlem av organisasjonen som arrangerer arrangementet.
        </Typography>
        {eventId ? <EmailForm eventId={eventId} /> : <p>Laster...</p>}
      </Container>
    </Layout>
  );
};

export default EventAdminPage;
