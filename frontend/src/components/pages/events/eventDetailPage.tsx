import { useMutation, useQuery } from "@apollo/client";
import { GET_USER } from "@graphql/users/queries";
import { EVENT_SIGN_OFF, EVENT_SIGN_UP } from "@graphql/events/mutations";
import { AttendableEvent, Event } from "@interfaces/events";
import { User } from "@interfaces/users";
import { Box, Button, Grid, Paper, Snackbar, Typography, TextField, Link as MuiLink } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import CategoryIcon from "@material-ui/icons/Category";
import CreditCard from "@material-ui/icons/CreditCard";
import EventIcon from "@material-ui/icons/Event";
import LocationOnIcon from "@material-ui/icons/LocationOn";
import ScheduleIcon from "@material-ui/icons/Schedule";
import { Alert } from "@material-ui/lab";
import Link from "next/link";
import React, { useState } from "react";
import { GET_EVENT } from "../../../graphql/events/queries";
import CountdownButton from "./CountdownButton";
import { ArrowRight, ContactMail, Edit, ErrorOutline, List, Warning } from "@material-ui/icons";
import EditEvent from "./editEvent";
import dayjs from "dayjs";
import nb from "dayjs/locale/nb";

const useStyles = makeStyles((theme) => ({
  container: {
    padding: 0,
  },
  publisherContainer: {
    marginTop: theme.spacing(1),
    width: "fit-content",
    float: "left",
  },
  paper: {
    color: theme.palette.text.primary,
    padding: theme.spacing(2),
    height: "100%",
  },
  signUpButton: {
    padding: theme.spacing(1),
    paddingLeft: theme.spacing(1.6),
    paddingRight: theme.spacing(1.6),
    float: "right",
  },
  signUpText: {
    float: "right",
    paddingTop: theme.spacing(0.7),
  },
  paragraph: {
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    display: "inline-block",
  },
  innerParagraph: {
    paddingTop: theme.spacing(0),
    paddingBottom: theme.spacing(0),
  },
  extraInformation: {
    position: "relative",
    float: "right",
    paddingRight: "1em",
    paddingBottom: "1em",
  },
}));

interface Props {
  eventId: string;
}

function wrapInTypo(para: JSX.Element[] | string, className: any) {
  return <Typography className={className}>{para}</Typography>;
}

function formatDescription(desc: string, innerClass: any, outerClass: any) {
  return desc.split("\r\n\r\n").map((p) =>
    wrapInTypo(
      p.split("\r\n").map((t) => wrapInTypo(t, innerClass)),
      outerClass
    )
  );
}

