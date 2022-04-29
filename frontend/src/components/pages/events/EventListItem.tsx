import useResponsive from "@hooks/useResponsive";
import { Event } from "@interfaces/events";
import { User } from "@interfaces/users";
import { Card, CardActionArea, Chip, styled, Typography } from "@mui/material";
import dayjs from "dayjs";
import nb from "dayjs/locale/nb";
import Link from "next/link";
import React from "react";

const formatDate = (dateAndTime: string) => {
  return dayjs(dateAndTime).locale(nb).format(`D. MMM`);
};

interface Props {
  event: Event;
  user?: User;
}

const EventActionCardStyle = styled((props) => <CardActionArea {...props} />)(({ theme }) => ({
  display: "flex",
  borderLeft: "16px solid",
  padding: theme.spacing(3),
  alignItems: "flex-end",
  justifyContent: "space-between",

  [theme.breakpoints.down("md")]: {
    alignItems: "stretch",
    flexDirection: "column",
  },
}));

const EventListItem: React.FC<Props> = ({ event, user }) => {
  const isMobile = useResponsive("down", "md");

  return (
    <Card>
      <Link passHref href={`/events/${event.id}`} key={event.id}>
        <EventActionCardStyle sx={{ borderColor: event.organization?.color ?? "primary.main" }}>
          <div>
            <Typography variant="h4" gutterBottom>
              {event.title}
            </Typography>

            <Typography variant="body2">Dato: {formatDate(event.startTime)}</Typography>

            <Typography variant="body2" gutterBottom={!isMobile}>
              {event.shortDescription ?? "Trykk for å lese mer"}
            </Typography>
          </div>
          {user && event.isAttendable && event.allowedGradeYears.includes(user.gradeYear) ? (
            event.isFull && event.userAttendance?.isOnWaitingList ? (
              <Chip label="På venteliste" />
            ) : event.isFull && !event.userAttendance?.isSignedUp ? (
              <Chip label="Venteliste tilgjengelig" />
            ) : event.userAttendance?.isSignedUp ? (
              <Chip variant="outlined" color="primary" label="Påmeldt" />
            ) : (
              <Chip color="primary" label="Påmelding tilgjengelig" />
            )
          ) : null}
        </EventActionCardStyle>
      </Link>
    </Card>
  );
};

export default EventListItem;
