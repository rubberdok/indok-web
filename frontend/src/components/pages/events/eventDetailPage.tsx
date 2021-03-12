import { useMutation, useQuery } from "@apollo/client";
import { GET_USER } from "@graphql/auth/queries";
import { EVENT_SIGN_OFF, EVENT_SIGN_UP } from "@graphql/events/mutations";
import { AttendableEvent, Event } from "@interfaces/events";
import { User } from "@interfaces/users";
import { Box, Button, Grid, Paper, Snackbar, Typography } from "@material-ui/core";
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

const useStyles = makeStyles((theme) => ({
  container: {
    padding: 0,
  },
  tabsContainer: {
    width: "fit-content",
    float: "left",
  },
  publisherContainer: {
    marginTop: theme.spacing(1),
    width: "fit-content",
    float: "left",
  },
  detailContainer: {
    marginTop: theme.spacing(1),
    marginLeft: theme.spacing(1),
    width: "fit-content",
    float: "left",
  },
  mainContainer: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },

  mainDivider: {
    paddingTop: theme.spacing(5),
    paddingBottom: theme.spacing(5),
  },

  buttonsContainer: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  buttons: {
    marginInline: theme.spacing(1),
  },

  tabs: {},
  progessContainer: {
    paddingLeft: "45%",
    paddingTop: theme.spacing(6),
  },
  headerContainer: {
    padding: 0,
  },
  createButtonContainer: {
    width: "fit-content",
    float: "right",
  },
  grid: {
    padding: theme.spacing(3),
    paddingTop: theme.spacing(2),
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
  paragraph: {
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    display: "inline-block",
  },
  innerParagraph: {
    paddingTop: theme.spacing(0),
    paddingBottom: theme.spacing(0),
  },
}));

interface Props {
  eventId: string;
}

function parseDate(date: string) {
  return date != null ? date.replace("T", " ").split("+")[0] : "null";
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
  const [openErrorSnackbar, setOpenErrorSnackbar] = useState(false);

  const [eventSignUp, { loading: signUpLoading }] = useMutation<{
    eventSignUp: { event: Event; isFull: boolean };
  }>(EVENT_SIGN_UP);

  const [eventSignOff, { loading: signOffLoading }] = useMutation<{
    eventSignOff: { event: Event; isFull: boolean };
  }>(EVENT_SIGN_OFF);

  const { data: userData } = useQuery<{ user: User }>(GET_USER);

  const { data: eventData, error: eventError, loading: eventLoading, refetch: refetchEventData } = useQuery<{
    event: Event;
  }>(GET_EVENT, {
    variables: { id: eventId, userId: userData?.user.id },
  });

  const classes = useStyles();

  if (eventLoading) return <p>Loading...</p>;

  if (eventError) return <p>Error :(</p>;

  if (!eventData || !userData) return <Typography variant="body1">Kunne ikke laste arrangementet</Typography>;

  const handleClick = () => {
    if (!userData.user) return;
    if (eventData.event.userAttendance?.isSignedUp) {
      eventSignOff({ variables: { eventId: eventId.toString(), userId: userData?.user.id } })
        .then(() => {
          refetchEventData({ eventId: eventId.toString(), userId: userData?.user.id });
          setOpenSignOffSnackbar(true);
        })
        .catch(() => {
          setOpenErrorSnackbar(true);
        });
      return;
    }
    if (eventData.event.userAttendance?.isOnWaitingList) {
      eventSignOff({ variables: { eventId: eventId.toString(), userId: userData?.user.id } })
        .then(() => {
          refetchEventData({ eventId: eventId.toString(), userId: userData?.user.id });
          setOpenOffWaitingListSnackbar(true);
        })
        .catch(() => {
          setOpenErrorSnackbar(true);
        });
      return;
    }
    eventSignUp({ variables: { eventId: eventId.toString(), userId: userData.user.id } })
      .then(() => {
        refetchEventData({ eventId: eventId.toString(), userId: userData.user.id }).then((res) => {
          res.data.event.userAttendance?.isSignedUp ? setOpenSignUpSnackbar(true) : setOpenOnWaitingListSnackbar(true);
        });
      })
      .catch(() => {
        setOpenErrorSnackbar(true);
      });
  };

  return (
    <Grid container spacing={1}>
      {/* Header card */}
      <Grid item xs={12}>
        <Paper variant="outlined" className={classes.paper}>
          <Typography component="h1" variant="h4" align="center">
            {eventData.event.title}
          </Typography>
          <Grid container justify="center">
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
          </Grid>
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
          </Box>

          <Box my={2}>
            <Typography variant="overline" display="block">
              Starter
            </Typography>
            <Typography gutterBottom>
              <EventIcon fontSize="small" /> {parseDate(eventData.event.startTime).split(" ")[0]}
            </Typography>
            <Typography gutterBottom>
              <ScheduleIcon fontSize="small" /> kl. {parseDate(eventData.event.startTime).split(" ")[1].slice(0, 5)}
            </Typography>
          </Box>

          {eventData.event.endTime && (
            <Box my={2}>
              <Typography variant="overline" display="block">
                Slutter
              </Typography>
              <Typography gutterBottom>
                <EventIcon fontSize="small" /> {parseDate(eventData.event.endTime).split(" ")[0]}
              </Typography>
              <Typography gutterBottom>
                <ScheduleIcon fontSize="small" /> kl. {parseDate(eventData.event.endTime).split(" ")[1].slice(0, 5)}
              </Typography>
            </Box>
          )}
          {/* </Grid> */}
        </Paper>
      </Grid>

      {/* Buttons row card */}
      <Grid item justify="space-between" xs={12}>
        <Paper variant="outlined" className={classes.paper}>
          <Link href={`/events`}>
            <Button>Tilbake</Button>
          </Link>

          {eventData.event.isAttendable && (
            <>
              <CountdownButton
                countDownDate={(eventData.event as AttendableEvent).signupOpenDate}
                isSignedUp={(eventData.event as AttendableEvent).userAttendance.isSignedUp}
                isOnWaitingList={(eventData.event as AttendableEvent).userAttendance.isOnWaitingList}
                isFull={(eventData.event as AttendableEvent).isFull}
                loading={signOffLoading || signUpLoading || eventLoading}
                onClick={handleClick}
                styleClassName={classes.signUpButton}
              />

              <Snackbar
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
                open={openErrorSnackbar}
                autoHideDuration={3000}
                onClose={() => setOpenErrorSnackbar(false)}
              >
                <Alert elevation={6} variant="filled" severity="error">
                  Påmelding feilet
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
