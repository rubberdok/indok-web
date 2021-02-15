import { useMutation, useQuery } from "@apollo/client";
import { GET_USER } from "@graphql/auth/queries";
import { EVENT_SIGN_OFF, EVENT_SIGN_UP } from "@graphql/events/mutations";
import { Event } from "@interfaces/events";
import { User } from "@interfaces/users";
import { Button, CssBaseline, Paper, Divider, Grid, Snackbar, Typography, useTheme } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import CategoryIcon from "@material-ui/icons/Category";
import EventIcon from "@material-ui/icons/Event";
import LocationOnIcon from "@material-ui/icons/LocationOn";
import ScheduleIcon from "@material-ui/icons/Schedule";
import { Container } from "next/app";
import Link from "next/link";
import React from "react";
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
    textAlign: "center",
    color: theme.palette.text.secondary,
    padding: theme.spacing(2),
    // backgroundColor: "lightgrey",
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
  if (!userId) return false;
  return event.signedUpUsers?.some((user) => user.id === userId);
}

const EventDetailPage: React.FC<Props> = ({ eventId }) => {
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

  if (data.event)
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
                <Typography variant="overline" display="block" className={classes.publisherContainer}>
                  Arrangert av
                </Typography>
                <Typography
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
              <Grid container direction="column" justify="flex-end">
                Description goes here
              </Grid>
            </Paper>
          </Grid>

          {/* Information card */}
          <Grid item xs={4}>
            <Paper variant="outlined" className={classes.paper}>
              {/* <Grid item xs={4} direction="column" className={classes.detailContainer}> */}
              <Grid item>
                <Typography variant="overline" display="block" className={classes.publisherContainer}>
                  Info{" "}
                </Typography>
                <Typography gutterBottom>
                  <LocationOnIcon fontSize="small" /> {data.event.location}
                </Typography>
                <Typography gutterBottom>
                  <CategoryIcon fontSize="small" /> {getName(data.event.category)}{" "}
                </Typography>
              </Grid>

              <Grid item xs={4}>
                <Typography variant="overline" display="block" className={classes.publisherContainer}>
                  Starter{" "}
                </Typography>
              </Grid>
              <Typography gutterBottom>
                <EventIcon fontSize="small" /> {parseDate(data.event.startTime).split(" ")[0]}{" "}
              </Typography>
              <Typography gutterBottom>
                <ScheduleIcon fontSize="small" /> kl. {parseDate(data.event.startTime).split(" ")[1].slice(0, 5)}
              </Typography>

              <Typography variant="overline" display="block" className={classes.publisherContainer}>
                Slutter{" "}
              </Typography>
              <Typography gutterBottom>
                <EventIcon fontSize="small" /> {parseDate(data.event.endTime).split(" ")[0]}{" "}
              </Typography>
              <Typography gutterBottom>
                <ScheduleIcon fontSize="small" /> kl. {parseDate(data.event.endTime).split(" ")[1].slice(0, 5)}
              </Typography>
              {/* </Grid> */}
            </Paper>
          </Grid>

          {/* Buttons row card */}
          <Grid item justify="space-between" xs={12}>
            <Paper variant="outlined" className={classes.paper}>
              <Grid item justify="space-between" xs={12}>
                <Grid item>
                  <Button variant="outlined" color="primary" className={classes.buttons}>
                    Meld på!
                  </Button>
                </Grid>

                <Grid item>
                  <Link href={`/events`}>
                    <Button>Tilbake</Button>
                  </Link>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        </Grid>

        <>
          <CssBaseline />

          {/* <Typography variant="overline" display="block" align="center">
            Arrangert av {getName(data.event.organization)}.
            </Typography> */}

          <Grid container spacing={2} className={classes.mainContainer}>
            <Grid container item xs={8} direction="column">
              <Typography variant="h5" gutterBottom>
                Beskrivelse
              </Typography>
              <Typography variant="body1">{data.event.description}</Typography>
              <Grid container justify="center">
                <Typography variant="overline" display="block" className={classes.publisherContainer}>
                  Publisert av{" "}
                </Typography>
                <Typography
                  variant="overline"
                  display="block"
                  style={{ fontWeight: 600 }}
                  className={classes.publisherContainer}
                >
                  &nbsp;&nbsp;{`${data.event.publisher.firstName} ${data.event.publisher.lastName}`}
                </Typography>
              </Grid>
            </Grid>
            <Divider variant="middle" className={classes.mainDivider} orientation="vertical" flexItem />
          </Grid>

          <hr />

          <Container className={classes.buttonsContainer}>
            <Button variant="outlined" color="primary" className={classes.buttons}>
              Meld på!
            </Button>
            <Link href={`/events`}>
              <Button>Tilbake</Button>
            </Link>
          </Container>

          {data.event.isAttendable && userData?.user ? (
            data.event.signedUpUsers.length === data.event.availableSlots ? (
              <Typography variant="body1" color="primary">
                Arrangementet er fullt
              </Typography>
            ) : (
              <>
                <Button variant="contained" loading={signOffLoading || signUpLoading} onClick={handleClick}>
                  <Typography variant="body1">
                    {isSignedUp(data.event, userData?.user.id) ? "Meld av" : "Meld på"}
                  </Typography>
                </Button>
                <Snackbar
                  severity="error"
                  anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                  open={signUpData?.eventSignUp.isFull}
                  autoHideDuration={5000}
                  message="Arrangementet er fullt"
                />
              </>
            )
          ) : null}
        </>
      </div>
      /*<div>
        <h2 style={{ marginTop: -10, marginBottom: 10, textAlign: "center" }}>Event details</h2>
        <div style={{ marginBottom: 15 }}>
          <h4 style={{ margin: 0 }}>Påkrevde felt</h4>
          Id: {data.event.id}
          <br />
          Tittel: {data.event.title}
          <br />
          Starttid: {parseDate(data.event.startTime)}
          <br />
          Publisert av: {`${data.event.publisher.firstName} ${data.event.publisher.lastName}`}
          <br />
          Krever påmelding: {data.event.isAttendable ? "Ja" : "Nei"}
          <br />
          Beskrivelse: {data.event.description}
          <br />
        </div>

        <div>
          <h4 style={{ margin: 0 }}>Frivillige felt</h4>
          Sluttid: {parseDate(data.event.endTime)}
          <br />
          Lokasjon: {data.event.location}
          <br />
          Organisasjon: {getName(data.event.organization)}
          <br />
          Kategori: {getName(data.event.category)}
          <br />
          Bilde URL: {data.event.image}
          <br />
          Deadline for påmelding: {parseDate(data.event.deadline)}
          <br />
        </div>
      </div>*/
    );
  else return null;
};

/*<>
          <CssBaseline />
          <Paper>
            <Typography component="h1" variant="h4" align="center">
              Opprett arrangement
            </Typography>
            <List>

            {products.map((product) => (
              <ListItem className={classes.listItem} key={product.name}>
                <ListItemText primary={product.name} secondary={product.desc} />
                <Typography variant="body2">{product.price}</Typography>
              </ListItem>
            ))}
            </List>
            
            <>
              <>
                <Typography variant="h5" gutterBottom>
                  Thank you for your order.
                </Typography>
                <Typography variant="subtitle1">
                  Your order number is #2001539. We have emailed your order confirmation, and will send you an update
                  when your order has shipped.
                </Typography>
              </>
            </>
          </Paper>
          <Copyright />
        </>
      </div>
    );
  else return null;
};*/

export default EventDetailPage;
