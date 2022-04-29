import { Organization } from "@interfaces/organizations";
import { Button, ButtonGroup, Grid, TextField, Typography, CircularProgress } from "@mui/material";
import { useState } from "react";
import { useLazyQuery } from "@apollo/client";
import GetAppIcon from "@mui/icons-material/GetApp";
import { QUERY_ATTENDEE_REPORTS, QUERY_ATTENDEE_REPORT_ORG } from "@graphql/events/queries";
import { promptDownloadFromPayload } from "@utils/exports";

type Props = {
  organization: Organization;
};

const EventsExport: React.FC<Props> = ({ organization }) => {
  const [selectedEvents, setSelectedEvents] = useState(["1", "2", "3"]);

  const [getAttendeeReportOrg, { loading: loadingReport }] = useLazyQuery(QUERY_ATTENDEE_REPORT_ORG, {
    onCompleted: (data) => promptDownloadFromPayload(JSON.parse(data.attendeeReportOrg)),
  });

  const [getAttendeeReports, { loading: loadingReports }] = useLazyQuery(QUERY_ATTENDEE_REPORTS, {
    onCompleted: (data) => promptDownloadFromPayload(JSON.parse(data.attendeeReports)),
  });

  const wrapDownloadButtonReportOrg = (orgId: string, filetype: string) => {
    return (
      <Button
        startIcon={<GetAppIcon fontSize="small" />}
        onClick={() => getAttendeeReportOrg({ variables: { orgId: orgId, filetype: filetype } })}
      >
        {filetype}
      </Button>
    );
  };

  if (loadingReport || loadingReports) {
    return <CircularProgress />;
  }

  const wrapDownloadButtonReports = (filetype: string) => {
    return (
      <Button
        startIcon={<GetAppIcon fontSize="small" />}
        disabled
        onClick={() => {
          return getAttendeeReports({ variables: { eventIds: selectedEvents, filetype: filetype } });
        }}
      >
        {filetype}
      </Button>
    );
  };

  return (
    <Grid container>
      <Grid item xs={6}>
        <Grid item xs={12}>
          <Typography variant="overline" display="block">
            Eksportér for alle mine arrangementer
          </Typography>
        </Grid>
        <ButtonGroup variant="text" color="primary" aria-label="text primary button group">
          <Grid item>{wrapDownloadButtonReportOrg(organization.id, "csv")}</Grid>
          <Grid item>{wrapDownloadButtonReportOrg(organization.id, "xlsx")}</Grid>
          <Grid item>{wrapDownloadButtonReportOrg(organization.id, "html")}</Grid>
        </ButtonGroup>
      </Grid>
      <Grid item xs={6}>
        <Grid item xs={12}>
          <Typography variant="overline" display="block">
            Eksportér for utvalgte arrangementer
          </Typography>
          <TextField
            value={selectedEvents.join(",")}
            onChange={(e) => setSelectedEvents(e.target.value.replace(/ /g, "").split(","))}
            label="Selected event ID's"
            size="small"
            helperText="Comma-separated list of event ID's"
            disabled
          />
        </Grid>
        <Grid item xs={12}>
          <ButtonGroup variant="text" color="primary" aria-label="text primary button group">
            <Grid item>{wrapDownloadButtonReports("csv")}</Grid>
            <Grid item>{wrapDownloadButtonReports("xlsx")}</Grid>
            <Grid item>{wrapDownloadButtonReports("html")}</Grid>
          </ButtonGroup>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default EventsExport;
