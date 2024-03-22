"use client";

import { useSuspenseQuery } from "@apollo/client";
import { IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";

import { Link, NextLinkComposed } from "@/app/components/Link";
import { graphql } from "@/gql/app";
import { EventType } from "@/gql/app/graphql";
import dayjs from "@/lib/date";
import { Add } from "@mui/icons-material";

export default function Page({ params }: { params: { organizationId: string } }) {
  const { organizationId } = params;

  const { data } = useSuspenseQuery(
    graphql(`
      query AdminOrganizationsEventsPage($data: OrganizationInput!) {
        organization(data: $data) {
          organization {
            id
            events {
              type
              signUps {
                confirmed {
                  total
                }
              }
              id
              name
              startAt
              signUpDetails {
                capacity
              }
            }
          }
        }
      }
    `),
    { variables: { data: { id: organizationId } } }
  );

  const { organization } = data.organization;
  const { events } = organization;

  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Navn</TableCell>
            <TableCell>Starttid</TableCell>
            <TableCell>Type arrangement</TableCell>
            <TableCell>Påmeldte</TableCell>
            <TableCell>
              <IconButton component={NextLinkComposed} to="/events/new">
                <Add />
              </IconButton>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {events.map((event) => (
            <TableRow key={event.id}>
              <TableCell>
                <Link href={`/organizations/${organizationId}/admin/events/${event.id}`}>{event.name}</Link>
              </TableCell>
              <TableCell>{dayjs(event.startAt).format("LLL")}</TableCell>
              <TableCell>{toUserFriendlyType(event.type)}</TableCell>
              {event.signUps && event.signUpDetails && (
                <TableCell>
                  {event.signUps?.confirmed.total} / {event.signUpDetails?.capacity}
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

function toUserFriendlyType(type: EventType) {
  switch (type) {
    case EventType.Basic:
      return "Ingen påmelding";
    case EventType.SignUps:
      return "Påmelding";
    case EventType.Tickets:
      return "Billetter";
  }
}
