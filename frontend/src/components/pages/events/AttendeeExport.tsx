import { useLazyQuery } from "@apollo/client";
import { GetApp } from "@mui/icons-material";
import { Box, Button, ButtonGroup, CircularProgress, Typography } from "@mui/material";
import React from "react";

import { AttendeeReportDocument } from "@/generated/graphql";
import { promptDownloadFromPayload } from "@/utils/exports";

type Props = { eventId: string };

export const AttendeeExport: React.FC<Props> = ({ eventId }) => {
  const [getAttendeeReport, { loading: attendeeReportLoading }] = useLazyQuery(AttendeeReportDocument, {
    onCompleted: (data) => {
      if (data.attendeeReport) promptDownloadFromPayload(JSON.parse(data.attendeeReport));
    },
  });

  const wrapDownloadButtonReport = (eventId: string, filetype: string) => {
    return (
      <Button
        startIcon={<GetApp fontSize="small" />}
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
