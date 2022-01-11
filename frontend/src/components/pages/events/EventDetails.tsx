import { useMutation, useQuery } from "@apollo/client";
import PermissionRequired from "@components/permissions/PermissionRequired";
import { EVENT_SIGN_OFF, EVENT_SIGN_UP } from "@graphql/events/mutations";
import { GET_EVENT } from "@graphql/events/queries";
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
  Snackbar as MuiSnackbar,
  SnackbarCloseReason,
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
import { Alert as MuiAlert } from "@material-ui/lab";
import { calendarFile } from "@utils/calendars";
import dayjs from "dayjs";
import Link from "next/link";
import React, { useState } from "react";
import CountdownButton from "./CountdownButton";
import EditEvent from "./EventEditor";

const useStyles = makeStyles((theme) => ({
  container: {
    paddingTop: theme.spacing(9),
    paddingBottom: theme.spacing(9),
  },
  paper: {
    color: theme.palette.text.primary,
    padding: theme.spacing(2),
    height: "100%",
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
  innerParagraph: {},
  extraInformation: {
    position: "relative",
    float: "right",
    paddingRight: "1em",
    paddingBottom: "1em",
  },
  wrapIcon: {
    alignItems: "center",
    display: "inline-flex",
    width: "100%",
    marginBottom: theme.spacing(1),

    "& > svg": {
      height: "unset",
      marginRight: theme.spacing(2),
    },
  },
  backButton: {
    marginLeft: -20,
  },
  boughtTicket: {
    width: "fit-content",
    marginLeft: "10%",
  },
  payButton: {
    marginLeft: "20px",
  },
}));

interface Props {
  eventId: string;
}

interface AlertProps {
  open: boolean;
  onClose: ((event: React.SyntheticEvent<any, globalThis.Event>, reason: SnackbarCloseReason) => void) | undefined;
  severity: "success" | "info" | "warning" | "error";
  children: string | undefined;
}

function wrapInTypo(para: JSX.Element[] | string, className: string) {
  return <Typography className={className}>{para}</Typography>;
}

function formatDescription(desc: string, innerClass: string, outerClass: string) {
  return desc.split("\r\n\r\n").map((p) =>
    wrapInTypo(
      p.split("\r\n").map((t) => wrapInTypo(t, innerClass)),
      outerClass
    )
  );
}

const Alert: React.FC<AlertProps> = ({ open, onClose, children, severity }) => {
  return (
    <MuiSnackbar
      autoHideDuration={3000}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      open={open}
      onClose={onClose}
    >
      <MuiAlert elevation={6} variant="filled" severity={severity}>
        {children}
      </MuiAlert>
    </MuiSnackbar>
  );
};

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

  const {
    data: eventData,
    error: eventError,
    loading: eventLoading,
    refetch: refetchEventData,
  } = useQuery<{
    event: Event;
  }>(GET_EVENT, { variables: { id: eventId } });

  const classes = useStyles();
  const theme = useTheme();

  const [openEditEvent, setOpenEditEvent] = useState(false);

  if (eventLoading) return <p>Loading...</p>;

  if (eventError) return <p>Error :(</p>;

  if (!eventData || !eventData.event || !userData)
    return <Typography variant="body1">Kunne ikke laste arrangementet</Typography>;

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
      <Box width="100%" py={6} bgcolor={theme.palette.background.paper} pb={10}>
        <Container>
          <Link href="/events" passHref>
            <Button className={classes.backButton} startIcon={<KeyboardBackspace />}>
              Tilbake til oversikt
            </Button>
          </Link>
          <Typography variant="h2" gutterBottom>
            {eventData.event.title}
          </Typography>
          <Typography variant="subtitle2" display="block" gutterBottom>
            Arrangert av {eventData.event.organization?.name}
          </Typography>

          {!eventData.event.isAttendable ? null : !userData.user ? (
            <Typography variant="h5" gutterBottom>
              Logg inn for å melde deg på
            </Typography>
          ) : !eventData.event.allowedGradeYears.includes(userData.user.gradeYear) ? (
            <Typography variant="h5" gutterBottom>
              Ikke aktuell
            </Typography>
          ) : (
            <>
              <PermissionRequired permission="events.add_signup">
                {!userData.user.phoneNumber &&
                  !eventData.event.userAttendance?.isSignedUp &&
                  !eventData.event.userAttendance?.isOnWaitingList && (
                    <Typography variant="body1" color="error" className={classes.wrapIcon}>
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
                  currentTime={timeData.serverTime}
                />
                {eventData.event.products.length &&
                  eventData.event.userAttendance?.isSignedUp &&
                  (eventData.event.userAttendance.hasBoughtTicket ? (
                    <MuiAlert severity="success" className={classes.boughtTicket}>
                      Du har betalt for billett
                    </MuiAlert>
                  ) : (
                    <Link href={`/ecommerce/checkout?productId=${eventData.event.products[0].id}&quantity=1`} passHref>
                      <Button size="large" variant="contained" color={"primary"} className={classes.payButton}>
                        Gå til betaling
                      </Button>
                    </Link>
                  ))}
              </PermissionRequired>
            </>
          )}
          {userData.user?.organizations
            .map((organization) => organization.id)
            .includes(eventData.event.organization.id) && (
            <div>
              <Button
                variant="contained"
                size="large"
                startIcon={<Edit />}
                onClick={() => {
                  setOpenEditEvent(true);
                }}
              >
                Rediger
              </Button>
              <Link href={`/orgs/${eventData.event.organization.id}/events/${eventId}`} passHref>
                <Button size="large" variant="contained" startIcon={<List />}>
                  Administrer
                </Button>
              </Link>
            </div>
          )}
        </Container>
      </Box>
      <Container className={classes.container}>
        <Grid container spacing={8}>
          {/* Description card */}
          <Grid item xs={12} md={8}>
            <Typography variant="h3" gutterBottom>
              Beskrivelse
            </Typography>
            <Typography variant="body1" display="block" gutterBottom>
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
                  {dayjs(eventData.event.startTime).format("DD.MMM YYYY, kl. HH:mm")}
                </Typography>
                {eventData.event.endTime && (
                  <>
                    <Typography variant="overline">Slutter</Typography>
                    <Typography variant="body1" className={classes.wrapIcon}>
                      <EventIcon fontSize="small" /> {dayjs(eventData.event.endTime).format("DD.MMM YYYY, kl. HH:mm")}
                    </Typography>
                  </>
                )}
                <Button
                  variant="text"
                  href={calendarFile(
                    eventData.event.title,
                    eventData.event.startTime,
                    eventData.event.endTime,
                    eventData.event.location,
                    eventData.event.description
                  )}
                  download="event.ics"
                >
                  Last ned i kalender
                </Button>
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
      {/* Alerts */}
      <Alert severity="error" open={openSignUpErrorSnackbar} onClose={() => setOpenSignUpErrorSnackbar(false)}>
        {signUpError ? signUpError.message : "Påmelding feilet"}
      </Alert>

      <Alert open={openSignOffErrorSnackbar} severity="error" onClose={() => setOpenSignUpErrorSnackbar(false)}>
        Avmelding feilet
      </Alert>

      <Alert severity="info" open={openSignOffSnackbar} onClose={() => setOpenSignOffSnackbar(false)}>
        Du er nå avmeldt
      </Alert>

      <Alert severity="success" open={openSignUpSnackbar} onClose={() => setOpenSignUpSnackbar(false)}>
        Du er nå påmeldt
      </Alert>

      <Alert severity="info" open={openOnWaitingListSnackbar} onClose={() => setOpenOnWaitingListSnackbar(false)}>
        Du er på ventelisten
      </Alert>

      <Alert severity="info" open={openOffWaitingListSnackbar} onClose={() => setOpenOffWaitingListSnackbar(false)}>
        Du er ikke lenger på ventelisten
      </Alert>
    </>
  );
};

export default EventDetails;
