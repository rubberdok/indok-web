import { useMutation, useQuery } from "@apollo/client";
import Layout from "@components/Layout";
import AttendeeExport from "@components/pages/events/AttendeeExport";
import EmailForm from "@components/pages/events/email/EmailForm";
import EditEvent from "@components/pages/events/EventEditor";
import { ADMIN_EVENT_SIGN_OFF } from "@graphql/events/mutations";
import { ADMIN_GET_EVENT } from "@graphql/events/queries";
import { Event, SlotDistribution } from "@interfaces/events";
import { User } from "@interfaces/users";
import { HeaderValuePair } from "@interfaces/utils";
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
import { Check, Close, Edit } from "@material-ui/icons";
import DeleteIcon from "@material-ui/icons/Delete";
import { Alert } from "@material-ui/lab";
import dayjs from "dayjs";
import { NextPage } from "next";
import { useRouter } from "next/router";
import React, { useState } from "react";

const userFields: HeaderValuePair<User>[] = [
  { header: "Navn", field: "firstName" },
  { header: "Mobilnummer", field: "phoneNumber" },
  { header: "Klassetrinn", field: "gradeYear" },
  { header: "Matpreferanser", field: "allergies" },
  { header: "E-post", field: "email" },
];

const stringEventFields: HeaderValuePair<Event>[] = [
  { header: "Tittel", field: "title" },
  { header: "Kort beskrivelse", field: "shortDescription" },
  // { header: "Beskrivelse", field: "description" },
  { header: "Lokasjon", field: "location" },
];

const dateEventFields: HeaderValuePair<Event>[] = [
  { header: "Starttid", field: "startTime" },
  { header: "Slutttid", field: "endTime" },
];

