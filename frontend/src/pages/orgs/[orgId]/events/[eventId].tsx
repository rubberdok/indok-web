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

type HeaderValuePair<T> {
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

  const renderInfo = (label: string, value: string | boolean | undefined) => {
    if (value === "" || typeof value === 'undefined') {
      return;
    }
    const val = typeof value === "boolean" ? (value ? "ja" : "nei") : value;
    return (
      <Grid item xs={12} lg={6} key={`${label}-${val}`}>
        <Typography>
          <Box fontWeight="bold" m={1} display="inline">
            {`${label}: `}
          </Box>
          {val}
        </Typography>
      </Grid>
    );
  };

  function accordionTitle(label: any) {
    return <Grid item xs={12} sm="auto">
      <Box ml={5}>
        <Typography variant="h4">
          {label}
        </Typography>
      </Box>
    </Grid>
  };

  function accordionHeader(titles: any) {
    return <Box py={2}>
      <AccordionSummary aria-controls="panel1a-content" id="panel1a-header">
        <Grid container alignItems="center" justifyContent="space-between">
          {titles.map((title: any) => {
            return accordionTitle(title)
          })}
        </Grid> 
      </AccordionSummary>
    </Box>
  }
  
  function tableHeader(remove = null) {
    return <TableHead>
      <TableRow>
        {signUpFields.map((field: any) => (
          <TableCell key={`user-header-${field.header}`}>{field.header}</TableCell>
        ))}
        {remove}
      </TableRow>
    </TableHead>
  }
  function tableRows(signUp: SignUp, remove: boolean) {
    return <TableRow key={`user-row-${signUp.user.id}`}>
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
      {remove && (<TableCell>
        <Tooltip title="Fjern påmelding" arrow>
          {signOffLoading ? (
            <CircularProgress />
          ) : (
            <IconButton aria-label="delete" onClick={() => handleDeleteSignUp(signUp.user.id)}>
              <DeleteIcon fontSize="small" />
            </IconButton>
          )}
        </Tooltip>
      </TableCell>)}
    </TableRow>
  }

  function tableContainer(users: any, alt: string, header: any=null, remove=false) {
    return <Box sx={{ mb: 2, mx: 5, width: "-webkit-fill-available" }}>
      {users?.length !== 0 ? (
        <TableContainer style={{ maxHeight: 600, overflowX: "scroll" }}>
          <Table>
            {tableHeader(header)}
            <TableBody>
              {users?.map((signUp: SignUp) => (
                tableRows(signUp, remove)
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Typography align="center" variant="body1">
          {alt}
        </Typography>
      )}
    </Box>
  }

  function feedback(success: boolean) {
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

  function dateFormat(date: unknown) {
    return dayjs(date as string).format("kl.HH:mm, DD-MM-YYYY")
  }

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
      {data?.event && (
        <Box m={10}>
          {openEditEvent && (
            <EditEvent open={openEditEvent} onClose={() => setOpenEditEvent(false)} event={data.event} />
          )}
          <Box pb={5}>
            <Typography variant="h2" align="center">
              {data.event.title}
            </Typography>
          </Box>
          <Accordion elevation={0} defaultExpanded={true} classes={{ root: classes.accordion }}>
            {accordionHeader(["Generell informasjon", <Button variant="outlined" startIcon={<Edit />} onClick={() => setOpenEditEvent(true)}>Rediger</Button>])}
            <AccordionDetails>
              <Box m={4} mt={0}>
                <Grid container spacing={2}>
                  {stringEventFields.map((headerPair: HeaderValuePair<Event>) =>
                    renderInfo(
                      headerPair.header,
                      data.event[headerPair.field] ? (data.event[headerPair.field] as string) : ""
                    )
                  )}
                  {renderInfo("Åpent for", [...data.event.allowedGradeYears].splice(1,data.event.allowedGradeYears.length)
                  .reduce((res, grade) => `${res}, ${grade}.klasse`, `${data.event.allowedGradeYears[0]}.klasse`))}
                  {dateEventFields.map((headerPair: HeaderValuePair<Event>) =>
                    renderInfo(
                      headerPair.header,
                      data.event[headerPair.field]
                        ? dateFormat(data.event[headerPair.field])
                        : ""
                    )
                  )}
                  {data?.event?.isAttendable && (
                    <>
                      {renderInfo("Påmelding åpner", data.event.signupOpenDate
                            ? dateFormat(data.event.signupOpenDate)
                            : "")}
                      {renderInfo("Påmeldingsfrist", data.event.deadline
                            ? dateFormat(data.event.deadline)
                            : "")}
                     {renderInfo("Bindende påmelding", data.event?.bindingSignup)}
                      { data.event?.availableSlots && (
                        renderInfo("Tilgjengelige plasser", data.event.slotDistribution.length > 1
                        ? data.event.slotDistribution.map((year, amount) => (
                            <Typography key={String(year)}>
                              {year}.klasse: {amount} plasser
                            </Typography>
                          )).toString()
                        : `${data.event.slotDistribution[0].amount}`)
                      )}
                    </>
                  )}
                </Grid>
              </Box>
            </AccordionDetails>
          </Accordion>
          {data?.event?.isAttendable && (
            <>
              <Accordion>
                {accordionHeader(["Påmeldte",<AttendeeExport eventId={eventNumberID} />, eventId ? <EmailForm eventId={eventId} /> : <CircularProgress color="primary" />])}
                <AccordionDetails>
                  {tableContainer(data?.event?.usersAttending, "Ingen påmeldte", <TableCell key={`user-header-delete`} />, true)}
                </AccordionDetails>
              </Accordion>
              <Accordion>
                {accordionHeader(["Venteliste"])}
                <AccordionDetails>
                  {tableContainer(data?.event?.usersOnWaitingList, "Ingen på venteliste")}
                </AccordionDetails>
              </Accordion>
            </>
          )}
        </Box>
      )}
      {feedback(false)}
      {feedback(true)}
    </Layout>
  );
};

export default EventAdminPage;
