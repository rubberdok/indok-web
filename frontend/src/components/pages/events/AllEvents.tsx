import { useQuery } from "@apollo/client";
import { GET_DEFAULT_EVENTS, GET_EVENTS } from "@graphql/events/queries";
import { GET_USER } from "@graphql/users/queries";
import { User } from "@interfaces/users";
import { Button, CircularProgress, Grid, makeStyles, Typography } from "@material-ui/core";
import { Add, List } from "@material-ui/icons";
import Link from "next/link";
import React, { useState } from "react";
import EventListItem from "./EventListItem";
import FilterMenu from "./filterMenu/FilterMenu";

export interface FilterQuery {
  organization?: string;
  category?: string;
  startTime?: string;
  endTime?: string;
}

const useStyles = makeStyles((theme) => ({
  grid: {
    padding: theme.spacing(3),
    paddingTop: theme.spacing(2),
  },
  // eventContainer: {
  //   border: "solid",
  //   borderWidth: "0.05em 0.05em 0.05em 1.2em",
  //   borderRadius: "0.2em",
  //   padding: theme.spacing(2),
  //   marginBottom: theme.spacing(2),
  //   backgroundColor: "#fff",
  //   ["&:hover"]: {
  //     cursor: "pointer",
  //     backgroundColor: "#f5f5f5",
  //   },
  // },
}));

const AllEvents: React.FC = () => {
  const classes = useStyles();
  const [filters, setFilters] = useState({});
  const [showDefaultEvents, setShowDefaultEvents] = useState(false);

  const { loading: userLoading, data: userData } = useQuery<{ user: User }>(GET_USER);

  const { loading: eventsLoading, error: eventsError, data: eventsData, refetch } = useQuery(GET_EVENTS, {
    variables: filters,
  });

  const { loading: defaultEventsLoading, error: defaultEventsError, data: defaultEventsData } = useQuery(
    GET_DEFAULT_EVENTS
  );
  const error = showDefaultEvents ? defaultEventsError : eventsError;
  const loading = showDefaultEvents ? defaultEventsLoading : eventsLoading;
  const data = showDefaultEvents ? defaultEventsData?.defaultEvents : eventsData?.allEvents;

  if (loading || userLoading) return <Typography variant="body1">Laster..</Typography>;
  if (error) return <Typography variant="body1">Kunne ikke hente arrangementer.</Typography>;

  const onChange = (newFilters: FilterQuery) => {
    if (Object.keys(newFilters).length > 0 && showDefaultEvents) setShowDefaultEvents(false);
    setFilters(newFilters);
    refetch(newFilters);
  };

  return (
    <>
      <Grid container className={classes.grid} spacing={3}>
        <Grid item md={3}>
          <FilterMenu
            filters={filters}
            onFiltersChange={onChange}
            showDefaultEvents={showDefaultEvents}
            onShowDefaultChange={setShowDefaultEvents}
          />
        </Grid>
        <Grid item xs>
          {userData && !userLoading && userData.user && !!userData.user.organizations.length && (
            <Link href="/events/create-event" passHref>
              <Button color="primary" disableRipple startIcon={<Add />}>
                <Typography variant="body1">Opprett</Typography>
              </Button>
            </Link>
          )}
          {userData && !userLoading && userData.user && !!userData.user.organizations.length && (
            <Link
              href={userData.user.organizations.length > 1 ? "/orgs" : `/orgs/${userData.user.organizations[0].id}`}
              passHref
            >
              <Button color="primary" disableRipple startIcon={<List />}>
                <Typography variant="body1">Mine arrangementer</Typography>
              </Button>
            </Link>
          )}
          {loading ? (
            <CircularProgress />
          ) : (
            <>
              <Grid container spacing={2}>
                {data === undefined || data.length === 0 ? (
                  <Typography variant="body1">Ingen arrangementer passer til valgte filtre.</Typography>
                ) : (
                  data.map((event: Event) => (
                    <Grid key={event.id} item xs={12}>
                      <EventListItem event={event} user={userData?.user} />
                    </Grid>
                  ))
                )}
              </Grid>
            </>
          )}
        </Grid>
      </Grid>
    </>
  );
};

export default AllEvents;