const EventDetailPage: React.FC<Props> = ({ eventId }) => {
  const [openSignUpSnackbar, setOpenSignUpSnackbar] = useState(false);
  const [openSignOffSnackbar, setOpenSignOffSnackbar] = useState(false);
  const [openOnWaitingListSnackbar, setOpenOnWaitingListSnackbar] = useState(false);
  const [openOffWaitingListSnackbar, setOpenOffWaitingListSnackbar] = useState(false);
  const [openSignUpErrorSnackbar, setOpenSignUpErrorSnackbar] = useState(false);
  const [openSignOffErrorSnackbar, setOpenSignOffErrorSnackbar] = useState(false);
  const [extraInformation, setExtraInformation] = useState<string>();

  const [eventSignUp, { loading: signUpLoading, error: signUpError }] = useMutation<{
    eventSignUp: { isFull: boolean };
  }>(EVENT_SIGN_UP);

  const [eventSignOff, { loading: signOffLoading }] = useMutation<{
    eventSignOff: { isFull: boolean };
  }>(EVENT_SIGN_OFF);

  const { data: userData } = useQuery<{ user: User }>(GET_USER);

  const { data: eventData, error: eventError, loading: eventLoading, refetch: refetchEventData } = useQuery<{
    event: Event;
  }>(GET_EVENT, {
    variables: { id: eventId },
  });

  const classes = useStyles();

  const [openEditEvent, setOpenEditEvent] = useState(false);

  if (eventLoading) return <p>Loading...</p>;

  if (eventError) return <p>Error :(</p>;

  if (!eventData || !userData) return <Typography variant="body1">Kunne ikke laste arrangementet</Typography>;

  const handleClick = () => {
    if (!userData.user) return;
    if (eventData.event.userAttendance?.isSignedUp) {
      eventSignOff({ variables: { eventId: eventId.toString() } })
        .then(() => {
          refetchEventData({ eventId: eventId.toString() });
          setOpenSignOffSnackbar(true);
        })
        .catch(() => {
          setOpenSignOffErrorSnackbar(true);
        });
      return;
    }
    if (eventData.event.userAttendance?.isOnWaitingList) {
      eventSignOff({ variables: { eventId: eventId.toString() } })
        .then(() => {
          refetchEventData({ eventId: eventId.toString() });
          setOpenOffWaitingListSnackbar(true);
        })
        .catch(() => {
          setOpenSignOffErrorSnackbar(true);
        });
      return;
    }
    eventSignUp({ variables: { eventId: eventId.toString(), data: extraInformation } })
      .then(() => {
        refetchEventData({ eventId: eventId.toString() }).then((res) => {
          res.data.event.userAttendance?.isSignedUp ? setOpenSignUpSnackbar(true) : setOpenOnWaitingListSnackbar(true);
        });
      })
      .catch(() => {
        setOpenSignUpErrorSnackbar(true);
      });
  };

  return (
    <Grid container spacing={1}>
      {openEditEvent && (
        <EditEvent open={openEditEvent} onClose={() => setOpenEditEvent(false)} event={eventData.event} />
      )}
      {/* Header card */}
      <Grid item xs={12}>
        <Paper variant="outlined" className={classes.paper}>
          <Typography component="h1" variant="h4" align="center">
            {eventData.event.title}
          </Typography>
          <Box display="flex" flexDirection="column" alignItems="center">
            <Box>
              <Typography variant="overline" display="block" className={classes.publisherContainer}>
                Arrangert av
              </Typography>
              <Typography
                variant="overline"
                display="block"
                style={{ fontWeight: 600 }}
                className={classes.publisherContainer}
              >
                &nbsp;&nbsp;{eventData.event.organization?.name}
              </Typography>
            </Box>
            {userData.user?.organizations
              .map((organization) => organization.id)
              .includes(eventData.event.organization.id) && (
              <Box>
                <Button
                  startIcon={<Edit />}
                  color="primary"
                  onClick={() => {
                    setOpenEditEvent(true);
                  }}
                >
                  Rediger
                </Button>
                <Link href={`/orgs/${eventData.event.organization.id}/events/${eventId}`} passHref>
                  <Button color="primary" disableRipple startIcon={<List />}>
                    Administrer
                  </Button>
                </Link>
              </Box>
            )}
          </Box>
        </Paper>
      </Grid>

      {/* Description card */}
      <Grid item xs={8}>
        <Paper variant="outlined" className={classes.paper}>
          <Typography variant="h5" gutterBottom>
            Beskrivelse
          </Typography>
          <Typography variant="body1" display="block">
            {formatDescription(eventData.event.description, classes.innerParagraph, classes.paragraph)}
          </Typography>
        </Paper>
      </Grid>

      {/* Information card */}
      <Grid item xs={4}>
        <Paper variant="outlined" className={classes.paper}>
          <Box my={1.5}>
            <Typography variant="overline" display="block">
              Info
            </Typography>
            {eventData.event.price && (
              <Typography gutterBottom>
                <CreditCard fontSize="small" /> {eventData.event.price} kr
              </Typography>
            )}
            {eventData.event.location && (
              <Typography gutterBottom>
                <LocationOnIcon fontSize="small" /> {eventData.event.location}
              </Typography>
            )}
            {eventData.event.category && (
              <Typography gutterBottom>
                <CategoryIcon fontSize="small" /> {eventData.event.category?.name}
              </Typography>
            )}
            {eventData.event.contactEmail && (
              <Typography gutterBottom>
                <ContactMail fontSize="small" />
                <MuiLink href={`mailto:${eventData.event.contactEmail}`}>{eventData.event.contactEmail}</MuiLink>
              </Typography>
            )}
            {eventData.event.bindingSignup && (
              <Typography gutterBottom color="error">
                <ErrorOutline fontSize="small" /> Bindende påmelding
              </Typography>
            )}
          </Box>

          <Box my={2}>
            <Typography variant="overline" display="block">
              Starter
            </Typography>
            <Typography gutterBottom>
              <EventIcon fontSize="small" /> {dayjs(eventData.event.startTime).locale(nb).format("DD.MMM YYYY")}
            </Typography>
            <Typography gutterBottom>
              <ScheduleIcon fontSize="small" /> kl. {dayjs(eventData.event.startTime).locale(nb).format("HH:mm")}
            </Typography>
          </Box>

          {eventData.event.endTime && (
            <Box my={2}>
              <Typography variant="overline" display="block">
                Slutter
              </Typography>
              <Typography gutterBottom>
                <EventIcon fontSize="small" /> {dayjs(eventData.event.endTime).locale(nb).format("DD.MMM YYYY")}
              </Typography>
              <Typography gutterBottom>
                <ScheduleIcon fontSize="small" /> kl. {dayjs(eventData.event.endTime).locale(nb).format("HH:mm")}
              </Typography>
            </Box>
          )}

          {eventData.event.allowedGradeYears.length < 5 && (
            <Box my={2}>
              <Typography variant="overline" display="block">
                Åpent for
              </Typography>
              {eventData.event.allowedGradeYears.map((grade) => (
                <Typography gutterBottom key={grade}>
                  <ArrowRight fontSize="small" /> {`${grade}. klasse`}
                </Typography>
              ))}
            </Box>
          )}
        </Paper>
      </Grid>

      {/* Buttons row card */}
      <Grid item xs={12}>
        <Paper variant="outlined" className={classes.paper}>
          <Link href="/events" passHref>
            <Button>Tilbake</Button>
          </Link>

          {eventData.event.isAttendable && !userData.user ? (
            <Typography variant="h6" className={classes.signUpText}>
              Logg inn for å melde deg på
            </Typography>
          ) : !eventData.event.allowedGradeYears.includes(userData.user.gradeYear) ? (
            <Typography variant="h6" className={classes.signUpText}>
              Ikke aktuell
            </Typography>
          ) : (
            <>
              <CountdownButton
                countDownDate={(eventData.event as AttendableEvent).signupOpenDate}
                isSignedUp={(eventData.event as AttendableEvent).userAttendance.isSignedUp}
                isOnWaitingList={(eventData.event as AttendableEvent).userAttendance.isOnWaitingList}
                isFull={(eventData.event as AttendableEvent).isFull}
                loading={signOffLoading || signUpLoading || eventLoading}
                disabled={
                  (!userData.user.phoneNumber &&
                    !eventData.event.userAttendance?.isSignedUp &&
                    !eventData.event.userAttendance?.isOnWaitingList) ||
                  (eventData.event.bindingSignup && eventData.event.userAttendance?.isSignedUp) ||
                  (eventData.event.hasExtraInformation &&
                    !extraInformation &&
                    !eventData.event.userAttendance?.isSignedUp &&
                    !eventData.event.userAttendance?.isOnWaitingList)
                }
                onClick={handleClick}
                styleClassName={classes.signUpButton}
              />
              {!userData.user.phoneNumber &&
                !eventData.event.userAttendance?.isSignedUp &&
                !eventData.event.userAttendance?.isOnWaitingList && (
                  <Typography color="error">
                    <Warning fontSize="small" />
                    Du må oppgi et telefonnummer på brukeren din for å kunne melde deg på
                  </Typography>
                )}

              {eventData.event.hasExtraInformation &&
                !eventData.event.userAttendance?.isSignedUp &&
                !eventData.event.userAttendance?.isOnWaitingList && (
                  <TextField
                    className={classes.extraInformation}
                    label="Ekstrainformasjon"
                    multiline
                    rows={2}
                    required
                    placeholder="Skriv her..."
                    variant="outlined"
                    onChange={(e) => setExtraInformation(e.target.value)}
                  />
                )}

              <Snackbar
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
                open={openSignUpErrorSnackbar}
                autoHideDuration={3000}
                onClose={() => setOpenSignUpErrorSnackbar(false)}
              >
                <Alert elevation={6} variant="filled" severity="error">
                  {signUpError ? signUpError.message : "Påmelding feilet"}
                </Alert>
              </Snackbar>

              <Snackbar
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
                open={openSignOffErrorSnackbar}
                autoHideDuration={3000}
                onClose={() => setOpenSignUpErrorSnackbar(false)}
              >
                <Alert elevation={6} variant="filled" severity="error">
                  Avmelding feilet
                </Alert>
              </Snackbar>

              <Snackbar
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
                open={openSignOffSnackbar}
                autoHideDuration={3000}
                onClose={() => setOpenSignOffSnackbar(false)}
              >
                <Alert elevation={6} variant="filled" severity="info">
                  Du er nå avmeldt
                </Alert>
              </Snackbar>

              <Snackbar
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
                open={openSignUpSnackbar}
                autoHideDuration={3000}
                onClose={() => setOpenSignUpSnackbar(false)}
              >
                <Alert elevation={6} variant="filled" severity="success">
                  Du er nå påmeldt
                </Alert>
              </Snackbar>

              <Snackbar
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
                open={openOnWaitingListSnackbar}
                autoHideDuration={3000}
                onClose={() => setOpenOnWaitingListSnackbar(false)}
              >
                <Alert elevation={6} variant="filled" severity="info">
                  Du er på ventelisten
                </Alert>
              </Snackbar>

              <Snackbar
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
                open={openOffWaitingListSnackbar}
                autoHideDuration={3000}
                onClose={() => setOpenOffWaitingListSnackbar(false)}
              >
                <Alert elevation={6} variant="filled" severity="info">
                  Du er ikke lenger på ventelisten
                </Alert>
              </Snackbar>
            </>
          )}
        </Paper>
      </Grid>
    </Grid>
  );
};

export default EventDetailPage;
