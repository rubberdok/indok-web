import { useQuery } from "@apollo/client";
import { Unstable_Grid2 as Grid, Skeleton, Stack, Typography } from "@mui/material";
import React from "react";

import { PermissionRequired } from "@/components";
import { graphql } from "@/gql/pages";
import { SignUpAvailability } from "@/gql/pages/graphql";

import { EventListItem } from "./EventListItem";
import { ManageEvents } from "./ManageEvents";

const EventListItemSkeleton = () => {
  const dummyEvent = {
    id: "loading",
    name: "Loading",
    description: "Loading",
    startAt: new Date("2020-08-07T21:17:46").toISOString(),
    signUpAvailability: SignUpAvailability.NotOpen,
    organization: {
      id: "loading",
    },
  };

  return (
    <Skeleton variant="rounded" width="100%">
      <EventListItem event={dummyEvent} />
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
  const { loading, error, data } = useQuery(
    graphql(`
      query EventsPage($data: EventsInput!) {
        events(data: $data) {
          nextWeek {
            ...EventFragment
          }
          thisWeek {
            ...EventFragment
          }
          twoWeeksOrLater {
            ...EventFragment
          }
        }
        user {
          user {
            id
            gradeYear
          }
        }
      }

      fragment EventFragment on Event {
        id
        name
        description
        categories {
          id
          name
        }
        startAt
        endAt
        signUpsEnabled
        signUpAvailability
      }
    `),
    {
      variables: {
        data: {
          futureEventsOnly: true,
        },
      },
    }
  );

  const thisWeeksEvents = data?.events.thisWeek ?? [];

  const nextWeeksEvents = data?.events.nextWeek ?? [];

  const futureEvents = data?.events.twoWeeksOrLater ?? [];

  return (
    <Grid container direction="row" spacing={2}>
      <PermissionRequired permission="events.add_event">
        <Grid xs={12}>
          <ManageEvents />
        </Grid>
      </PermissionRequired>
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
                <EventListItem key={event.id} event={event} />
              ))}
            </Stack>
          )}
          {nextWeeksEvents.length > 0 && (
            <Stack direction="column" spacing={2}>
              <Typography variant="h4" component="h2">
                Neste uke
              </Typography>
              {nextWeeksEvents.map((event) => (
                <EventListItem key={event.id} event={event} />
              ))}
            </Stack>
          )}
          {futureEvents.length > 0 && (
            <Stack direction="column" spacing={2}>
              <Typography variant="h4" component="h2">
                Fremtidige arrangementer
              </Typography>
              {futureEvents.map((event) => (
                <EventListItem key={event.id} event={event} />
              ))}
            </Stack>
          )}
        </Stack>
      </Grid>
    </Grid>
  );
};
