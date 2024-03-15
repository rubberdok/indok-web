"use client";
import { useQuery, useSuspenseQuery } from "@apollo/client";
import { CalendarToday, CreditCard, Email, Label, Place } from "@mui/icons-material";
import {
  Stack,
  Unstable_Grid2 as Grid,
  Divider,
  Card,
  CardHeader,
  CardContent,
  List,
  ListItem,
  Alert,
  ListItemIcon,
  ListItemText,
} from "@mui/material";

import { Link } from "@/app/components/Link";
import { Markdown } from "@/components/Markdown";
import { graphql } from "@/gql/app";
import dayjs from "@/lib/date";

import { AddToCalendar } from "./_components/AddToCalendar";
import { SignUp } from "./_components/SignUp";

const EventPageEventQuery = graphql(`
  query EventPage_EventQuery($data: EventInput!) {
    event(data: $data) {
      event {
        id
        name
        description
        signUpsEnabled
        location
        signUpsRetractable
        endAt
        startAt
        contactEmail
        ticketInformation {
          product {
            id
            price {
              valueInNok
            }
          }
        }
        categories {
          id
          name
        }
        ...EventSignUp_EventFragment
      }
    }
  }
`);

export default function Page({ params }: { params: { eventId: string } }) {
  const { data } = useSuspenseQuery(EventPageEventQuery, {
    variables: {
      data: {
        id: params.eventId,
      },
    },
  });
  useQuery(EventPageEventQuery, {
    pollInterval: 1000 * 30, // 30 seconds
    variables: {
      data: {
        id: params.eventId,
      },
    },
  });

  const { event } = data.event;
  return (
    <Grid container direction={{ xs: "column", md: "row" }} justifyContent="space-between" spacing={2}>
      <Grid xs={12} md={8}>
        <Stack spacing={2} divider={<Divider light />}>
          {event.signUpsEnabled && <SignUp event={event} />}
          <Markdown>{event.description}</Markdown>
        </Stack>
      </Grid>
      <Grid md xs={12}>
        <Card>
          <CardHeader title="Informasjon" />
          <CardContent>
            <List>
              {!event.signUpsRetractable && (
                <ListItem>
                  <Alert severity="warning" variant="outlined" sx={{ width: "100%" }}>
                    Arrangementet har bindende påmelding
                  </Alert>
                </ListItem>
              )}
              {event.ticketInformation?.product && (
                <ListItem>
                  <ListItemIcon>
                    <CreditCard />
                  </ListItemIcon>
                  <ListItemText primary="Pris" secondary={`${event.ticketInformation.product.price.valueInNok} kr`} />
                </ListItem>
              )}
              <ListItem>
                <ListItemIcon>
                  <CalendarToday />
                </ListItemIcon>
                <ListItemText primary="Starter" secondary={formatDate(event.startAt)} />
              </ListItem>
              {event.endAt && (
                <ListItem>
                  <ListItemIcon>
                    <CalendarToday />
                  </ListItemIcon>
                  <ListItemText primary="Slutter" secondary={formatDate(event.endAt)} />
                </ListItem>
              )}
              {event.location && (
                <ListItem>
                  <ListItemIcon>
                    <Place />
                  </ListItemIcon>
                  <ListItemText primary="Sted" secondary={event.location} />
                </ListItem>
              )}
              {event.categories?.map((category) => (
                <ListItem key={category.id}>
                  <ListItemIcon>
                    <Label />
                  </ListItemIcon>
                  <ListItemText primary="Kategori" secondary={category.name} />
                </ListItem>
              ))}
              {event.contactEmail && (
                <ListItem>
                  <ListItemIcon>
                    <Email />
                  </ListItemIcon>
                  <ListItemText
                    primary="Kontakt"
                    secondary={<Link href={`mailto:${event.contactEmail}`}>{event.contactEmail}</Link>}
                  />
                </ListItem>
              )}
              <ListItem>
                <AddToCalendar title={event.name} start={event.startAt} end={event.endAt} location={event.location} />
              </ListItem>
            </List>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}

function formatDate(date: string) {
  return dayjs(date).format("LLL");
}
