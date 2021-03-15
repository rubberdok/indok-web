import { useLazyQuery, useQuery } from "@apollo/client";
import Layout from "@components/Layout";
import EmailForm from "@components/pages/events/EventEmail";
import { ADMIN_GET_EVENT, QUERY_ATTENDEE_REPORT } from "@graphql/events/queries";
import { Event } from "@interfaces/events";
import { User } from "@interfaces/users";
import {
  Box,
  Button,
  ButtonGroup,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CircularProgress,
  Grid,
  List,
  ListItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@material-ui/core";
import GetAppIcon from "@material-ui/icons/GetApp";
import { promptDownloadFromPayload } from "@utils/exports";
import dayjs from "dayjs";
import { NextPage } from "next";
import { useRouter } from "next/router";

interface HeaderValuePair<T> {
  header: string;
  field: keyof T;
}

const userFields: HeaderValuePair<User>[] = [
  { header: "Brukernavn", field: "username" },
  { header: "Navn", field: "firstName" },
  { header: "Mobilnummer", field: "phoneNumber" },
  { header: "Klassetrinn", field: "gradeYear" },
];

const stringEventFields: HeaderValuePair<Event>[] = [
  { header: "Tittel", field: "title" },
  { header: "Kort beskrivelse", field: "shortDescription" },
  { header: "Beskrivelse", field: "description" },
  { header: "Lokasjon", field: "location" },
  { header: "Starttid", field: "startTime" },
  { header: "Slutttid", field: "endTime" },
  { header: "Tilgjengelige plasser", field: "availableSlots" },
  { header: "Påmeldingsfrist", field: "deadline" },
  { header: "Påmeldingsdato", field: "signupOpenDate" },
];

const dateEventFields: HeaderValuePair<Event>[] = [
  { header: "Starttid", field: "startTime" },
  { header: "Slutttid", field: "endTime" },
  { header: "Påmeldingsfrist", field: "deadline" },
  { header: "Påmeldingsdato", field: "signupOpenDate" },
];

const EventAdminPage: NextPage = () => {
  const router = useRouter();
  const { eventId } = router.query;
  const eventNumberID = parseInt(eventId as string);

  const [getAttendeeReport, { loading: attendeeReportLoading }] = useLazyQuery(QUERY_ATTENDEE_REPORT, {
    onCompleted: (data) => promptDownloadFromPayload(JSON.parse(data.attendeeReport)),
  });

  const { loading, data } = useQuery<{ event: Event }, { id: number }>(ADMIN_GET_EVENT, {
    variables: { id: eventNumberID },
    skip: Number.isNaN(eventNumberID),
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

  if (loading || attendeeReportLoading) {
    return <CircularProgress />;
  }

  const renderInfo = (label: string, value: string) => (
    <ListItem key={`${label}-${value}`}>
      <Typography>
        <Box fontWeight={1000} m={1} display="inline">
          {`${label}: `}
        </Box>
        {value}
      </Typography>
    </ListItem>
  );

  return (
    <Layout>
      {data?.event ? (
        <Box m={10}>
          <Grid container direction="column" spacing={5}>
            <Grid item>
              <Typography variant="h1" align="center">
                {data.event.title}
              </Typography>
            </Grid>
            <Grid item container spacing={5}>
              <Grid item xs>
                <Card variant="outlined">
                  <CardHeader title="Generell informasjon" />
                  <CardContent>
                    <List>
                      {stringEventFields.map((headerPair: HeaderValuePair<Event>) =>
                        renderInfo(headerPair.header, data.event[headerPair.field] as string)
                      )}
                      {dateEventFields.map((headerPair: HeaderValuePair<Event>) =>
                        renderInfo(
                          headerPair.header,
                          data.event[headerPair.field]
                            ? dayjs(data.event[headerPair.field] as string).format("HH:mm DD-MM-YYYY")
                            : ""
                        )
                      )}
                    </List>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs>
                <Card variant="outlined">
                  <CardHeader title="Påmeldte" />
                  <CardActions>
                    {eventId ? <EmailForm eventId={eventId} /> : <CircularProgress color="primary" />}
                    <Box>
                      <Typography gutterBottom variant="overline">
                        Eksportér påmeldingsliste
                      </Typography>
                      <br />
                      <ButtonGroup variant="text" color="primary" aria-label="text primary button group">
                        {wrapDownloadButtonReport(eventNumberID, "csv")}
                        {wrapDownloadButtonReport(eventNumberID, "xlsx")}
                        {wrapDownloadButtonReport(eventNumberID, "html")}
                      </ButtonGroup>
                    </Box>
                  </CardActions>
                  <CardContent>
                    {data?.event?.usersAttending?.length !== 0 ? (
                      <TableContainer style={{ maxHeight: 600 }}>
                        <Table>
                          <TableHead>
                            <TableRow>
                              {userFields.map((field) => (
                                <TableCell key={`user-header-${field.header}`}>{field.header}</TableCell>
                              ))}
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {data?.event?.usersAttending?.map((user: User) => (
                              <TableRow key={`user-row-${user.id}`}>
                                {userFields.map((field) => (
                                  <TableCell key={`user-${user.id}-cell--${field.field}`}>
                                    {user[field.field]}
                                  </TableCell>
                                ))}
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    ) : (
                      <Typography align="center" variant="body1">
                        Ingen påmeldte
                      </Typography>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Grid>
        </Box>
      ) : null}
    </Layout>
  );
};

export default EventAdminPage;
