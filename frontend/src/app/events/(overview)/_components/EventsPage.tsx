"use client";

import { graphql } from "@/gql/app";
import { useSuspenseQuery } from "@apollo/client";
import { Close, Tune } from "@mui/icons-material";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Dialog,
  DialogContent,
  DialogTitle,
  Unstable_Grid2 as Grid,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { EventListItem } from "./EventListItem";
import { FilterMenu, Filters } from "./FilterMenu";

function EventsPage() {
  const [filters, setFilters] = useState<Filters | null>(null);
  const [filterMenuOpen, setFilterMenuOpen] = useState(false);

  const { data } = useSuspenseQuery(
    graphql(`
      query EventsPage($data: EventsInput!) {
        events(data: $data) {
          nextWeek {
            id
            ...EventListItem_Event
          }
          thisWeek {
            id
            ...EventListItem_Event
          }
          twoWeeksOrLater {
            id
            ...EventListItem_Event
          }
        }
        ...FilterMenu_Query
      }
    `),
    {
      variables: {
        data: {
          endBefore: filters?.endBefore ?? null,
          organizations: filters?.organizations ?? null,
          startAfter: filters?.startAfter ?? null,
          categories: filters?.categories ?? null,
          futureEventsOnly: true,
        },
      },
    }
  );

  const thisWeeksEvents = data.events.thisWeek;

  const nextWeeksEvents = data.events.nextWeek;

  const futureEvents = data.events.twoWeeksOrLater;

  return (
    <>
      <Dialog
        open={filterMenuOpen}
        onClose={() => setFilterMenuOpen(false)}
        maxWidth="md"
        fullWidth
        sx={{ display: { xs: "block", md: "none" } }}
      >
        <DialogTitle>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="inherit">Filter</Typography>
            <IconButton onClick={() => setFilterMenuOpen(false)}>
              <Close />
            </IconButton>
          </Stack>
        </DialogTitle>
        <DialogContent>
          <FilterMenu filters={filters} onFiltersChange={(filters) => setFilters(filters)} query={data} />
        </DialogContent>
      </Dialog>
      <Grid container direction="row" spacing={2}>
        <Grid md={3} sx={{ display: { xs: "none", md: "block" } }}>
          <Card>
            <CardHeader title="Filter" />
            <CardContent>
              <FilterMenu filters={filters} onFiltersChange={(filters) => setFilters(filters)} query={data} />
            </CardContent>
          </Card>
        </Grid>
        <Grid xs={12} sx={{ display: { xs: "block", md: "none" } }}>
          <Button
            fullWidth
            variant="outlined"
            color="secondary"
            startIcon={<Tune />}
            onClick={() => setFilterMenuOpen(true)}
          >
            Filter
          </Button>
        </Grid>
        <Grid xs={12} md={9}>
          <Stack direction="column" spacing={4}>
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
    </>
  );
}

export { EventsPage };
