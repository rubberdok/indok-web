import { useLazyQuery } from "@apollo/client";
import Layout from "@components/Layout";
import { QUERY_ATTENDEE_REPORTS, QUERY_ATTENDEE_REPORT_ORG } from "@graphql/events/queries";
import { Button, ButtonGroup, Container, Grid, TextField, Typography } from "@material-ui/core";
import GetAppIcon from "@material-ui/icons/GetApp";
import { promptDownloadFromPayload } from "@utils/exports";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { default as React, useState } from "react";

const OrganizationDetailPage: NextPage = () => {
  const router = useRouter();
  const { orgId } = router.query;
  const typedOrgId = orgId && typeof orgId === "string" && parseInt(orgId) ? orgId : "";
  const [selectedEvents, setSelectedEvents] = useState(["1", "2", "3"]);

  const [getAttendeeReportOrg, { loading: loadingReport }] = useLazyQuery(QUERY_ATTENDEE_REPORT_ORG, {
    onCompleted: (data) => promptDownloadFromPayload(JSON.parse(data.attendeeReportOrg)),
  });

  const [getAttendeeReports, { loading: loadingReports }] = useLazyQuery(QUERY_ATTENDEE_REPORTS, {
    onCompleted: (data) => promptDownloadFromPayload(JSON.parse(data.attendeeReports)),
  });

  const wrapDownloadButtonReportOrg = (orgId: string, filetype: string) => {
    return (
      <Button onClick={() => getAttendeeReportOrg({ variables: { orgId: orgId, filetype: filetype } })}>
        <GetAppIcon fontSize="small" />
        {filetype}
      </Button>
    );
  };

  const wrapDownloadButtonReports = (filetype: string) => {
    return (
      <Button
        onClick={() => {
          return getAttendeeReports({ variables: { eventIds: selectedEvents, filetype: filetype } });
        }}
      >
        <GetAppIcon fontSize="small" />
        {filetype}
      </Button>
    );
  };

  if (loadingReport || loadingReports) {
    return <Typography>Loading ...</Typography>;
  }

  return (
    <Layout>
      <Container>
        <Typography variant="h1">Adminside for Organisasjon {typedOrgId}</Typography>
        <Typography variant="body1">
          Dette er adminsiden til en gitt organisasjon. Her skal man kunne se en oversikt over for eksempel alle
          nåværende åpne arrangementer (tenk et kort per arrangement med oppsumert info som antall påmeldte). Andre ting
          som er nyttig her vil være liste over åpne vervstillinger, administrere medlemmer, kanskje
          organisasjonsspesifikk info elns.
        </Typography>

        <br />
        <Grid container>
          <Grid item xs={12}>
            <Typography variant="overline" display="block">
              Eksportér for alle mine arrangementer
            </Typography>
          </Grid>
          <ButtonGroup variant="text" color="primary" aria-label="text primary button group">
            <Grid item>{wrapDownloadButtonReportOrg(typedOrgId, "csv")}</Grid>
            <Grid item>{wrapDownloadButtonReportOrg(typedOrgId, "xlsx")}</Grid>
            <Grid item>{wrapDownloadButtonReportOrg(typedOrgId, "html")}</Grid>
          </ButtonGroup>
        </Grid>

        <br />
        <Grid container>
          <Grid item xs={12}>
            <Typography variant="overline" display="block">
              Eksportér for utvalgte arrangementer
            </Typography>
          </Grid>
          <ButtonGroup variant="text" color="primary" aria-label="text primary button group">
            <Grid item>{wrapDownloadButtonReports("csv")}</Grid>
            <Grid item>{wrapDownloadButtonReports("xlsx")}</Grid>
            <Grid item>{wrapDownloadButtonReports("html")}</Grid>
          </ButtonGroup>

          <Grid item xs={12}>
            <br />
            <TextField
              value={selectedEvents.join(",")}
              onChange={(e) => setSelectedEvents(e.target.value.replace(/ /g, "").split(","))}
              label="Selected event ID's"
              size="small"
              helperText="Comma-separated list of event ID's"
            />
          </Grid>
        </Grid>
      </Container>
    </Layout>
  );
};

export default OrganizationDetailPage;
