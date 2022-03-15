import { useQuery } from "@apollo/client";
import { GET_EVENT } from "@graphql/events/queries";
import { GET_USER } from "@graphql/users/queries";
import { Event } from "@interfaces/events";
import { User } from "@interfaces/users";
import { Box, Button, Container, CircularProgress, Grid, Typography, useTheme } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Edit, KeyboardBackspace, List } from "@material-ui/icons";
import DeleteIcon from "@material-ui/icons/Delete";
import Link from "next/link";
import React, { useState } from "react";
import Image from "next/image";
import EmptyStreet from "public/illustrations/EmptyStreet.svg";
import SignUpVariants from "./SignUpVariants";
import GeneralInfoCard from "./GeneralInfoCard";
import EditEvent from "../EventEditor";
import * as components from "@components/markdown/components";
import ReactMarkdown from "react-markdown";
import DeleteEventModal from "./DeleteEventModal";

const useStyles = makeStyles((theme) => ({
  container: {
    paddingTop: theme.spacing(9),
    paddingBottom: theme.spacing(9),
  },
  backButton: {
    marginLeft: -20,
  },
  loading: {
    padding: theme.spacing(5, 0),
  },
}));

type Props = {
  eventId: string;
};

const EventDetails: React.FC<Props> = ({ eventId }) => {
  const [extraInformation, setExtraInformation] = useState<string>();

  const { data: userData } = useQuery<{ user: User | null }>(GET_USER);

  const { data: eventData, loading: eventLoading } = useQuery<{
    event: Event;
  }>(GET_EVENT, { variables: { id: eventId }, errorPolicy: "all" });

  const classes = useStyles();
  const theme = useTheme();

  const [openEditEvent, setOpenEditEvent] = useState(false);
  const [openDeleteEvent, setOpenDeleteEvent] = useState(false);

  if (eventLoading) {
    return (
      <Grid container justifyContent="center" className={classes.loading}>
        <CircularProgress />
      </Grid>
    );
  }

  if (!eventData || !eventData.event)
    return (
      <Grid container justifyContent="center" className={classes.loading}>
        <Grid item>
          <Typography variant="body1" align="center">
            Arrangementet ble ikke funnet.
          </Typography>
        </Grid>
        <Grid item md={6} xs={10}>
          <Image src={EmptyStreet} alt="" />
        </Grid>
      </Grid>
    );

  return (
    <>
      {openEditEvent && (
        <EditEvent open={openEditEvent} onClose={() => setOpenEditEvent(false)} event={eventData.event} />
      )}

      {openDeleteEvent && (
        <DeleteEventModal
          open={openDeleteEvent}
          onClose={() => setOpenDeleteEvent(false)}
          eventId={eventData.event.id}
        />
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
            loading={eventLoading}
            extraInformation={extraInformation}
            onExtraInformationChange={setExtraInformation}
            eventId={eventId}
          />

          {userData?.user?.organizations.some(
            (organization) => organization.id === eventData.event.organization.id
          ) && (
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
              <Button
                variant="contained"
                size="large"
                startIcon={<DeleteIcon />}
                onClick={() => {
                  setOpenDeleteEvent(true);
                }}
              >
                Slett
              </Button>
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
            <ReactMarkdown components={components}>{eventData.event.description}</ReactMarkdown>
          </Grid>
          <GeneralInfoCard event={eventData.event} />
        </Grid>
      </Container>
    </>
  );
};

export default EventDetails;
