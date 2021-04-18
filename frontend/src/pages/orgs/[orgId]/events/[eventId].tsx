import { useMutation, useQuery } from "@apollo/client";
import Layout from "@components/Layout";
import AttendeeExport from "@components/pages/events/AttendeeExport";
import EmailForm from "@components/pages/events/email/EmailForm";
import EditEvent from "@components/pages/events/EventEditor";
import { ADMIN_EVENT_SIGN_OFF } from "@graphql/events/mutations";
import { ADMIN_GET_EVENT } from "@graphql/events/queries";
import { Event, SignUp } from "@interfaces/events";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CircularProgress,
  Grid,
  IconButton,
  List,
  ListItem,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from "@material-ui/core";
import { Edit } from "@material-ui/icons";
import DeleteIcon from "@material-ui/icons/Delete";
import { Alert } from "@material-ui/lab";
import dayjs from "dayjs";
import { NextPage } from "next";
import { useRouter } from "next/router";
import React, { useState } from "react";

interface HeaderValuePair<T> {
  header: string;
  field: keyof T;
}

const signUpFields: HeaderValuePair<SignUp>[] = [
  { header: "Navn", field: "user" },
  { header: "Mobilnummer", field: "userPhoneNumber" },
  { header: "Klassetrinn", field: "userGradeYear" },
  { header: "Matpreferanser", field: "userAllergies" },
  { header: "E-post", field: "userEmail" },
];

const stringEventFields: HeaderValuePair<Event>[] = [
  { header: "Tittel", field: "title" },
  { header: "Kort beskrivelse", field: "shortDescription" },
  // { header: "Beskrivelse", field: "description" },
  { header: "Lokasjon", field: "location" },
  { header: "Tilgjengelige plasser", field: "availableSlots" },
  { header: "Krever ekstrainformasjon", field: "hasExtraInformation" },
  { header: "Bindende påmelding", field: "bindingSignup" },
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

  const { loading, data, refetch } = useQuery<{ event: Event }, { id: number }>(ADMIN_GET_EVENT, {
    variables: { id: eventNumberID },
    skip: Number.isNaN(eventNumberID),
  });

  const [adminEventSignOff, { loading: signOffLoading, error: signOffError }] = useMutation(ADMIN_EVENT_SIGN_OFF);

  const [openEditEvent, setOpenEditEvent] = useState(false);
  const [openSignOffErrorSnackbar, setOpenSignOffErrorSnackbar] = useState(false);
  const [openSignOffSuccessSnackbar, setOpenSignOffSuccessSnackbar] = useState(false);

  if (loading) {
    return <CircularProgress />;
  }

  const renderInfo = (label: string, value: string | boolean) => {
    if (value === "") {
      return;
    }
    const val = typeof value === "boolean" ? (value ? "ja" : "nei") : value;
    return (
      <ListItem key={`${label}-${val}`}>
        <Typography>
          <Box fontWeight={1000} m={1} display="inline">
            {`${label}: `}
          </Box>
          {val}
        </Typography>
      </ListItem>
    );
  };

  const handleDeleteSignUp = (userId: string) => {
    adminEventSignOff({ variables: { eventId: eventNumberID, userId: userId } })
      .then(() => {
        refetch({ id: eventNumberID });
        setOpenSignOffSuccessSnackbar(true);
      })
      .catch(() => {
        setOpenSignOffErrorSnackbar(true);
      });
  };

  return (
    <Layout>
      {data?.event ? (
        <Box m={10}>
          {openEditEvent && (
            <EditEvent open={openEditEvent} onClose={() => setOpenEditEvent(false)} event={data.event} />
          )}
          <Grid container direction="column" spacing={5}>
            <Grid item>
              <Typography variant="h1" align="center">
                {data.event.title}
              </Typography>
            </Grid>
            <Grid item container spacing={5}>
              <Grid item xs={4}>
                <Card variant="outlined">
                  <CardHeader title="Generell informasjon" />
                  <CardActions>
                    <Button startIcon={<Edit />} onClick={() => setOpenEditEvent(true)}>
                      Rediger
                    </Button>
                  </CardActions>
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
              <Grid item xs={8}>
                <Card variant="outlined">
                  <CardHeader title="Påmeldte" />
                  <CardActions>
                    {eventId ? <EmailForm eventId={eventId} /> : <CircularProgress color="primary" />}
                    <AttendeeExport eventId={eventNumberID} />
                  </CardActions>
                  <CardContent>
                    {data?.event?.usersAttending?.length !== 0 ? (
                      <TableContainer style={{ maxHeight: 600 }}>
                        <Table>
                          <TableHead>
                            <TableRow>
                              {signUpFields.map((field) => (
                                <TableCell key={`user-header-${field.header}`}>{field.header}</TableCell>
                              ))}
                              <TableCell key={`user-header-delete`} />
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {data?.event?.usersAttending?.map((signUp: SignUp) => (
                              <TableRow key={`user-row-${signUp.user.id}`}>
                                {signUpFields.map((field) => (
                                  <TableCell key={`user-${signUp.user.id}-cell--${field.field}`}>
                                    {field.header === "Navn"
                                      ? `${signUp.user.firstName} ${signUp.user.lastName}`
                                      : field.header === "Mobilnummer"
                                      ? signUp.userPhoneNumber.slice(3)
                                      : signUp[field.field]
                                      ? signUp[field.field]
                                      : "━"}
                                  </TableCell>
                                ))}
                                <TableCell>
                                  <Tooltip title="Fjern påmelding" arrow>
                                    {signOffLoading ? (
                                      <CircularProgress />
                                    ) : (
                                      <IconButton
                                        aria-label="delete"
                                        onClick={() => handleDeleteSignUp(signUp.user.id)}
                                      >
                                        <DeleteIcon fontSize="small" />
                                      </IconButton>
                                    )}
                                  </Tooltip>
                                </TableCell>
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
              <Grid item xs>
                <Card variant="outlined">
                  <CardHeader title="Venteliste" />
                  <CardContent>
                    {data?.event?.usersOnWaitingList?.length !== 0 ? (
                      <TableContainer style={{ maxHeight: 600 }}>
                        <Table>
                          <TableHead>
                            <TableRow>
                              {signUpFields.map((field) => (
                                <TableCell key={`user-header-${field.header}`}>{field.header}</TableCell>
                              ))}
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {data?.event?.usersOnWaitingList?.map((signUp: SignUp) => (
                              <TableRow key={`user-row-${signUp.user.id}`}>
                                {signUpFields.map((field) => (
                                  <TableCell key={`user-${signUp.user.id}-cell--${field.field}`}>
                                    {field.header === "Navn"
                                      ? `${signUp.user.firstName} ${signUp.user.lastName}`
                                      : field.header === "Mobilnummer"
                                      ? signUp.userPhoneNumber.slice(3)
                                      : signUp[field.field]
                                      ? signUp[field.field]
                                      : "━"}
                                  </TableCell>
                                ))}
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    ) : (
                      <Typography align="center" variant="body1">
                        Ingen på venteliste
                      </Typography>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Grid>
        </Box>
      ) : null}
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={openSignOffErrorSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSignOffErrorSnackbar(false)}
      >
        <Alert elevation={6} variant="filled" severity="error">
          {signOffError ? signOffError.message : "Avmelding feilet"}
        </Alert>
      </Snackbar>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={openSignOffSuccessSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSignOffSuccessSnackbar(false)}
      >
        <Alert elevation={6} variant="filled" severity="success">
          Avmelding fullført
        </Alert>
      </Snackbar>
    </Layout>
  );
};

export default EventAdminPage;
