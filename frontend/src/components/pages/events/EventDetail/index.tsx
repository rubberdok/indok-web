import { CalendarToday, CreditCard, Email, Label, Place } from "@mui/icons-material";
import {
  Alert,
  Card,
  CardContent,
  CardHeader,
  Container,
  Divider,
  Unstable_Grid2 as Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Stack,
} from "@mui/material";
import React from "react";

import { Link, Markdown, Title } from "@/components";
import { FragmentType, getFragmentData, graphql } from "@/gql/pages";
import dayjs from "@/lib/date";

import { AddToCalendar } from "./AddToCalendar";
import { ManageEvent } from "./ManageEvent";
import { SignUp } from "./SignUp";

const EventDetailFragment = graphql(`
  fragment EventDetailFields on Event {
    id
    name
    description
    organization {
      id
      name
    }
    location
    startAt
    endAt
    signUpsEnabled
    contactEmail
    signUpsRetractable
    type
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
`);

const UserOrganizationFragment = graphql(`
  fragment UserOrganizationQuery on Query {
    user {
      user {
        id
        organizations {
          id
        }
      }
    }
  }
`);

type Props = {
  event: FragmentType<typeof EventDetailFragment>;
  organizations: FragmentType<typeof UserOrganizationFragment>;
};

function useOrganizationRequired(
  organizationId: string | undefined,
  user: FragmentType<typeof UserOrganizationFragment>
): { isInOrganization: boolean } {
  if (!organizationId) return { isInOrganization: false };
  const data = getFragmentData(UserOrganizationFragment, user);
  const isInOrganization = Boolean(data.user.user?.organizations?.find((org) => org.id === organizationId));
  return { isInOrganization };
}

export const EventDetail: React.FC<Props> = (props) => {
  const event = getFragmentData(EventDetailFragment, props.event);
  const { isInOrganization } = useOrganizationRequired(event.organization?.id, props.organizations);

  return (
    <>
      <Title
        breadcrumbs={[
          {
            name: "Hjem",
            href: "/",
          },
          {
            name: "Arrangementer",
            href: "/events",
          },
          {
            name: event.name,
            href: `/events/${event.id}`,
          },
        ]}
        title={event.name}
        overline={`Arrangert av ${event.organization?.name}`}
      />
      <Container>
        <Grid container direction={{ xs: "column", md: "row" }} justifyContent="space-between" spacing={2}>
          {isInOrganization && event.organization && (
            <Grid xs={12}>
              <ManageEvent eventId={event.id} organizationId={event.organization.id} />
            </Grid>
          )}
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
                      <Alert severity="warning" variant="outlined">
                        Arrangementet har bindende påmelding
                      </Alert>
                    </ListItem>
                  )}
                  {event.ticketInformation?.product && (
                    <ListItem>
                      <ListItemIcon>
                        <CreditCard />
                      </ListItemIcon>
                      <ListItemText
                        primary="Pris"
                        secondary={`${event.ticketInformation.product.price.valueInNok} kr`}
                      />
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
                    <AddToCalendar
                      title={event.name}
                      start={event.startAt}
                      end={event.endAt}
                      location={event.location}
                    />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

function formatDate(date: string) {
  return dayjs(date).format("LLL");
}
