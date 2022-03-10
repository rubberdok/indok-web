import { useQuery } from "@apollo/client";
import { GET_EVENTS_DEFAULT_EVENTS_AND_USERS } from "@graphql/events/queries";
import { Event } from "@interfaces/events";
import { User } from "@interfaces/users";
import { Button, CircularProgress, Drawer, Grid, Hidden, makeStyles, Typography } from "@material-ui/core";
import { Add, List, Tune } from "@material-ui/icons";
import Link from "next/link";
import React, { useState } from "react";
import EmptyStreet from "public/illustrations/EmptyStreet.svg";
import Image from "next/image";
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
    refetch,
  } = useQuery<{ allEvents: Event[]; defaultEvents: Event[]; user: User | null }>(GET_EVENTS_DEFAULT_EVENTS_AND_USERS, {
    variables: filters,
    errorPolicy: "all",
  });

  if (loading)
    return (
      <Grid container justifyContent="center" className={classes.loading}>
        <CircularProgress />
      </Grid>
    );

  const eventsToShow = (showDefaultEvents ? allData?.defaultEvents : allData?.allEvents)?.filter((event) =>
    allData?.user ? event.allowedGradeYears.includes(allData.user.gradeYear) : true
  );

  const onChange = (newFilters: FilterQuery) => {
    if (Object.keys(newFilters).length > 0 && showDefaultEvents) setShowDefaultEvents(false);
    setFilters(newFilters);
    refetch(newFilters);
  };

  const displayEventsOrInfoMessage = (eventsToShow?: Event[]) => {
    if (eventsToShow === undefined || eventsToShow.length === 0) {
      if (Object.keys(filters).length > 0) {
        return (
          <>
            <Grid item>
              <Typography variant="body1" align="center">
                Ingen arrangementer passer til valgte filtre.
              </Typography>
            </Grid>
            <Grid item md={6} xs={10}>
              <Image src={EmptyStreet} alt="" />
            </Grid>
          </>
        );
      }
      return (
        <>
          <Grid item>
            <Typography variant="body1" align="center">
              Ingen arrangementer å vise.
            </Typography>
          </Grid>
          <Grid item md={6} xs={10}>
            <Image src={EmptyStreet} alt="" />
          </Grid>
        </>
      );
    }
    return eventsToShow.map((event) => <EventListItem key={event.id} event={event} user={allData?.user} />);
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
          {allData && allData.user && !!allData.user.organizations.length && (
            <>
              <Link href="/events/create-event" passHref>
                <Button color="primary" disableRipple startIcon={<Add />}>
                  Opprett
                </Button>
              </Link>

              <Link
                href={allData.user.organizations.length > 1 ? "/orgs" : `/orgs/${allData.user.organizations[0].id}`}
                passHref
              >
                <Button color="primary" disableRipple startIcon={<List />}>
                  Mine arrangementer
                </Button>
              </Link>
            </>
          )}

          <Grid container spacing={2}>
            {displayEventsOrInfoMessage(eventsToShow)}
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

export default AllEvents;
