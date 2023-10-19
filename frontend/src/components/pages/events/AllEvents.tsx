import { useQuery } from "@apollo/client";
import { ResultOf } from "@graphql-typed-document-node/core";
import { Tune } from "@mui/icons-material";
import { Button, Drawer, Unstable_Grid2 as Grid, Skeleton, Stack, Typography } from "@mui/material";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import React, { useState } from "react";

import { PermissionRequired } from "@/components";
import { EventsDocument } from "@/generated/graphql";

import { EventListItem } from "./EventListItem";
import { FilterMenu } from "./FilterMenu";
import { ManageEvents } from "./ManageEvents";

dayjs.extend(isSameOrBefore);
dayjs.extend(isBetween);

export type FilterQuery = {
  organization?: string;
  category?: string;
  startTime?: string;
  endTime?: string;
};

const EventListItemSkeleton = () => {
  const dummyEvent: NonNullable<ResultOf<typeof EventsDocument>["allEvents"]>[number] = {
    id: "loading",
    title: "Loading",
    shortDescription: "Loading",
    startTime: new Date("2020-08-07T21:17:46").toISOString(),
    isFull: true,
    isAttendable: true,
    organization: {
      id: "loading",
    },
  };

  return (
    <Skeleton variant="rounded" width="100%">
      <EventListItem event={dummyEvent} user={null} />
    </Skeleton>
  );
};

const EventSkeleton: React.FC = () => (
  <Stack spacing={4} direction="column">
    <Stack spacing={2} direction="column">
      <Typography variant="h4" component="span">
        <Skeleton width="100%" />
      </Typography>
      <EventListItemSkeleton />
      <EventListItemSkeleton />
    </Stack>
    <Stack spacing={2} direction="column">
      <Typography variant="h4" component="span">
        <Skeleton width="100%" />
      </Typography>
      <EventListItemSkeleton />
      <EventListItemSkeleton />
    </Stack>
  </Stack>
);

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

  let userRelevantEvents: NonNullable<ResultOf<typeof EventsDocument>["allEvents"]> = data?.allEvents ?? [];
  if (showDefaultEvents) {
    userRelevantEvents = data?.defaultEvents ?? [];
  }

  userRelevantEvents = filterEvents(userRelevantEvents, data?.user);

  const thisWeeksEvents = userRelevantEvents.filter((event) => {
    const eventDate = dayjs(event.startTime);
    const nextWeek = dayjs().add(1, "week");
    return eventDate.isBefore(nextWeek, "week");
  });

  const nextWeeksEvents = userRelevantEvents.filter((event) => {
    const eventDate = dayjs(event.startTime);
    const nextWeek = dayjs().add(1, "week");
    const twoWeeks = dayjs().add(2, "week");
    return eventDate.isBetween(nextWeek, twoWeeks, "week", "[)");
  });

  const futureEvents = userRelevantEvents.filter((event) => {
    const eventDate = dayjs(event.startTime);
    const twoWeeks = dayjs().add(2, "week");
    return eventDate.isSameOrAfter(twoWeeks, "week");
  });

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
          color="secondary"
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
      <Grid xs={12} md={9}>
        <Stack direction="column" spacing={4}>
          {loading && <EventSkeleton />}
          {error && (
            <Typography color="error" textAlign="center">
              Noe gikk galt, prøv igjen senere.
            </Typography>
          )}
          {thisWeeksEvents.length > 0 && (
            <Stack direction="column" spacing={2}>
              <Typography variant="h4" component="h2">
                Denne uken
              </Typography>
              {thisWeeksEvents.map((event) => (
                <EventListItem key={event.id} event={event} user={data?.user} />
              ))}
            </Stack>
          )}
          {nextWeeksEvents.length > 0 && (
            <Stack direction="column" spacing={2}>
              <Typography variant="h4" component="h2">
                Neste uke
              </Typography>
              {nextWeeksEvents.map((event) => (
                <EventListItem key={event.id} event={event} user={data?.user} />
              ))}
            </Stack>
          )}
          {futureEvents.length > 0 && (
            <Stack direction="column" spacing={2}>
              <Typography variant="h4" component="h2">
                Fremtidige arrangementer
              </Typography>
              {futureEvents.map((event) => (
                <EventListItem key={event.id} event={event} user={data?.user} />
              ))}
            </Stack>
          )}
        </Stack>
      </Grid>
    </Grid>
  );
};

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
