import { useMutation, useQuery } from "@apollo/client";
import { GET_USER } from "@graphql/auth/queries";
import { EVENT_SIGN_OFF, EVENT_SIGN_UP } from "@graphql/events/mutations";
import { Event } from "@interfaces/events";
import { User } from "@interfaces/users";
import { Button, Paper, Box, Grid, Snackbar, Typography, useTheme } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import CategoryIcon from "@material-ui/icons/Category";
import EventIcon from "@material-ui/icons/Event";
import LocationOnIcon from "@material-ui/icons/LocationOn";
import ScheduleIcon from "@material-ui/icons/Schedule";
import CreditCard from "@material-ui/icons/CreditCard";
import MuiAlert from "@material-ui/lab/Alert";
import { Container } from "next/app";
import Link from "next/link";
import React, { useState } from "react";
import { GET_EVENT, QUERY_USER_ATTENDING_EVENT } from "../../../graphql/events/queries";
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
}));

const steps = ["Shipping address", "Payment details", "Review your order"];

interface Props {
  eventId: number;
}

function parseDate(date: string) {
  return date != null ? date.replace("T", " ").split("+")[0] : "null";
}

function getName(obj: any) {
  return obj != null ? obj.name : "null";
}

const EventDetailPage: React.FC<Props> = ({ eventId }) => {
  const [openSignUpSnackbar, setOpenSignUpSnackbar] = useState(false);
  const [openSignOffSnackbar, setOpenSignOffSnackbar] = useState(false);
  const [openErrorSnackbar, setOpenErrorSnackbar] = useState(false);
  const [eventSignUp, { loading: signUpLoading }] = useMutation<{
    eventSignUp: { event: Event; isFull: boolean };
  }>(EVENT_SIGN_UP);

  const [eventSignOff, { loading: signOffLoading }] = useMutation<{
    eventSignOff: { event: Event; isFull: boolean };
  }>(EVENT_SIGN_OFF);

  const { data: userData } = useQuery<{ user: User }>(GET_USER);

  const {
    data: userAttendingEventData,
    loading: userAttendingEventLoading,
    refetch: refetchAttendingRelation,
  } = useQuery(QUERY_USER_ATTENDING_EVENT, {
    variables: { eventId: eventId.toString(), userId: userData?.user.id },
  });

  const { loading, error, data } = useQuery(GET_EVENT, {
    variables: { id: eventId },
  });
  const classes = useStyles();
  const theme = useTheme();

  if (loading) return <p>Loading...</p>;

  if (error) return <p>Error :(</p>;

  const handleClick = () => {
    if (!userData?.user.id) return;
    if (userAttendingEventData?.userAttendingRelation.isSignedUp) {
      eventSignOff({ variables: { eventId: eventId.toString(), userId: userData?.user.id } })
        .then(() => {
          refetchAttendingRelation({ eventId: eventId.toString(), userId: userData?.user.id });
          setOpenSignOffSnackbar(true);
        })
        .catch(() => {
          setOpenErrorSnackbar(true);
        });
      return;
    }
    eventSignUp({ variables: { eventId: eventId.toString(), userId: userData?.user.id } })
      .then(() => {
        refetchAttendingRelation({ eventId: eventId.toString(), userId: userData?.user.id });
        setOpenSignUpSnackbar(true);
      })
      .catch(() => {
        setOpenErrorSnackbar(true);
      });
  };

  if (data.event) {
    return (
      <div>
        <Grid container spacing={1}>
          {/* Header card */}
          <Grid item xs={12}>
            <Paper variant="outlined" className={classes.paper}>
              <Typography component="h1" variant="h4" align="center">
                {data.event.title}
              </Typography>
              <Grid container justify="center">
                <Typography
                  variant="overline"
                  display="block"
                  className={classes.publisherContainer}
                  color={theme.palette.text.secondary}
                >
                  Arrangert av
                </Typography>
                <Typography
                  color={theme.palette.text.secondary}
                  variant="overline"
                  display="block"
                  style={{ fontWeight: 600 }}
                  className={classes.publisherContainer}
                >
                  &nbsp;&nbsp;{getName(data.event.organization)}
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
              <Typography variant="body1" display="block" color={theme.palette.text.secondary}>
                <pre style={{ fontFamily: "inherit" }}>{data.event.description}</pre>
              </Typography>
            </Paper>
          </Grid>

          {/* Information card */}
          <Grid item xs={4}>
            <Paper variant="outlined" className={classes.paper}>
              <Box my={1.5}>
                <Typography variant="overline" display="block">
                  Info{" "}
                </Typography>
                {data.event.price && (
                  <Typography gutterBottom>
                    <CreditCard fontSize="small" /> {data.event.price} kr
                  </Typography>
                )}
                {data.event.location && (
                  <Typography gutterBottom>
                    <LocationOnIcon fontSize="small" /> {data.event.location}
                  </Typography>
                )}
                {data.event.category && (
                  <Typography gutterBottom>
                    <CategoryIcon fontSize="small" /> {getName(data.event.category)}{" "}
                  </Typography>
                )}
              </Box>

              <Box my={2}>
                <Typography variant="overline" display="block">
                  Starter{" "}
                </Typography>
                <Typography gutterBottom>
                  <EventIcon fontSize="small" /> {parseDate(data.event.startTime).split(" ")[0]}{" "}
                </Typography>
                <Typography gutterBottom>
                  <ScheduleIcon fontSize="small" /> kl. {parseDate(data.event.startTime).split(" ")[1].slice(0, 5)}
                </Typography>
              </Box>

              {data.event.endTime && (
                <Box my={2}>
                  <Typography variant="overline" display="block">
                    Slutter{" "}
                  </Typography>
                  <Typography gutterBottom>
                    <EventIcon fontSize="small" /> {parseDate(data.event.endTime).split(" ")[0]}{" "}
                  </Typography>
                  <Typography gutterBottom>
                    <ScheduleIcon fontSize="small" /> kl. {parseDate(data.event.endTime).split(" ")[1].slice(0, 5)}
                  </Typography>
                </Box>
              )}
              {/* </Grid> */}
            </Paper>
          </Grid>

          {/* Buttons row card */}
          <Grid item justify="space-between" xs={12}>
            <Paper variant="outlined" className={classes.paper}>
              <Container justify="space-between">
                <Link href={`/events`}>
                  <Button>Tilbake</Button>
                </Link>

                {data.event.isAttendable && userData?.user && userAttendingEventData?.userAttendingRelation ? (
                  <>
                    <CountdownButton
                      countDownDate={data.event.signupOpenDate}
                      isSignedUp={userAttendingEventData.userAttendingRelation.isSignedUp ?? false}
                      isOnWaitingList={userAttendingEventData?.userAttendingRelation.isOnWaitingList ?? false}
                      isFull={userAttendingEventData.userAttendingRelation.isFull ?? false}
                      loading={signOffLoading || signUpLoading || userAttendingEventLoading}
                      onClick={handleClick}
                      styleClassName={classes.signUpButton}
                    />

                    <Snackbar
                      anchorOrigin={{ vertical: "top", horizontal: "right" }}
                      open={openErrorSnackbar}
                      autoHideDuration={3000}
                      onClose={() => setOpenErrorSnackbar(false)}
                    >
                      <MuiAlert elevation={6} variant="filled" severity="error">
                        Påmelding feilet
                      </MuiAlert>
                    </Snackbar>
                    <Snackbar
                      anchorOrigin={{ vertical: "top", horizontal: "right" }}
                      open={openSignOffSnackbar}
                      autoHideDuration={3000}
                      onClose={() => setOpenSignOffSnackbar(false)}
                    >
                      <MuiAlert elevation={6} variant="filled" severity="info">
                        Du er nå avmeldt
                      </MuiAlert>
                    </Snackbar>

                    <Snackbar
                      anchorOrigin={{ vertical: "top", horizontal: "right" }}
                      open={openSignUpSnackbar}
                      autoHideDuration={3000}
                      onClose={() => setOpenSignUpSnackbar(false)}
                    >
                      <MuiAlert elevation={6} variant="filled" severity="success">
                        Du er nå påmeldt
                      </MuiAlert>
                    </Snackbar>
                  </>
                ) : null}
              </Container>
            </Paper>
          </Grid>
        </Grid>
      </div>
    );
  } else return null;
};

export default EventDetailPage;
