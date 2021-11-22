import { useLazyQuery } from "@apollo/client";
import { QUERY_ATTENDEE_REPORT } from "@graphql/events/queries";
import { Box, Button, ButtonGroup, CircularProgress, Typography } from "@mui/material";
import { promptDownloadFromPayload } from "@utils/exports";
import React from "react";
import GetAppIcon from "@mui/icons-material/GetApp";

const AttendeeExport: React.FC<{ eventId: number }> = ({ eventId }) => {
  const [getAttendeeReport, { loading: attendeeReportLoading }] = useLazyQuery(QUERY_ATTENDEE_REPORT, {
    onCompleted: (data) => promptDownloadFromPayload(JSON.parse(data.attendeeReport)),
  });

  const wrapDownloadButtonReport = (eventId: number, filetype: string) => {
    return (
      <Button
        startIcon={<GetAppIcon fontSize="small" />}
        onClick={() => getAttendeeReport({ variables: { eventId: eventId, filetype: filetype } })}
      >
        {filetype}
      </Button>
    );
  };

  if (attendeeReportLoading) {
    return <CircularProgress />;
  }
  return (
    <Box>
      <Typography gutterBottom variant="overline">
        Eksportér påmeldingsliste
      </Typography>
      <br />
      <ButtonGroup variant="text" color="primary" aria-label="text primary button group">
        {wrapDownloadButtonReport(eventId, "csv")}
        {wrapDownloadButtonReport(eventId, "xlsx")}
        {wrapDownloadButtonReport(eventId, "html")}
      </ButtonGroup>
    </Box>
  );
};

export default AttendeeExport;
