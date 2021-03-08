import { useQuery } from "@apollo/client";
import { QUERY_USER_ATTENDING_EVENT } from "@graphql/events/queries";
import { Event } from "@interfaces/events";
import { User } from "@interfaces/users";
import { Typography, Chip, useTheme, Box } from "@material-ui/core";
import Link from "next/link";
import React from "react";

const MONTHS = {
  "01": "januar",
  "02": "februar",
  "03": "mars",
  "04": "april",
  "05": "mai",
  "06": "juni",
  "07": "juli",
  "08": "august",
  "09": "september",
  "10": "oktober",
  "11": "november",
  "12": "desember",
};

const formatDate = (dateAndTime: string) => {
  const fullDate = dateAndTime.split("T")[0];
  const year = fullDate.split("-")[0];
  const month = MONTHS[fullDate.split("-")[1]];
  const date = fullDate.split("-")[2];
  const fullTime = dateAndTime.split("T")[1];
  const time = fullTime.slice(0, 5);
  return `${date}.${month} ${year}, kl. ${time}`;
};

interface Props {
  event: Event;
  user?: User;
  userIsValid?: boolean;
  classes: any;
}

const EventListItem: React.FC<Props> = ({ event, user, userIsValid, classes }) => {
  const theme = useTheme();

  const { data: userAttendingEventData } = useQuery(QUERY_USER_ATTENDING_EVENT, {
    variables: { eventId: event.id, userId: user?.id },
  });

  return (
    <Link href={`/events/${event.id}`} key={event.id}>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        className={classes.eventContainer}
        style={{ borderColor: event.organization?.color ?? theme.palette.primary.main }}
      >
        <Box>
          <Typography variant="h6">{event.title}</Typography>
          <Typography variant="body1">{formatDate(event.startTime)}</Typography>

          {event.shortDescription ?? "Trykk for å lese mer"}
        </Box>

        {userIsValid && event.isAttendable ? (
          userAttendingEventData?.userAttendingRelation.isFull ? (
            <Chip label="Venteliste tilgjengelig" />
          ) : userAttendingEventData?.userAttendingRelation.isSignedUp ? (
            <Chip color="primary" label="Påmeldt" />
          ) : userAttendingEventData?.userAttendingRelation.isOnWaitinglist ? (
            <Chip color="primary" label="På venteliste" />
          ) : (
            <Chip label="Påmelding tilgjengelig" />
          )
        ) : null}
      </Box>
    </Link>
  );
};

export default EventListItem;
