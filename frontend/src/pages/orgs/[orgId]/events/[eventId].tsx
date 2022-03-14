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
  CircularProgress,
  Container,
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
} from "@material-ui/core";
import { Edit } from "@material-ui/icons";
import DeleteIcon from "@material-ui/icons/Delete";
import { Alert } from "@material-ui/lab";
import theme from "@styles/theme";
import dayjs from "dayjs";
import { NextPage } from "next";
import { useRouter } from "next/router";
import React, { useState } from "react";

type HeaderValuePair<T> = {
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
  { header: "Lokasjon", field: "location" },
  { header: "Krever ekstrainformasjon", field: "hasExtraInformation" },
  { header: "Åpent for", field: "allowedGradeYears"},
  { header: "Starttid", field: "startTime" },
  { header: "Slutttid", field: "endTime" },
  { header: "Påmelding åpner", field: "signupOpenDate" },
  { header: "Påmeldingsfrist", field: "deadline" },
  { header: "Bindende påmelding", field: "bindingSignup" },
  { header: "Tilgjengelige plasser", field: "slotDistribution" },
];

const dateFormat = (date: string) => {
  const formattedDate = dayjs(date).format("kl.HH:mm, DD-MM-YYYY")
  return (formattedDate == "Invalid Date") ? date : formattedDate;
}


