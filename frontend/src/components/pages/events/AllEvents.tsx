import { useQuery } from "@apollo/client";
import { ResultOf } from "@graphql-typed-document-node/core";
import { Tune } from "@mui/icons-material";
import { Button, Drawer, Unstable_Grid2 as Grid, Skeleton, Typography } from "@mui/material";
import React, { useState } from "react";

import { PermissionRequired } from "@/components/Auth";
import { EventsDocument } from "@/generated/graphql";

import { EventListItem } from "./EventListItem";
import { FilterMenu } from "./filterMenu/FilterMenu";
import { ManageEvents } from "./ManageEvents";

export type FilterQuery = {
  organization?: string;
  category?: string;
  startTime?: string;
  endTime?: string;
};

const EventSkeleton: React.FC = () => {
  const dummyEvent: NonNullable<ResultOf<typeof EventsDocument>["allEvents"]>[number] = {
    id: "loading",
    title: "Loading",
    shortDescription: "Loading",
    startTime: new Date().toISOString(),
    isFull: true,
    isAttendable: true,
    organization: {
      id: "loading",
    },
  };

  const EventListItemSkeleton = () => (
    <Skeleton variant="rounded" width="100%">
      <EventListItem event={dummyEvent} user={null} />
    </Skeleton>
  );

  return (
    <Grid container xs={12} md={9} direction="column" spacing={3}>
      <Grid xs>
        <EventListItemSkeleton />
      </Grid>
      <Grid xs>
        <EventListItemSkeleton />
      </Grid>
      <Grid xs>
        <EventListItemSkeleton />
      </Grid>
      <Grid xs>
        <EventListItemSkeleton />
      </Grid>
    </Grid>
  );
};

const Error: React.FC = () => (
  <Grid justifyContent="center" xs={12} md={9}>
    <Typography color="error" textAlign="center">
      Noe gikk galt, prøv igjen senere.
    </Typography>
  </Grid>
);

function filterEvents(
  events: NonNullable<ResultOf<typeof EventsDocument>["allEvents"]>,
  user: ResultOf<typeof EventsDocument>["user"]
): NonNullable<ResultOf<typeof EventsDocument>["allEvents"]> {
  const gradeYear = user?.gradeYear;
  if (gradeYear) {
    return events.filter((event) => event.allowedGradeYears?.includes(gradeYear));
  }

  return events;
}

export const AllEvents: React.FC = () => {
  const [filters, setFilters] = useState<FilterQuery>({});
  const [showDefaultEvents, setShowDefaultEvents] = useState(false);
  const [openFilterDrawer, setOpenFilterDrawer] = useState(false);

  const { loading, error, data } = useQuery(EventsDocument, {
    variables: {
      organization: filters.organization,
      category: filters.category,
      startTime: filters.startTime,
      endTime: filters.endTime,
    },
  });

  function handleFilterChange(newFilters: FilterQuery) {
    if (Object.keys(newFilters).length > 0 && showDefaultEvents) setShowDefaultEvents(false);
    setFilters(newFilters);
  }

  let displayedEvents: NonNullable<ResultOf<typeof EventsDocument>["allEvents"]> = data?.allEvents ?? [];
  if (showDefaultEvents) {
    displayedEvents = data?.defaultEvents ?? [];
  }

  displayedEvents = filterEvents(displayedEvents, data?.user);

  return (
    <Grid container direction="row" spacing={2}>
      <PermissionRequired permission="events.add_event">
        <Grid xs={12}>
          <ManageEvents />
        </Grid>
      </PermissionRequired>
      <Grid xs display={{ xs: "block", md: "none" }}>
        <Button
          variant="outlined"
          color="contrast"
          fullWidth
          startIcon={<Tune />}
          onClick={() => setOpenFilterDrawer(true)}
        >
          Filter
        </Button>
        <Drawer anchor="left" open={openFilterDrawer} onClose={() => setOpenFilterDrawer(false)}>
          <FilterMenu
            filters={filters}
            onFiltersChange={handleFilterChange}
            showDefaultEvents={showDefaultEvents}
            onShowDefaultChange={setShowDefaultEvents}
          />
        </Drawer>
      </Grid>
      <Grid display={{ xs: "none", md: "block" }} md={3}>
        <FilterMenu
          filters={filters}
          onFiltersChange={handleFilterChange}
          showDefaultEvents={showDefaultEvents}
          onShowDefaultChange={setShowDefaultEvents}
        />
      </Grid>
      {loading && <EventSkeleton />}
      {error && <Error />}
      <Grid container xs={12} md={9}>
        {displayedEvents.map((event) => (
          <Grid key={event.id} xs>
            <EventListItem event={event} user={data?.user} />
          </Grid>
        ))}
      </Grid>
    </Grid>
  );
};
