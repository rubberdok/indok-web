import { useLazyQuery } from "@apollo/client";
import Layout from "@components/Layout";
import { QUERY_ATTENDEE_REPORT_ORG } from "@graphql/events/queries";
import { Button, Container, Grid, Typography } from "@material-ui/core";
import GetAppIcon from "@material-ui/icons/GetApp";
import { promptDownloadFromPayload } from "@utils/exports";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { default as React } from "react";

const OrganizationDetailPage: NextPage = () => {
  const router = useRouter();
  const { orgId } = router.query;
  const numberId = orgId && typeof orgId === "string" && parseInt(orgId) ? orgId : "";

  const [getAttendeeReport, { loading }] = useLazyQuery(QUERY_ATTENDEE_REPORT_ORG, {
    onCompleted: (data) => promptDownloadFromPayload(JSON.parse(data.attendeeReport)),
  });

  const wrapDownloadButton = (eventId: string, filetype: string) => {
    return (
      <Button onClick={() => getAttendeeReport({ variables: { id: eventId, filetype: filetype } })}>
        <GetAppIcon fontSize="small" />
        {filetype}
      </Button>
    );
  };

  if (loading) {
    return <Typography>Loading ...</Typography>;
  }

  return (
    <Layout>
      <Container>
        <Typography variant="h1">Adminside for Organisasjon {numberId}</Typography>
        <Typography variant="body1">
          Dette er adminsiden til en gitt organisasjon. Her skal man kunne se en oversikt over for eksempel alle
          nåværende åpne arrangementer (tenk et kort per arrangement med oppsumert info som antall påmeldte). Andre ting
          som er nyttig her vil være liste over åpne vervstillinger, administrere medlemmer, kanskje
          organisasjonsspesifikk info elns.
        </Typography>

        <Grid container>
          <Grid item>{wrapDownloadButton(numberId, "csv")}</Grid>
          <Grid item>{wrapDownloadButton(numberId, "xlsx")}</Grid>
          <Grid item>{wrapDownloadButton(numberId, "html")}</Grid>
        </Grid>
      </Container>
    </Layout>
  );
};

export default OrganizationDetailPage;
