import { useQuery } from "@apollo/client";
import { GET_USER } from "@graphql/auth/queries";
import { GET_EVENTS } from "@graphql/events/queries";
import { Event } from "@interfaces/events";
import { User } from "@interfaces/users";
import {
  Button,
  Grid,
  Typography,
  CircularProgress,
  Paper,
  Tabs,
  Tab,
  Container,
  makeStyles,
  useTheme,
} from "@material-ui/core";
import Link from "next/link";
import { PlusSquare } from "react-feather";
import React, { useState } from "react";
import { DATAPORTEN_SCOPES, generateAuthURL } from "../../../navbar/utils";
import FilterMenu from "./FilterMenu/index";

export interface FilterQuery {
  organization?: string;
  category?: string;
  startTime?: string;
  endTime?: string;
}

const signInURL = generateAuthURL(
  process.env.NEXT_PUBLIC_DATAPORTEN_ID,
  process.env.NEXT_PUBLIC_DATAPORTEN_STATE,
  process.env.NEXT_PUBLIC_DATAPORTEN_REDIRECT_URI,
  DATAPORTEN_SCOPES
);

const useStyles = makeStyles((theme) => ({
  container: {
    padding: 0,
  },
  tabsContainer: {
    width: "fit-content",
    float: "left",
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
}));

const AllEvents: React.FC = () => {
  const [filters, setFilters] = useState({});
  const [showCalenderView, setShowCalenderView] = useState(false);
  const { loading: userLoading, error: userError, data: userData } = useQuery<{ user: User }>(GET_USER);
  const { loading, error, data, refetch } = useQuery(GET_EVENTS, {
    variables: filters,
  });
  const classes = useStyles();
  const theme = useTheme();

  if (error) return <Typography variant="body1">Kunne ikke hente arrangementer.</Typography>;

  const onChange = (newFilters: FilterQuery) => {
    setFilters(newFilters);
    refetch(newFilters);
  };

  return (
    <Container className={classes.container}>
      <Container className={classes.headerContainer}>
        <Container className={classes.tabsContainer}>
          <Paper square>
            <Tabs
              value={showCalenderView ? 1 : 0}
              onChange={() => setShowCalenderView(!showCalenderView)}
              indicatorColor="primary"
              textColor="primary"
              className={classes.tabs}
            >
              <Tab label="Liste" />
              <Tab label="Kalender" />
            </Tabs>
          </Paper>
        </Container>

        {userData && !userLoading && userData.user && !userError && (
          // TODO: Redirect til `/events/create-event` når vi har funksjonalitet for dette.
          <Container className={classes.createButtonContainer}>
            <Link href={`/events/create-event`}>
              <Button color="primary">
                <PlusSquare />
                <Typography variant="body1">Opprett</Typography>
              </Button>
            </Link>
          </Container>
        )}
      </Container>

      <Grid container className={classes.grid}>
        <Grid item xs={3}>
          <FilterMenu filters={filters} onChange={onChange} />
        </Grid>
        <Grid item xs>
          {loading ? (
            <Container className={classes.progessContainer}>
              <CircularProgress />
            </Container>
          ) : showCalenderView ? (
            <Typography variant="body1">Kommer snart! :)</Typography>
          ) : (
            <>
              {data?.allEvents === undefined || data.allEvents.length === 0 ? (
                <Typography variant="body1">Ingen arrangementer passer til valgte filtre.</Typography>
              ) : (
                data.allEvents.map((event: Event) => (
                  <Link href={`/events/${event.id}`} key={event.id}>
                    <Container
                      className={classes.eventContainer}
                      style={{ borderColor: event.organization?.color ?? theme.palette.primary.main }}
                    >
                      <Typography variant="h6">{event.title}</Typography>
                      <Grid container>
                        <Grid item xs>
                          <Typography variant="body1">
                            Begynner {event.startTime.slice(0, 19).replace("T", " ")}
                          </Typography>
                        </Grid>
                        {userData && !userLoading && userData.user && !userError && event.isAttendable ? (
                          userData?.user.events.some((userevent) => event.id === userevent.id) ? (
                            <Typography variant="body1">Påmeldt</Typography>
                          ) : (
                            <Typography variant="body1">Påmelding tilgjengelig</Typography>
                          )
                        ) : null}
                      </Grid>
                    </Container>
                  </Link>
                ))
              )}
            </>
          )}
        </Grid>
      </Grid>
    </Container>
  );
};

export default AllEvents;