const General: React.FC<{ event: Event, openFor: string | undefined, slotDist: string | undefined }> = ({ event, openFor, slotDist }) => {
  return (
    <Accordion elevation={0} defaultExpanded={true}>
      <AccordionSummary>
        <Grid container direction="row" justifyContent="space-between" alignItems="center">
          <Grid item>
            <Typography variant="h4">Generell informasjon</Typography>
          </Grid>
        </Grid>
      </AccordionSummary>
      <AccordionDetails>
        <Grid container direction="row" justifyContent="space-between" spacing={2}>
          {stringEventFields.filter(({ field }) => event[field])
            .map(({ header, field }) => (
              event[field] && ((header != "Åpent for" || !!openFor) && ((header != "Tilgjengelige plasser" || !!slotDist) && (
              <Grid item xs={12} lg={6} key={`${header}-${event[field]}`}>
                <Grid container direction="row">
                  <Typography>
                  <Box fontWeight="bold" m={1} display="inline">
                    {`${header}: `}
                  </Box>
                  {header == "Åpent for"  ? openFor : header == "Tilgjengelige plasser" ? slotDist : 
                  typeof event[field] === "boolean" ? ((event[field] == true) ? "Ja" : "Nei") : dateFormat(event[field])}
                  </Typography>
                </Grid>
              </Grid>
            )))))}
        </Grid>
      </AccordionDetails>
    </Accordion>
  )
}
const Attending: React.FC<{ event: Event, signOffLoading: boolean, handleDeleteSignUp: (userId: string) => void}> = ({ event, signOffLoading, handleDeleteSignUp}) => {
  return (
   <Accordion>
      <AccordionSummary aria-controls="panel1a-content" id="panel1a-header">
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item xs={12} sm="auto">
              <Typography variant="h4">
                Påmeldte
              </Typography>
          </Grid>
        </Grid>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item xs={12} sm="auto">
            <AttendeeExport eventId={parseInt(event.id)} />
          </Grid>
        </Grid>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item xs={12} sm="auto">
            {event.id ? <EmailForm eventId={event.id} /> : <CircularProgress color="primary" />}
          </Grid>
        </Grid>
      </AccordionSummary>
      <AccordionDetails>
        {event?.usersAttending?.length !== 0 ? (
          <TableContainer style={{ maxHeight: 600, overflowX: "scroll" }}>
            <Table>
              <TableHead>
                <TableRow>
                  {signUpFields.map((field: any) => (
                    <TableCell key={`user-header-${field.header}`}>{field.header}</TableCell>
                  ))}
                  <TableCell key={`user-header-delete`} />
                </TableRow>
            </TableHead>
              <TableBody>
                {event?.usersAttending?.map((signUp: SignUp) => (
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
      </AccordionDetails>
    </Accordion>
  )
}
const Waiting: React.FC<{ event: Event }> = ({ event }) => {
  return (
   <Accordion>
      <AccordionSummary aria-controls="panel1a-content" id="panel1a-header">
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item xs={12} sm="auto">
              <Typography variant="h4">
              Venteliste
              </Typography>
          </Grid>
        </Grid>
      </AccordionSummary>
      <AccordionDetails>        
        {event?.usersOnWaitingList?.length !== 0 ? (
          <TableContainer style={{ maxHeight: 600, overflowX: "scroll" }}>
            <Table>
              <TableHead>
                <TableRow>
                  {signUpFields.map((field: any) => (
                    <TableCell key={`user-header-${field.header}`}>{field.header}</TableCell>
                  ))}
                </TableRow>
            </TableHead>
              <TableBody>
                {event?.usersOnWaitingList?.map((signUp: SignUp) => (
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
      </AccordionDetails>
    </Accordion>
  )
}


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

  const [openSignOffErrorSnackbar, setOpenSignOffErrorSnackbar] = useState(false);
  const [openSignOffSuccessSnackbar, setOpenSignOffSuccessSnackbar] = useState(false);


  const [openEditEvent, setOpenEditEvent] = useState(false);

  if (loading) {
    return <CircularProgress />;
  }

  const openFor = (data?.event) ? [...data.event.allowedGradeYears].splice(1,data.event.allowedGradeYears.length)
  .reduce((res, grade) => `${res}, ${grade}.klasse`, `${data.event.allowedGradeYears[0]}.klasse`) : undefined;

  const slotDist = (data?.event && data.event.slotDistribution) ? (data.event.slotDistribution.length > 1 ? data.event.slotDistribution.map((year, amount) => (
    <Typography key={String(year)}>
      {year}.klasse: {amount} plasser
    </Typography>
  )).toString()
: `${data.event.slotDistribution[0].amount}`) : undefined;
  

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

  const Feedback: React.FC<{ success: boolean }> = ({ success }) => {
    return <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={(success) ? openSignOffSuccessSnackbar : openSignOffErrorSnackbar}
        autoHideDuration={3000}
      onClose={() => { (success) ? setOpenSignOffSuccessSnackbar(false) : setOpenSignOffErrorSnackbar(false) }}
      >
      <Alert elevation={6} variant="filled" severity={(success) ? "success" : "error"}>
          {(success) ? "Avmelding fullført" : signOffError ? signOffError.message : "Avmelding feilet"}
        </Alert>
      </Snackbar>
  }

  return (
    <Layout>
      <Container>
      <Grid container direction="row" justifyContent="center">
          <Grid
            container
            direction="column"
            justifyContent="center"
            style={{ marginTop: theme.spacing(4), marginBottom: theme.spacing(4) }}
            spacing={4}
            md={8}
          >
            <Grid item>
              <Grid
                container
                direction="row"
                justifyContent="center" 
                alignItems="flex-end"
                style={{ marginTop: theme.spacing(4), marginBottom: theme.spacing(4) }}
              >
                <Grid item>
                  <Typography variant="h2" align="center">
                    {data?.event.title}
                  </Typography>
                </Grid>
                <Grid item>
                  <Button
                    variant="text"
                    disableRipple
                    startIcon={<Edit />}
                    onClick={() => setOpenEditEvent(true)}
                  />
                </Grid>
              </Grid>
            </Grid>
            <Grid item>
              {data?.event && (<>
                <General event={data?.event} openFor={openFor} slotDist={slotDist}></General>
                <Attending handleDeleteSignUp={handleDeleteSignUp} signOffLoading={signOffLoading} event={data?.event}></Attending>
                <Waiting event={data?.event}></Waiting>
              </>
              )}
            </Grid>
          </Grid>
        </Grid>
      </Container>
      {data?.event && (openEditEvent && (<EditEvent open={openEditEvent} onClose={() => setOpenEditEvent(false)} event={data?.event} />))}
      <Feedback success={false}></Feedback>
      <Feedback success={true}></Feedback>
    </Layout>
  );
};

export default EventAdminPage;
