import { Event } from "@interfaces/events";
import { User } from "@interfaces/users";
import { Typography, Chip, useTheme, Box } from "@material-ui/core";
import Link from "next/link";
import React from "react";

const MONTHS: Record<string, string> = {
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
  classes: any;
}

const EventListItem: React.FC<Props> = ({ event, user, classes }) => {
  const theme = useTheme();

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

        {user && event.isAttendable && event.allowedGradeYearsList.includes(user.gradeYear) ? (
          event.isFull && event.userAttendance?.isOnWaitingList ? (
            <Chip label="På venteliste" />
          ) : event.isFull && !event.userAttendance?.isSignedUp ? (
            <Chip color="primary" label="Venteliste tilgjengelig" />
          ) : event.userAttendance?.isSignedUp ? (
            <Chip color="primary" label="Påmeldt" />
          ) : (
            <Chip label="Påmelding tilgjengelig" />
          )
        ) : null}
      </Box>
    </Link>
  );
};

export default EventListItem;
