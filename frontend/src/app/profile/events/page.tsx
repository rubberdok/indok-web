"use client";

import { Breadcrumbs } from "@/app/components/Breadcrumbs";
import { NextLinkComposed } from "@/app/components/Link";
import { graphql } from "@/gql/app";
import { ParticipationStatus as EventParticipationStatus, EventType } from "@/gql/app/graphql";
import { useSuspenseQuery } from "@apollo/client";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Container,
  Stack,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import dayjs from "dayjs";
import { capitalize } from "lodash";
import { notFound } from "next/navigation";
import { useState } from "react";
import { OrderStatus } from "./_components/OrderStatus";
import { ParticipationStatus } from "./_components/ParticipationStatus";

export default function Page() {
  const [participationStatus, setParticipationStatus] = useState<EventParticipationStatus | null>(null);

  const { data } = useSuspenseQuery(
    graphql(`
      query ProfileEventsPage($data: UserSignUpsInput) {
        user {
          user {
            id
            all: signUps(data: { participationStatus: null }) {
              total
            }
            confirmed: signUps(data: { participationStatus: CONFIRMED }) {
              total
            }
            onWaitlist: signUps(data: { participationStatus: ON_WAITLIST }) {
              total
            }
            retracted: signUps(data: { participationStatus: RETRACTED }) {
              total
            }
            removed: signUps(data: { participationStatus: REMOVED }) {
              total
            }
            signUps(data: $data) {
              signUps {
                id
                createdAt
                event {
                  id
                  name
                  startAt
                  type
                }
                ...OrderStatus_SignUp
                ...ParticipationStatus_SignUp
              }
            }
          }
        }
      }
    `),
    {
      variables: {
        data: {
          orderBy: null,
          participationStatus,
        },
      },
    }
  );

  if (!data.user.user) return notFound();
  const { signUps } = data.user.user.signUps;
  const { all, confirmed, onWaitlist, retracted, removed } = data.user.user;

  return (
    <Container>
      <Breadcrumbs
        links={[
          { href: "/", name: "Hjem" },
          { href: "/profile", name: "Profil" },
          { href: "/profile/events", name: "Påmeldinger" },
        ]}
      />
      <Typography variant="subtitle1" component="h1">
        Påmeldinger
      </Typography>
      <Stack direction="row" justifyContent="center" alignItems="center">
        <Stack
          direction="column"
          spacing={2}
          alignItems="stretch"
          maxWidth={(theme) => theme.breakpoints.values.sm}
          width="100%"
        >
          <Tabs
            variant="scrollable"
            value={participationStatus}
            onChange={(_event, value: EventParticipationStatus | null) => setParticipationStatus(value)}
          >
            <Tab value={null} label={`Alle (${all.total})`} />
            <Tab value={EventParticipationStatus.Confirmed} label={`Påmeldt (${confirmed.total})`} />
            <Tab value={EventParticipationStatus.OnWaitlist} label={`Venteliste (${onWaitlist.total})`} />
            <Tab value={EventParticipationStatus.Retracted} label={`Avmeldt (${retracted.total})`} />
            <Tab value={EventParticipationStatus.Removed} label={`Fjernet (${removed.total})`} />
          </Tabs>
          {signUps.map((signUp) => (
            <Card key={signUp.id}>
              <CardHeader
                title={signUp.event.name}
                subheader={capitalize(dayjs(signUp.event.startAt).format("LLLL"))}
              />
              <CardContent>
                <Stack direction="column" spacing={2}>
                  <div>
                    <Typography variant="subtitle1">Deltagelse</Typography>
                    <Typography variant="caption" gutterBottom>
                      Påmeldt {dayjs(signUp.createdAt).format("LLLL")}
                    </Typography>
                    <ParticipationStatus signUp={signUp} />
                  </div>

                  {signUp.event.type === EventType.Tickets && (
                    <div>
                      <Typography variant="subtitle1" gutterBottom>
                        Betaling
                      </Typography>
                      <OrderStatus signUp={signUp} />
                    </div>
                  )}
                </Stack>
              </CardContent>
              <CardActions>
                <Button component={NextLinkComposed} to={`/events/${signUp.event.id}`} variant="text" color="secondary">
                  Se arrangementet
                </Button>
              </CardActions>
            </Card>
          ))}
        </Stack>
      </Stack>
    </Container>
  );
}
