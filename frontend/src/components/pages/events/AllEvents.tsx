import { useQuery } from "@apollo/client";
import { GET_DEFAULT_EVENTS, GET_EVENTS } from "@graphql/events/queries";
import { GET_USER } from "@graphql/users/queries";
import useResponsive from "@hooks/useResponsive";
import { Event } from "@interfaces/events";
import { User } from "@interfaces/users";
import { Add, List, Tune } from "@mui/icons-material";
import { Button, CircularProgress, Drawer, Grid, Hidden, Paper, Stack, Typography } from "@mui/material";
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

const AllEvents: React.FC = () => {
  const [filters, setFilters] = useState({});
  const [showDefaultEvents, setShowDefaultEvents] = useState(false);
  const [openFilterDrawer, setOpenFilterDrawer] = React.useState(false);
  const isMobile = useResponsive("down", "sm");

  const { loading: userLoading, data: userData } = useQuery<{ user: User }>(GET_USER);

  const {
    loading: eventsLoading,
    error: eventsError,
    data: eventsData,
    refetch,
  } = useQuery<{ allEvents: Event[] }>(GET_EVENTS, {
    variables: filters,
  });

  const {
    loading: defaultEventsLoading,
    error: defaultEventsError,
    data: defaultEventsData,
  } = useQuery<{ defaultEvents: Event[] }>(GET_DEFAULT_EVENTS);
  const error = showDefaultEvents ? defaultEventsError : eventsError;
  const loading = showDefaultEvents ? defaultEventsLoading : eventsLoading;
  const data = (showDefaultEvents ? defaultEventsData?.defaultEvents : eventsData?.allEvents)?.filter((event) =>
    userData?.user ? event.allowedGradeYears.includes(userData.user.gradeYear) : true
  );

  if (error) return <Typography variant="body1">Kunne ikke hente arrangementer.</Typography>;

  const onChange = (newFilters: FilterQuery) => {
    if (Object.keys(newFilters).length > 0 && showDefaultEvents) setShowDefaultEvents(false);
    setFilters(newFilters);
    refetch(newFilters);
  };

  return (
    <>
      {!(loading || userLoading) && (
        <Paper
          sx={{
            py: 2,
            px: { xs: 0, md: 3 },
            bgcolor: { md: "secondary.main" },
            mb: { md: 5 },
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Hidden smDown>
            <Typography variant="h5" color="secondary.darker">
              Administrer
            </Typography>
          </Hidden>
          <Stack direction="row" spacing={1}>
            {userData && !userLoading && userData.user && !!userData.user.organizations.length && (
              <Link href="/events/create-event" passHref>
                <Button variant="contained" color="inherit" startIcon={<Add />}>
                  Opprett
                </Button>
              </Link>
            )}
            {userData && !userLoading && userData.user && !!userData.user.organizations.length && (
              <Link
                href={userData.user.organizations.length > 1 ? "/orgs" : `/orgs/${userData.user.organizations[0].id}`}
                passHref
              >
                <Button variant="contained" color="inherit" startIcon={<List />}>
                  Mine arrangementer
                </Button>
              </Link>
            )}
          </Stack>
        </Paper>
      )}
      {isMobile && (
        <>
          <Button
            fullWidth
            onClick={() => setOpenFilterDrawer(true)}
            variant="outlined"
            color="inherit"
            startIcon={<Tune />}
            sx={{ mb: 3 }}
          >
            Filtre
          </Button>
          <Drawer anchor="left" open={openFilterDrawer} onClose={() => setOpenFilterDrawer(false)}>
            <FilterMenu
              filters={filters}
              onFiltersChange={onChange}
              showDefaultEvents={showDefaultEvents}
              onShowDefaultChange={setShowDefaultEvents}
            />
          </Drawer>
        </>
      )}
      <Grid container spacing={3}>
        {!isMobile && (
          <Grid item md={3}>
            <Paper variant="outlined">
              <FilterMenu
                filters={filters}
                onFiltersChange={onChange}
                showDefaultEvents={showDefaultEvents}
                onShowDefaultChange={setShowDefaultEvents}
              />
            </Paper>
          </Grid>
        )}
        <Grid item xs={12} md={9}>
          {!(loading || userLoading) && (
            <>
              {loading ? (
                <CircularProgress />
              ) : data === undefined || data.length === 0 ? (
                <Typography variant="body1">Ingen arrangementer passer til valgte filtre.</Typography>
              ) : (
                <Stack spacing={3}>
                  {data.map((event) => (
                    <EventListItem key={event.id} event={event} user={userData?.user} />
                  ))}
                </Stack>
              )}
            </>
          )}
        </Grid>
      </Grid>
    </>
  );
};

export default AllEvents;
