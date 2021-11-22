import { useLazyQuery, useQuery } from "@apollo/client";
import Layout from "@components/Layout";
import { QUERY_ATTENDEE_REPORTS, QUERY_ATTENDEE_REPORT_ORG } from "@graphql/events/queries";
import { GET_ORGANIZATION } from "@graphql/orgs/queries";
import { Event } from "@interfaces/events";
import { Organization } from "@interfaces/organizations";
import {
  Box,
  Button,
  ButtonGroup,
  Card,
  CardContent,
  CardHeader,
  Chip,
  CircularProgress,
  Divider,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import makeStyles from '@mui/styles/makeStyles';
import GetAppIcon from "@mui/icons-material/GetApp";
import { promptDownloadFromPayload } from "@utils/exports";
import dayjs from "dayjs";
import { NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { default as React, useState } from "react";
import OrganizationListings from "@components/pages/listings/organization/OrganizationListings";

interface HeaderValuePair<T> {
  header: string;
  field: keyof T;
}

const eventFields: HeaderValuePair<Event>[] = [
  { header: "Navn", field: "title" },
  { header: "Antall Plasser", field: "availableSlots" },
];

const useStyles = makeStyles(() => ({
  hover: {
    "&:hover": {
      cursor: "pointer",
    },
  },
}));

const OrganizationDetailPage: NextPage = () => {
  const router = useRouter();
  const { orgId } = router.query;
  const orgNumberId = parseInt(orgId as string);

  const [selectedEvents, setSelectedEvents] = useState(["1", "2", "3"]);

  const [getAttendeeReportOrg, { loading: loadingReport }] = useLazyQuery(QUERY_ATTENDEE_REPORT_ORG, {
    onCompleted: (data) => promptDownloadFromPayload(JSON.parse(data.attendeeReportOrg)),
  });

  const [getAttendeeReports, { loading: loadingReports }] = useLazyQuery(QUERY_ATTENDEE_REPORTS, {
    onCompleted: (data) => promptDownloadFromPayload(JSON.parse(data.attendeeReports)),
  });

  const classes = useStyles();

  const { data, loading } = useQuery<{ organization: Organization }, { orgId: number }>(GET_ORGANIZATION, {
    variables: { orgId: orgNumberId },
    skip: Number.isNaN(orgNumberId),
  });

  if (loading || loadingReport || loadingReports) {
    return <CircularProgress />;
  }

  const wrapDownloadButtonReportOrg = (orgId: number, filetype: string) => {
    return (
      <Button
        startIcon={<GetAppIcon fontSize="small" />}
        onClick={() => getAttendeeReportOrg({ variables: { orgId: orgId, filetype: filetype } })}
      >
        {filetype}
      </Button>
    );
  };

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
    <Layout>
      <Box m={10}>
        {data?.organization?.events ? (
          <Grid container spacing={10}>
            <Grid item>
              <Typography variant="h1" align="center">
                {data.organization.name}
              </Typography>
            </Grid>
            <Grid item container>
              <Grid item xs>
                <Card variant="outlined">
                  <CardHeader title="Arrangementer" />
                  <Divider variant="middle" />
                  <CardContent>
                    <TableContainer>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell>Dato</TableCell>
                            {eventFields.map((field: HeaderValuePair<Event>) => (
                              <TableCell key={`header-${field.header}`}>{field.header}</TableCell>
                            ))}
                            <TableCell>Antall påmeldte</TableCell>
                            <TableCell>Status</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {data.organization.events.map((event: Event) => (
                            <Link href={`${orgNumberId}/events/${event.id}`} passHref key={event.id}>
                              <TableRow className={classes.hover} hover>
                                <TableCell>{dayjs(event.startTime).format("HH:mm DD-MM-YYYY")}</TableCell>
                                {eventFields.map((field: HeaderValuePair<Event>) => (
                                  <TableCell key={`event-${event.id}-cell-${field.field}`}>
                                    {event[field.field]}
                                  </TableCell>
                                ))}
                                <TableCell>{event.usersAttending?.length}</TableCell>
                                <TableCell>
                                  <Chip
                                    label={event.isFull ? "Fullt" : "Ledige Plasser"}
                                    color={event.isFull ? "default" : "secondary"}
                                  />
                                </TableCell>
                              </TableRow>
                            </Link>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
            <Grid item xs={6}>
              <Grid item xs={12}>
                <Typography variant="overline" display="block">
                  Eksportér for alle mine arrangementer
                </Typography>
              </Grid>
              <ButtonGroup variant="text" color="primary" aria-label="text primary button group">
                <Grid item>{wrapDownloadButtonReportOrg(orgNumberId, "csv")}</Grid>
                <Grid item>{wrapDownloadButtonReportOrg(orgNumberId, "xlsx")}</Grid>
                <Grid item>{wrapDownloadButtonReportOrg(orgNumberId, "html")}</Grid>
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
            {data?.organization?.listings && <OrganizationListings organization={data.organization} />}
          </Grid>
        ) : null}
      </Box>
    </Layout>
  );
};

export default OrganizationDetailPage;
