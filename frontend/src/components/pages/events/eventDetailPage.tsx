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
import { Container } from "next/app";
import Link from "next/link";
import React, { useState } from "react";
import { GET_EVENT } from "../../../graphql/events/queries";

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
  eventContainer: {
    border: "solid",
    borderWidth: "0.05em 0.05em 0.05em 1.2em",
    borderRadius: "0.2em",
    padding: theme.spacing(2),
    marginBottom: theme.spacing(2),
    backgroundColor: "#fff",
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

function isSignedUp(event: Event, userId?: string) {
  if (!userId) return undefined;
  return event.signedUpUsers?.some((user) => user.id === userId);
}

const EventDetailPage: React.FC<Props> = ({ eventId }) => {
  const [hasClicked, setHasClicked] = useState(false);
  const [eventSignUp, { loading: signUpLoading, data: signUpData }] = useMutation<{
    eventSignUp: { event: Event; isFull: boolean };
  }>(EVENT_SIGN_UP);

  const [eventSignOff, { loading: signOffLoading }] = useMutation<{
    eventSignOff: { event: Event; isFull: boolean };
  }>(EVENT_SIGN_OFF);

  const { data: userData } = useQuery<{ user: User }>(GET_USER);

  const { loading, error, data, refetch } = useQuery(GET_EVENT, {
    variables: { id: eventId },
  });
  const classes = useStyles();
  const theme = useTheme();

  if (loading) return <p>Loading...</p>;

  if (error) return <p>Error :(</p>;

  const handleClick = () => {
    if (!userData?.user.id) return;
    setHasClicked(true);
    if (isSignedUp(data.event, userData?.user.id)) {
      eventSignOff({ variables: { eventId: eventId.toString(), userId: userData?.user.id } }).then(() =>
        refetch({ id: eventId })
      );
      return;
    }
    eventSignUp({ variables: { eventId: eventId.toString(), userId: userData?.user.id } }).then(() =>
      refetch({ id: eventId })
    );
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

                {data.event.isAttendable && userData?.user ? (
                  data.event.signedUpUsers.length === data.event.availableSlots ? (
                    <Typography variant="body1" color="primary">
                      Arrangementet er fullt
                    </Typography>
                  ) : (
                    <>
                      <Button
                        className={classes.signUpButton}
                        variant="contained"
                        color={isSignedUp(data.event, userData?.user.id) ? "#f75d2a" : "primary"}
                        loading={signOffLoading || signUpLoading}
                        onClick={handleClick}
                      >
                        {isSignedUp(data.event, userData?.user.id) ? "Meld av" : "Meld på"}
                      </Button>

                      <Snackbar
                        anchorOrigin={{ vertical: "top", horizontal: "right" }}
                        open={signUpData?.eventSignUp.isFull}
                        autoHideDuration={3000}
                        message="Arrangementet er fullt"
                      />

                      <Snackbar
                        anchorOrigin={{ vertical: "top", horizontal: "right" }}
                        open={
                          signOffLoading || signUpLoading
                            ? false
                            : isSignedUp(data.event, userData?.user.id) === false && hasClicked
                        }
                        autoHideDuration={3000}
                        message="Du er nå avmeldt"
                        onClose={() => setHasClicked(false)}
                      />

                      <Snackbar
                        anchorOrigin={{ vertical: "top", horizontal: "right" }}
                        open={
                          signOffLoading || signUpLoading
                            ? false
                            : isSignedUp(data.event, userData?.user.id) === true &&
                              !signUpData?.eventSignUp.isFull &&
                              hasClicked
                        }
                        autoHideDuration={3000}
                        onClose={() => setHasClicked(false)}
                        message="Du er nå påmeldt"
                      />
                    </>
                  )
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
