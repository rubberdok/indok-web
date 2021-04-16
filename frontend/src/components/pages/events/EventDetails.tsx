import { useMutation, useQuery } from "@apollo/client";
import { EVENT_SIGN_OFF, EVENT_SIGN_UP } from "@graphql/events/mutations";
import { GET_USER } from "@graphql/users/queries";
import { GET_SERVER_TIME } from "@graphql/utils/time/queries";
import { AttendableEvent, Event } from "@interfaces/events";
import { User } from "@interfaces/users";
import {
  Box,
  Button,
  Container,
  Grid,
  Link as MuiLink,
  Paper,
  Snackbar,
  TextField,
  Typography,
  useTheme,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { ArrowRight, ContactMail, Edit, ErrorOutline, KeyboardBackspace, List, Warning } from "@material-ui/icons";
import CategoryIcon from "@material-ui/icons/Category";
import CreditCard from "@material-ui/icons/CreditCard";
import EventIcon from "@material-ui/icons/Event";
import LocationOnIcon from "@material-ui/icons/LocationOn";
import { Alert } from "@material-ui/lab";
import dayjs from "dayjs";
import nb from "dayjs/locale/nb";
import Link from "next/link";
import React, { useState } from "react";
import { GET_EVENT } from "../../../graphql/events/queries";
import CountdownButton from "./CountdownButton";
import EditEvent from "./EventEditor";

const useStyles = makeStyles((theme) => ({
  container: {
    paddingTop: theme.spacing(8),
    paddingBottom: theme.spacing(4),
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
  wrapIcon: {
    verticalAlign: "middle",
    display: "inline-flex",
    width: "100%",
    marginBottom: theme.spacing(1),

    "& > svg": {
      height: "unset",
      marginRight: theme.spacing(2),
    },
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

const EventDetails: React.FC<Props> = ({ eventId }) => {
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

  const { data: timeData } = useQuery(GET_SERVER_TIME);

  const { data: eventData, error: eventError, loading: eventLoading, refetch: refetchEventData } = useQuery<{
    event: Event;
  }>(GET_EVENT, {
    variables: { id: eventId },
  });

  const classes = useStyles();
  const theme = useTheme();

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
    <>
      {openEditEvent && (
        <EditEvent open={openEditEvent} onClose={() => setOpenEditEvent(false)} event={eventData.event} />
      )}
      <Box width="100%" py={10} bgcolor={theme.palette.background.paper}>
        <Container>
          <Link href="/events" passHref>
            <Button startIcon={<KeyboardBackspace />}>Tilbake til oversikt</Button>
          </Link>
          <Typography variant="h1" gutterBottom>
            {eventData.event.title}
          </Typography>
          <Typography variant="subtitle1" display="block" gutterBottom>
            Arrangert av {eventData.event.organization?.name}
          </Typography>
          {userData.user?.organizations
            .map((organization) => organization.id)
            .includes(eventData.event.organization.id) && (
            <Box>
              <Button
                variant="contained"
                startIcon={<Edit />}
                onClick={() => {
                  setOpenEditEvent(true);
                }}
              >
                Rediger
              </Button>
              <Link href={`/orgs/${eventData.event.organization.id}/events/${eventId}`} passHref>
                <Button variant="contained" startIcon={<List />}>
                  Administrer
                </Button>
              </Link>
            </Box>
          )}
          {!eventData.event.isAttendable ? null : !userData.user ? (
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
                currentTime={timeData.serverTime}
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
        </Container>
      </Box>
      <Container className={classes.container}>
        <Grid container spacing={1}>
          {/* Description card */}
          <Grid item xs={12} md={8}>
            <Typography variant="h3" gutterBottom>
              Beskrivelse
            </Typography>
            <Typography variant="body1" display="block">
              {formatDescription(eventData.event.description, classes.innerParagraph, classes.paragraph)}
            </Typography>
          </Grid>

          {/* Information card */}
          <Grid item xs={12} md={4}>
            <Paper className={classes.paper}>
              <Box my={2} mx={2}>
                <Typography variant="h4" gutterBottom>
                  Info
                </Typography>
                {eventData.event.price && (
                  <Typography variant="body1" className={classes.wrapIcon}>
                    <CreditCard fontSize="small" /> {eventData.event.price} kr
                  </Typography>
                )}
                {eventData.event.location && (
                  <Typography variant="body1" className={classes.wrapIcon}>
                    <LocationOnIcon fontSize="small" /> {eventData.event.location}
                  </Typography>
                )}
                {eventData.event.category && (
                  <Typography variant="body1" className={classes.wrapIcon}>
                    <CategoryIcon fontSize="small" /> {eventData.event.category?.name}
                  </Typography>
                )}
                {eventData.event.contactEmail && (
                  <Typography variant="body1" className={classes.wrapIcon}>
                    <ContactMail fontSize="small" />
                    <MuiLink href={`mailto:${eventData.event.contactEmail}`}>{eventData.event.contactEmail}</MuiLink>
                  </Typography>
                )}
                {eventData.event.bindingSignup && (
                  <Typography variant="body1" className={classes.wrapIcon} color="error">
                    <ErrorOutline fontSize="small" /> Bindende påmelding
                  </Typography>
                )}
                <Typography variant="overline">Åpner</Typography>
                <Typography variant="body1" className={classes.wrapIcon}>
                  <EventIcon fontSize="small" />
                  {dayjs(eventData.event.startTime).locale(nb).format("DD.MMM YYYY, kl. HH:mm")}
                </Typography>
                {eventData.event.endTime && (
                  <>
                    <Typography variant="overline">Slutter</Typography>
                    <Typography variant="body1" className={classes.wrapIcon}>
                      <EventIcon fontSize="small" />{" "}
                      {dayjs(eventData.event.endTime).locale(nb).format("DD.MMM YYYY, kl. HH:mm")}
                    </Typography>
                  </>
                )}
                {eventData.event.allowedGradeYears.length < 5 && (
                  <>
                    <Typography variant="overline" gutterBottom>
                      Åpent for
                    </Typography>
                    {eventData.event.allowedGradeYears.map((grade) => (
                      <Typography variant="body1" className={classes.wrapIcon} key={grade}>
                        <ArrowRight fontSize="small" /> {`${grade}. klasse`}
                      </Typography>
                    ))}
                  </>
                )}
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default EventDetails;
