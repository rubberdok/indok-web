import { useQuery } from "@apollo/client";
import { CalendarToday, Class, CreditCard, Email, Label, Place } from "@mui/icons-material";
import {
  Alert,
  Card,
  CardContent,
  CardHeader,
  Chip,
  Container,
  Divider,
  Unstable_Grid2 as Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Stack,
  Typography,
} from "@mui/material";
import dayjs from "dayjs";
import React from "react";

import Link from "@/components/Link";
import { Markdown } from "@/components/Markdown";
import { Title } from "@/components/Title";
import { EventDetailFieldsFragment, UserOrganizationsDocument } from "@/generated/graphql";

import { AddToCalendar } from "./AddToCalendar";
import { ManageEvent } from "./ManageEvent";
import { SignUp } from "./SignUp";

type Props = {
  event: EventDetailFieldsFragment;
};

function isAttendable(
  event: EventDetailFieldsFragment
): event is EventDetailFieldsFragment & { signupOpenDate: string; deadline: string } {
  return event.isAttendable && Boolean(event.signupOpenDate) && Boolean(event.deadline);
}

function useOrganizationRequired(organizationId: string): { isInOrganization: boolean; loading: boolean } {
  const { data, loading } = useQuery(UserOrganizationsDocument);
  const isInOrganization = Boolean(data?.user?.organizations?.find((org) => org.id === organizationId));
  return { isInOrganization, loading };
}

export const Event: React.FC<Props> = ({ event }) => {
  const { isInOrganization } = useOrganizationRequired(event.organization.id);

  return (
    <>
      <Title
        breadcrumbs={[
          {
            name: "Hjem",
            href: "/",
          },
          {
            name: event.title,
            href: `/events/${event.id}`,
          },
        ]}
        title={event.title}
        overline={`Arrangert av ${event.organization.name}`}
      />
      <Container>
        <Grid container direction={{ xs: "column", md: "row" }} justifyContent="space-between" spacing={2}>
          {isInOrganization && (
            <Grid xs={12}>
              <ManageEvent eventId={event.id} organizationId={event.organization.id} />
            </Grid>
          )}
          <Grid xs={12} md={8}>
            <Stack spacing={2} divider={<Divider />}>
              {isAttendable(event) && <SignUp event={event} />}
              <Markdown>{event.description}</Markdown>
            </Stack>
          </Grid>
          <Grid md xs={12}>
            <Card>
              <CardHeader title="Informasjon" />
              <CardContent>
                <List>
                  {event.bindingSignup && (
                    <ListItem>
                      <Alert severity="warning" variant="outlined">
                        Arrangementet har bindende påmelding
                      </Alert>
                    </ListItem>
                  )}
                  <ListItem>
                    <ListItemIcon>
                      <CalendarToday />
                    </ListItemIcon>
                    <ListItemText primary="Starter" secondary={formatDate(event.startTime)} />
                  </ListItem>
                  {event.endTime && (
                    <ListItem>
                      <ListItemIcon>
                        <CalendarToday />
                      </ListItemIcon>
                      <ListItemText primary="Slutter" secondary={formatDate(event.endTime)} />
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
                  {event.price && (
                    <ListItem>
                      <ListItemIcon>
                        <CreditCard />
                      </ListItemIcon>
                      <ListItemText primary="Pris" secondary={event.price} />
                    </ListItem>
                  )}
                  {event.category && (
                    <ListItem>
                      <ListItemIcon>
                        <Label />
                      </ListItemIcon>
                      <ListItemText primary="Kategori" secondary={event.category.name} />
                    </ListItem>
                  )}
                  {event.allowedGradeYears && (
                    <ListItem>
                      <ListItemIcon>
                        <Class />
                      </ListItemIcon>
                      <ListItemText primary="Klassetrinn" secondary={event.allowedGradeYears.join(", ")} />
                    </ListItem>
                  )}
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
                      title={event.title}
                      start={event.startTime}
                      end={event.endTime}
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
