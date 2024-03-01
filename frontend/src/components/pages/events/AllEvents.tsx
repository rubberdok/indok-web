import { useQuery } from "@apollo/client";
import { Unstable_Grid2 as Grid, Stack, Typography } from "@mui/material";
import React from "react";

import { graphql } from "@/gql/pages";

import { EventListItem } from "./EventListItem";

export const AllEvents: React.FC = () => {
  const { error, data } = useQuery(
    graphql(`
      query EventsPage($data: EventsInput!) {
        events(data: $data) {
          nextWeek {
            id
            ...EventListItem
          }
          thisWeek {
            id
            ...EventListItem
          }
          twoWeeksOrLater {
            id
            ...EventListItem
          }
        }
        user {
          user {
            id
            gradeYear
          }
        }
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
      <Grid xs={12} md={9}>
        <Stack direction="column" spacing={4}>
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
