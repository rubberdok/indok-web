import { Box, Button, Grid, Link as MuiLink, Paper, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { ArrowRight, ContactMail, ErrorOutline } from "@material-ui/icons";
import CategoryIcon from "@material-ui/icons/Category";
import CreditCard from "@material-ui/icons/CreditCard";
import EventIcon from "@material-ui/icons/Event";
import LocationOnIcon from "@material-ui/icons/LocationOn";
import dayjs from "dayjs";
import { calendarFile } from "@utils/calendars";
import React from "react";
import { Event } from "@interfaces/events";

const useStyles = makeStyles((theme) => ({
  paper: {
    color: theme.palette.text.primary,
    padding: theme.spacing(2),
    height: "100%",
  },
  paragraph: {
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    display: "inline-block",
  },
  innerParagraph: {},
  wrapIcon: {
    alignItems: "center",
    display: "inline-flex",
    width: "100%",
    marginBottom: theme.spacing(1),

    "& > svg": {
      height: "unset",
      marginRight: theme.spacing(2),
    },
  },
}));

/*
 * Shows general info about the event
 */

type Props = {
  event: Event;
};

const GeneralInfoCard: React.FC<Props> = ({ event }) => {
  const classes = useStyles();

  return (
    <Grid item xs={12} md={4}>
      <Paper className={classes.paper}>
        <Box my={2} mx={2}>
          <Typography variant="h4" gutterBottom>
            Info
          </Typography>
          {event?.attendable?.price && (
            <Typography variant="body1" className={classes.wrapIcon}>
              <CreditCard fontSize="small" /> {event.attendable?.price} kr
            </Typography>
          )}
          {event.location && (
            <Typography variant="body1" className={classes.wrapIcon}>
              <LocationOnIcon fontSize="small" /> {event.location}
            </Typography>
          )}
          {event.category && (
            <Typography variant="body1" className={classes.wrapIcon}>
              <CategoryIcon fontSize="small" /> {event.category?.name}
            </Typography>
          )}
          {event.contactEmail && (
            <Typography variant="body1" className={classes.wrapIcon}>
              <ContactMail fontSize="small" />
              <MuiLink href={`mailto:${event.contactEmail}`}>{event.contactEmail}</MuiLink>
            </Typography>
          )}
          {event?.attendable?.bindingSignup && (
            <Typography variant="body1" className={classes.wrapIcon} color="error">
              <ErrorOutline fontSize="small" /> Bindende påmelding
            </Typography>
          )}
          <Typography variant="overline">Starter</Typography>
          <Typography variant="body1" className={classes.wrapIcon}>
            <EventIcon fontSize="small" />
            {dayjs(event.startTime).format("DD.MMM YYYY, kl. HH:mm")}
          </Typography>
          {event.endTime && (
            <>
              <Typography variant="overline">Slutter</Typography>
              <Typography variant="body1" className={classes.wrapIcon}>
                <EventIcon fontSize="small" /> {dayjs(event.endTime).format("DD.MMM YYYY, kl. HH:mm")}
              </Typography>
            </>
          )}
          <Button
            variant="text"
            href={calendarFile(event.title, event.startTime, event.endTime, event.location, event.description)}
            download="event.ics"
          >
            Last ned i kalender
          </Button>
          {event.allowedGradeYears.length < 5 && (
            <>
              <Typography variant="overline" gutterBottom>
                Åpent for
              </Typography>
              {event.allowedGradeYears.map((grade) => (
                <Typography variant="body1" className={classes.wrapIcon} key={grade}>
                  <ArrowRight fontSize="small" /> {`${grade}. klasse`}
                </Typography>
              ))}
            </>
          )}
        </Box>
      </Paper>
    </Grid>
  );
};

export default GeneralInfoCard;
