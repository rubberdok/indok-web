"use client";

import { graphql } from "@/gql/app";
import { useSuspenseQuery } from "@apollo/client";
import { Card, CardContent, CardHeader, Typography, Unstable_Grid2 as Grid, Stack } from "@mui/material";
import dayjs from "dayjs";

export default function Page({ params }: { params: { organizationId: string; eventId: string } }) {
  const { eventId } = params;

  const { data } = useSuspenseQuery(
    graphql(`
      query OrganizationsAdminPage_EventDetail($data: EventInput!) {
        event(data: $data) {
          event {
            id
            name
            startAt
            endAt
            type
            location
            contactEmail
            ticketInformation {
              product {
                id
                price {
                  valueInNok
                }
              }
            }
            organization {
              id
              name
            }
            signUps {
              confirmed {
                total
                signUps {
                  ...OrganizationsAdminPage_SignUpFields
                }
              }
              waitList {
                total
                signUps {
                  ...OrganizationsAdminPage_SignUpFields
                }
              }
              retracted {
                total
                signUps {
                  ...OrganizationsAdminPage_SignUpFields
                }
              }
            }
          }
        }
      }

      fragment OrganizationsAdminPage_SignUpFields on SignUp {
        id
        user {
          id
          firstName
          lastName
        }
      }
    `),
    { variables: { data: { id: eventId } } }
  );

  const { event } = data.event;

  return (
    <>
      <Grid container justifyContent="center">
        <Grid md={6}>
          <Card elevation={0} sx={{ bgcolor: "background.elevated" }}>
            <CardHeader title={event.name} />
            <CardContent>
              <Stack direction="column" spacing={1}>
                <Stack direction="row" justifyContent="space-between">
                  <Typography>Type arrangement</Typography>
                  <Typography>{event.type}</Typography>
                </Stack>
                <Stack direction="row" justifyContent="space-between">
                  <Typography>Starttid</Typography>
                  <Typography>{dayjs(event.startAt).format("LLLL")}</Typography>
                </Stack>
                <Stack direction="row" justifyContent="space-between">
                  <Typography>Sluttid</Typography>
                  <Typography>{dayjs(event.endAt).format("LLLL")}</Typography>
                </Stack>
                <Stack direction="row" justifyContent="space-between">
                  <Typography>Sted</Typography>
                  <Typography>{event.location}</Typography>
                </Stack>
                <Stack direction="row" justifyContent="space-between">
                  <Typography>Kontakt</Typography>
                  <Typography>{event.contactEmail}</Typography>
                </Stack>
                <Stack direction="row" justifyContent="space-between">
                  <Typography>Arrangør</Typography>
                  <Typography>{event.organization?.name}</Typography>
                </Stack>
                {event.ticketInformation?.product && (
                  <Stack direction="row" justifyContent="space-between">
                    <Typography>Pris</Typography>
                    <Typography>{event.ticketInformation.product.price.valueInNok} kr</Typography>
                  </Stack>
                )}
                {event.signUps?.confirmed && (
                  <Stack direction="row" justifyContent="space-between">
                    <Typography>Påmeldinger</Typography>
                    <Typography>{event.signUps.confirmed.total}</Typography>
                  </Stack>
                )}
                {event.signUps?.waitList && (
                  <Stack direction="row" justifyContent="space-between">
                    <Typography>Venteliste</Typography>
                    <Typography>{event.signUps.waitList.total}</Typography>
                  </Stack>
                )}
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </>
  );
}