/**
 * Component for an admin panel for an event, used for viewing and editing an event as well as
 * viewing and editing users signed up (or on the waiting list) for an event
 */

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

  const CellContent = ({ user, field }: { user: User; field: HeaderValuePair<User> }) => {
    if (field.header === "Navn") {
      return (
        <Typography variant="body2">
          {user.firstName} {user.lastName}
        </Typography>
      );
    }
    if (field.header === "Mobilnummer") {
      return <Typography variant="body2">{user.phoneNumber.slice(3)}</Typography>;
    }
    if (typeof user[field.field] == "boolean") {
      return user[field.field] ? <Check color="primary" /> : <Close color="error" />;
    }
    return <Typography variant="body2">{user[field.field] || "━"}</Typography>;
  };

  return (
    <Layout>
      {data?.event ? (
        data?.event?.attendable ? (
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
                          renderInfo(
                            headerPair.header,
                            data.event[headerPair.field] ? (data.event[headerPair.field] as string) : ""
                          )
                        )}
                        {data.event.attendable &&
                          renderInfo("Har ekstrainformasjon", data.event.attendable.hasExtraInformation)}

                        <ListItem key={"allowedGradeYears"}>
                          <Typography>
                            <Box fontWeight={1000} m={1} display="inline">
                              Åpent for:
                            </Box>
                            {data.event.allowedGradeYears
                              .slice(1, data.event.allowedGradeYears.length)
                              .reduce(
                                (res, grade) => `${res}, ${grade}.klasse`,
                                `${data.event.allowedGradeYears[0]}.klasse`
                              )}
                          </Typography>
                        </ListItem>

                        {data.event.attendable?.bindingSignup &&
                          renderInfo("Bindende påmeldingr", data.event.attendable?.bindingSignup)}

                        {!!data.event?.attendable && (
                          <ListItem key={"AvailableSlots"}>
                            <Typography>
                              <Box fontWeight={1000} m={1} display="inline">
                                Tilgjengelige plasser:
                              </Box>
                              {data.event.attendable.slotDistribution.length > 1 &&
                                data.event.attendable.slotDistribution.map((slotDist: SlotDistribution) => (
                                  <Typography key={String(slotDist.gradeGroup)}>
                                    {slotDist.gradeGroup}.klasse: {slotDist.availableSlots} plasser
                                  </Typography>
                                ))}
                              <Typography>Totalt {data.event.attendable.totalAvailableSlots} plasser</Typography>
                            </Typography>
                          </ListItem>
                        )}
                        {dateEventFields.map((headerPair: HeaderValuePair<Event>) =>
                          renderInfo(
                            headerPair.header,
                            data.event[headerPair.field]
                              ? dayjs(data.event[headerPair.field] as string).format("kl.HH:mm, DD-MM-YYYY")
                              : ""
                          )
                        )}

                        {data.event.attendable?.signupOpenDate &&
                          renderInfo(
                            "Påmelding åpner",
                            dayjs(data.event.attendable?.deadline as string).format("kl.HH:mm, DD-MM-YYYY")
                          )}

                        {data.event.attendable?.deadline &&
                          renderInfo(
                            "Påmeldingsfrist",
                            dayjs(data.event.attendable?.deadline as string).format("kl.HH:mm, DD-MM-YYYY")
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
                      {data?.event?.attendable?.usersAttending?.length !== 0 ? (
                        <TableContainer style={{ maxHeight: 600 }}>
                          <Table>
                            <TableHead>
                              <TableRow>
                                {userFields.map((field) => (
                                  <TableCell key={`user-header-${field.header}`}>{field.header}</TableCell>
                                ))}
                                {data.event.product && <TableCell>Betalt?</TableCell>}
                                <TableCell key={`user-header-delete`} />
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {data?.event?.attendable?.usersAttending?.map((user: User) => (
                                <TableRow key={`user-row-${user.id}`}>
                                  {userFields.map((field) => (
                                    <TableCell key={`user-${user.id}-cell--${field.field}`}>
                                      <CellContent user={user} field={field} />
                                    </TableCell>
                                  ))}
                                  {data.event.product && (
                                    <TableCell>
                                      {data.event.attendable?.userAttendance?.hasBoughtTicket ? (
                                        <Check color="primary" />
                                      ) : (
                                        <Close color="error" />
                                      )}
                                    </TableCell>
                                  )}
                                  <TableCell>
                                    <Tooltip title="Fjern påmelding" arrow>
                                      {signOffLoading ? (
                                        <CircularProgress />
                                      ) : (
                                        <IconButton aria-label="delete" onClick={() => handleDeleteSignUp(user.id)}>
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
                      {data?.event?.attendable?.usersOnWaitingList?.length !== 0 ? (
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
                              {data?.event?.attendable?.usersOnWaitingList?.map((user: User) => (
                                <TableRow key={`user-row-${user.id}`}>
                                  {userFields.map((field) => (
                                    <TableCell key={`user-${user.id}-cell--${field.field}`}>
                                      <CellContent user={user} field={field} />
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
        ) : (
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
                <Grid item xs={12}>
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
                          renderInfo(
                            headerPair.header,
                            data.event[headerPair.field] ? (data.event[headerPair.field] as string) : ""
                          )
                        )}
                        <ListItem key={"allowedGradeYears"}>
                          <Typography>
                            <Box fontWeight={1000} m={1} display="inline">
                              Åpent for:
                            </Box>
                            {data.event.allowedGradeYears
                              .slice(1, data.event.allowedGradeYears.length)
                              .reduce(
                                (res, grade) => `${res}, ${grade}.klasse`,
                                `${data.event.allowedGradeYears[0]}.klasse`
                              )}
                          </Typography>
                        </ListItem>

                        {dateEventFields.map((headerPair: HeaderValuePair<Event>) =>
                          renderInfo(
                            headerPair.header,
                            data.event[headerPair.field]
                              ? dayjs(data.event[headerPair.field] as string).format("kl.HH:mm, DD-MM-YYYY")
                              : ""
                          )
                        )}
                      </List>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Grid>
          </Box>
        )
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
