import { useMutation, useQuery } from "@apollo/client";
import Layout from "@components/Layout";
import AttendeeExport from "@components/pages/events/AttendeeExport";
import EmailForm from "@components/pages/events/email/EmailForm";
import EditEvent from "@components/pages/events/EventEditor";
import { ADMIN_EVENT_SIGN_OFF } from "@graphql/events/mutations";
import { ADMIN_GET_EVENT } from "@graphql/events/queries";
import { Event, SignUp } from "@interfaces/events";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
  Button,
  CardActions,
  CardHeader,
  CircularProgress,
  Grid,
  IconButton,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
  makeStyles,
} from "@material-ui/core";
import { Edit } from "@material-ui/icons";
import DeleteIcon from "@material-ui/icons/Delete";
import { Alert } from "@material-ui/lab";
import dayjs from "dayjs";
import { NextPage } from "next";
import { useRouter } from "next/router";
import React, { useState } from "react";

const useStyles = makeStyles(() => ({
  accordion: {
    "&.MuiAccordion-root:before": {
      backgroundColor: "white",
    },
  },
}));

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
  { header: "Krever ekstrainformasjon", field: "hasExtraInformation" },
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
  const classes = useStyles();

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
      <Grid item xs={12} lg={6} key={`${label}-${val}`}>
        <Typography>
          <Box fontWeight={1000} m={1} display="inline">
            {`${label}: `}
          </Box>
          {val}
        </Typography>
      </Grid>
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
          <Box mb={10}>
            {openEditEvent && (
              <EditEvent open={openEditEvent} onClose={() => setOpenEditEvent(false)} event={data.event} />
            )}
            <Grid>
              <Grid container direction="column" spacing={5}>
                <Grid item>
                  <Typography variant="h2" align="center">
                    {data.event.title}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          </Box>
          <Accordion elevation={0} defaultExpanded={true} classes={{ root: classes.accordion }}>
            <Box py={2}>
              <AccordionSummary aria-controls="panel1a-content" id="panel1a-header">
                <Grid container alignItems="center" justifyContent="space-between">
                  <Grid item xs={12} sm="auto">
                    <Box ml={5}>
                      <CardHeader titleTypographyProps={{ variant: "h4" }} title="Generell informasjon" />
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm="auto">
                    <Box mx={5} my={2}>
                      <CardActions>
                        <Button variant="outlined" startIcon={<Edit />} onClick={() => setOpenEditEvent(true)}>
                          Rediger
                        </Button>
                      </CardActions>
                    </Box>
                  </Grid>
                </Grid>
              </AccordionSummary>
            </Box>
            <AccordionDetails>
              <Box m={4} mt={0}>
                <Grid container spacing={2}>
                  {stringEventFields.map((headerPair: HeaderValuePair<Event>) =>
                    renderInfo(
                      headerPair.header,
                      data.event[headerPair.field] ? (data.event[headerPair.field] as string) : ""
                    )
                  )}
                  <Grid item xs={12} lg={6} key={"allowedGradeYears"}>
                    <Typography>
                      <Box fontWeight={1000} m={1} display="inline">
                        Åpent for:
                      </Box>
                      {data.event.allowedGradeYears
                        .slice(1, data.event.allowedGradeYears.length)
                        .reduce((res, grade) => `${res}, ${grade}.klasse`, `${data.event.allowedGradeYears[0]}.klasse`)}
                    </Typography>
                  </Grid>
                  {dateEventFields.map((headerPair: HeaderValuePair<Event>) =>
                    renderInfo(
                      headerPair.header,
                      data.event[headerPair.field]
                        ? dayjs(data.event[headerPair.field] as string).format("kl.HH:mm, DD-MM-YYYY")
                        : ""
                    )
                  )}
                  {data?.event?.attendable ? (
                    <React.Fragment>
                      <Grid item xs={12} lg={6} key={"signupOpenDate"}>
                        <Typography>
                          <Box fontWeight={1000} m={1} display="inline">
                            Påmelding åpner:
                          </Box>
                          {data.event.attendable?.signupOpenDate
                            ? dayjs(data.event.attendable?.signupOpenDate as string).format("kl.HH:mm, DD-MM-YYYY")
                            : ""}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} lg={6} key={"deadline"}>
                        <Typography>
                          <Box fontWeight={1000} m={1} display="inline">
                            Påmeldingsfrist:
                          </Box>
                          {data.event.attendable?.deadline
                            ? dayjs(data.event.attendable?.deadline as string).format("kl.HH:mm, DD-MM-YYYY")
                            : ""}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} lg={6} key={"bindingSingup"}>
                        <Typography>
                          <Box fontWeight={1000} m={1} display="inline">
                            Bindende påmelding:
                          </Box>
                          {data.event.attendable?.bindingSignup === true ? "Ja" : "Nei"}
                        </Typography>
                      </Grid>
                      {data.event?.availableSlots && (
                        <Grid item xs={12} lg={6} key={"AvailableSlots"}>
                          <Typography>
                            <Box fontWeight={1000} m={1} display="inline">
                              Tilgjengelige plasser:
                            </Box>
                            {data.event.availableSlots.length > 1
                              ? data.event.availableSlots.map((dist) => (
                                  <Typography key={String(dist.category)}>
                                    {dist.category}.klasse: {dist.availableSlots} plasser
                                  </Typography>
                                ))
                              : `${data.event.availableSlots[0].availableSlots}`}
                          </Typography>
                        </Grid>
                      )}
                    </React.Fragment>
                  ) : null}
                </Grid>
              </Box>
            </AccordionDetails>
          </Accordion>
          {data?.event?.attendable ? (
            <Accordion>
              <AccordionSummary aria-controls="panel2a-content" id="panel2a-header">
                <Grid container alignItems="center" justifyContent="space-between">
                  <Grid item xs={12} md={12} lg="auto">
                    <Box ml={5}>
                      <CardHeader titleTypographyProps={{ variant: "h4" }} title="Påmeldte" />
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm="auto">
                    <Box ml={5} my={2}>
                      <CardActions>
                        <AttendeeExport eventId={eventNumberID} />
                      </CardActions>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm="auto">
                    <Box mx={5} my={2}>
                      <CardActions>
                        {eventId ? <EmailForm eventId={eventId} /> : <CircularProgress color="primary" />}
                      </CardActions>
                    </Box>
                  </Grid>
                </Grid>
              </AccordionSummary>
              <AccordionDetails>
                <Box sx={{ mb: 2, mx: 5, width: "-webkit-fill-available" }}>
                  {data?.event?.usersAttending?.length !== 0 ? (
                    <TableContainer style={{ maxHeight: 600, overflowX: "scroll" }}>
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
                                    <IconButton aria-label="delete" onClick={() => handleDeleteSignUp(signUp.user.id)}>
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
                </Box>
              </AccordionDetails>
            </Accordion>
          ) : null}
          {data?.event?.attendable ? (
            <Accordion>
              <AccordionSummary aria-controls="panel3a-content" id="panel3a-header">
                <Box ml={5} my={2}>
                  <CardHeader titleTypographyProps={{ variant: "h4" }} title="Venteliste" />
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                <Box sx={{ mb: 2, mx: 5, width: "-webkit-fill-available" }}>
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
                </Box>
              </AccordionDetails>
            </Accordion>
          ) : null}
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
