import { useLazyQuery } from "@apollo/client";
import Layout from "@components/Layout";
import { QUERY_ATTENDEE_REPORT } from "@graphql/events/queries";
import { Button, CircularProgress, Container, Grid, Typography } from "@material-ui/core";
import GetAppIcon from "@material-ui/icons/GetApp";
import EmailForm from "@components/pages/events/EventEmail";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { promptDownloadFromPayload } from "@utils/exports";

const EventAdminPage: NextPage = () => {
  const router = useRouter();
  const { eventId, orgId } = router.query;
  const typedEventId = eventId && typeof eventId === "string" && parseInt(eventId) ? eventId : "";

  const [getAttendeeReport, { loading }] = useLazyQuery(QUERY_ATTENDEE_REPORT, {
    onCompleted: (data) => promptDownloadFromPayload(JSON.parse(data.attendeeReport)),
  });

  const wrapDownloadButton = (eventId: string, filetype: string) => {
    return (
      <Button onClick={() => getAttendeeReport({ variables: { id: eventId, filetype: filetype } })}>
        <GetAppIcon fontSize="small" />({filetype})
      </Button>
    );
  };

  if (loading) {
    return <Typography>Loading ...</Typography>;
  }

  return (
    <Layout>
      <Container>
        <Typography variant="h1">
          Adminside for Event {eventId} for organisasjon {orgId}.
        </Typography>
        <Typography variant="body1">
          Dette er adminsiden for et gitt arrangement. Her skal man kunne detaljert admin-informasjon angående eventet
          og kunne redigere eventet. Man skal kunne se en liste over påmeldte (navn, trinn, tlf(korona), allergier,
          extra_info) og ha mulighet til å eksportere dette som CSV-fil (eller noe som kan åpnes i excel). Tenker på
          /events/ og /events/[id] burde man kunne finne en link som tar deg til denne siden dersom du er superuser
          eller medlem av organisasjonen som arrangerer arrangementet.
        </Typography>

        <Grid container>
          <Grid item>{wrapDownloadButton(typedEventId, "csv")}</Grid>
          <Grid item>{wrapDownloadButton(typedEventId, "xlsx")}</Grid>
          <Grid item>{wrapDownloadButton(typedEventId, "html")}</Grid>
        </Grid>
        {eventId ? <EmailForm eventId={eventId} /> : <CircularProgress color="primary" />}
      </Container>
    </Layout>
  );
};

export default EventAdminPage;
