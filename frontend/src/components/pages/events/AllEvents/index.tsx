import { useQuery } from "@apollo/client";
import { GET_EVENTS_DEFAULT_EVENTS_AND_USERS } from "@graphql/events/queries";
import { Event } from "@interfaces/events";
import { User } from "@interfaces/users";
import { Button, CircularProgress, Drawer, Grid, Hidden, makeStyles, Typography } from "@material-ui/core";
import { Add, List, Tune } from "@material-ui/icons";
import Link from "next/link";
import React, { useState } from "react";
import EventListItem from "./EventListItem";
import FilterMenu from "./filterMenu";
import { FilterQuery } from "./types";

const useStyles = makeStyles((theme) => ({
  grid: {
    padding: theme.spacing(3, 0),
  },
  drawer: {
    width: 500,
    maxWidth: "80%",
  },
  loading: {
    padding: theme.spacing(5, 0),
  },
}));

const AllEvents: React.FC = () => {
  const classes = useStyles();
  const [filters, setFilters] = useState({});
  const [showDefaultEvents, setShowDefaultEvents] = useState(false);
  const [openFilterDrawer, setOpenFilterDrawer] = React.useState(false);

  const {
    loading,
    data: allData,
    error,
    refetch,
  } = useQuery<{ allEvents: Event[]; defaultEvents: Event[]; user: User }>(GET_EVENTS_DEFAULT_EVENTS_AND_USERS, {
    variables: filters,
    errorPolicy: "all",
  });

  if (loading)
    return (
      <Grid container justifyContent="center" className={classes.loading}>
        <CircularProgress />
      </Grid>
    );

  const data = (showDefaultEvents ? allData?.defaultEvents : allData?.allEvents)?.filter((event) =>
    userData?.user ? event.allowedGradeYears.includes(userData.user.gradeYear) : true
  );
  const userData = { user: allData?.user };

  if (!data && !userData.user && error) return <Typography variant="body1">Kunne ikke hente arrangementer.</Typography>;

  const onChange = (newFilters: FilterQuery) => {
    if (Object.keys(newFilters).length > 0 && showDefaultEvents) setShowDefaultEvents(false);
    setFilters(newFilters);
    refetch(newFilters);
  };

  return (
    <>
      <Hidden mdUp>
        <Button onClick={() => setOpenFilterDrawer(true)} variant="contained" startIcon={<Tune />}>
          Filter
        </Button>
        <Drawer
          PaperProps={{ className: classes.drawer }}
          anchor="left"
          open={openFilterDrawer}
          onClose={() => setOpenFilterDrawer(false)}
        >
          <FilterMenu
            filters={filters}
            onFiltersChange={onChange}
            showDefaultEvents={showDefaultEvents}
            onShowDefaultChange={setShowDefaultEvents}
          />
        </Drawer>
      </Hidden>
      <Grid container className={classes.grid} spacing={3}>
        <Hidden smDown>
          <Grid item md={3}>
            <FilterMenu
              filters={filters}
              onFiltersChange={onChange}
              showDefaultEvents={showDefaultEvents}
              onShowDefaultChange={setShowDefaultEvents}
            />
          </Grid>
        </Hidden>
        <Grid item xs>
          {userData && !loading && userData.user && !!userData.user.organizations.length && (
            <Link href="/events/create-event" passHref>
              <Button color="primary" disableRipple startIcon={<Add />}>
                Opprett
              </Button>
            </Link>
          )}
          {userData && !loading && userData.user && !!userData.user.organizations.length && (
            <Link
              href={userData.user.organizations.length > 1 ? "/orgs" : `/orgs/${userData.user.organizations[0].id}`}
              passHref
            >
              <Button color="primary" disableRipple startIcon={<List />}>
                Mine arrangementer
              </Button>
            </Link>
          )}
          {loading ? (
            <CircularProgress />
          ) : (
            <Grid container spacing={2}>
              {data === undefined || data.length === 0 ? (
                Object.keys(filters).length > 0 ? (
                  <Typography variant="body1">Ingen arrangementer passer til valgte filtre.</Typography>
                ) : (
                  <Typography variant="body1">Ingen arrangementer å vise.</Typography>
                )
              ) : (
                data.map((event) => <EventListItem key={event.id} event={event} user={userData?.user} />)
              )}
            </Grid>
          )}
        </Grid>
      </Grid>
    </>
  );
};

export default AllEvents;
