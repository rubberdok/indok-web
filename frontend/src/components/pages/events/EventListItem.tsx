import { Event } from "@interfaces/events";
import { User } from "@interfaces/users";
import { Box, Card, CardActionArea, Chip, Grid, Typography, useMediaQuery, useTheme } from "@mui/material";
import makeStyles from '@mui/styles/makeStyles';
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

const useStyles = makeStyles((theme) => ({
  card: {
    display: "flex",
    borderLeft: "16px solid",
    padding: theme.spacing(3),
    alignItems: "flex-end",
    justifyContent: "space-between",

    [theme.breakpoints.down('md')]: {
      alignItems: "stretch",
      flexDirection: "column",
    },
  },
  cardContent: {},
}));

const EventListItem: React.FC<Props> = ({ event, user }) => {
  const theme = useTheme();
  const classes = useStyles();
  const smallScreen = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Grid item xs={12}>
      <Card>
        <Link href={`/events/${event.id}`} key={event.id}>
          <CardActionArea
            className={classes.card}
            style={{ borderColor: event.organization?.color ?? theme.palette.primary.main }}
          >
            <Box className={classes.cardContent}>
              <Typography variant="h4" gutterBottom>
                {event.title}
              </Typography>

              <Typography variant="body2">Dato: {formatDate(event.startTime)}</Typography>

              <Typography variant="body2" gutterBottom={smallScreen ?? "false"}>
                {event.shortDescription ?? "Trykk for å lese mer"}
              </Typography>
            </Box>
            {user && event.isAttendable && event.allowedGradeYears.includes(user.gradeYear) ? (
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
          </CardActionArea>
        </Link>
      </Card>
    </Grid>
  );
};

export default EventListItem;
