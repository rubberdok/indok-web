import { useMutation, useQuery } from "@apollo/client";
import { EVENT_SIGN_OFF, EVENT_SIGN_UP } from "@graphql/events/mutations";
import { GET_EVENT } from "@graphql/events/queries";
import { GET_USER } from "@graphql/users/queries";
import { Event } from "@interfaces/events";
import { User } from "@interfaces/users";
import { Box, Button, Container, Grid, Typography, useTheme } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Edit, KeyboardBackspace, List } from "@material-ui/icons";
import Link from "next/link";
import React, { useState } from "react";
import SignUpVariants from "./SignUpVariants";
import GeneralInfoCard from "./GeneralInfoCard";
import Alert from "@components/Alert";
import EditEvent from "../EventEditor";
import { formatDescription } from "./helpers";

const useStyles = makeStyles((theme) => ({
  container: {
    paddingTop: theme.spacing(9),
    paddingBottom: theme.spacing(9),
  },
  paragraph: {
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    display: "inline-block",
  },
  innerParagraph: {},
  backButton: {
    marginLeft: -20,
  },
}));

type Props = {
  eventId: string;
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

  const {
    data: eventData,
    loading: eventLoading,
    refetch: refetchEventData,
  } = useQuery<{
    event: Event;
  }>(GET_EVENT, { variables: { id: eventId }, errorPolicy: "all" });

  const classes = useStyles();
  const theme = useTheme();

  const [openEditEvent, setOpenEditEvent] = useState(false);

  if (!eventData || !eventData.event) return <Typography variant="body1">Kunne ikke laste arrangementet</Typography>;

  const handleClick = () => {
    if (!userData?.user) return;
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

          <SignUpVariants
            event={eventData.event}
            user={userData?.user}
            loading={signOffLoading || signUpLoading || eventLoading}
            extraInformation={extraInformation}
            onClick={handleClick}
            onExtraInformationChange={setExtraInformation}
          />

          {userData?.user?.organizations
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
          <GeneralInfoCard event={eventData.event} />
        </Grid>
      </Container>

      {/* Alerts */}
      <Alert
        severity="error"
        open={openSignUpErrorSnackbar}
        onClose={() => setOpenSignUpErrorSnackbar(false)}
        description={signUpError ? signUpError.message : "Påmelding feilet"}
      />

      <Alert
        open={openSignOffErrorSnackbar}
        severity="error"
        onClose={() => setOpenSignUpErrorSnackbar(false)}
        description={"Avmelding feilet"}
      />

      <Alert
        severity="info"
        open={openSignOffSnackbar}
        onClose={() => setOpenSignOffSnackbar(false)}
        description={"Du er nå avmeldt"}
      />

      <Alert
        severity="success"
        open={openSignUpSnackbar}
        onClose={() => setOpenSignUpSnackbar(false)}
        description={"Du er nå påmeldt"}
      />

      <Alert
        severity="info"
        open={openOnWaitingListSnackbar}
        onClose={() => setOpenOnWaitingListSnackbar(false)}
        description={"Du er på ventelisten"}
      />

      <Alert
        severity="info"
        open={openOffWaitingListSnackbar}
        onClose={() => setOpenOffWaitingListSnackbar(false)}
        description={"Du er ikke lenger på ventelisten"}
      />
    </>
  );
};

export default EventDetails;
