import { Event } from "@interfaces/events";
import { User } from "@interfaces/users";
import { Box, Card, CardActionArea, Grid, makeStyles, Typography, useMediaQuery, useTheme } from "@material-ui/core";
import dayjs from "dayjs";
import nb from "dayjs/locale/nb";
import Link from "next/link";
import React from "react";
import EventListChip from "./EventListChip";

const formatDate = (dateAndTime: string) => {
  return dayjs(dateAndTime).locale(nb).format(`D. MMM`);
};

type Props = {
  event: Event;
  user?: User | null;
};

const useStyles = makeStyles((theme) => ({
  card: {
    display: "flex",
    borderLeft: "16px solid",
    padding: theme.spacing(3),
    alignItems: "flex-end",
    justifyContent: "space-between",

    [theme.breakpoints.down("sm")]: {
      alignItems: "stretch",
      flexDirection: "column",
    },
  },
  cardContent: {},
}));

const EventListItem: React.FC<Props> = ({ event, user }) => {
  const theme = useTheme();
  const classes = useStyles();
  const smallScreen = useMediaQuery(theme.breakpoints.down("sm"));

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

            <EventListChip event={event} user={user} />
          </CardActionArea>
        </Link>
      </Card>
    </Grid>
  );
};

export default EventListItem;
