import { Card, CardActionArea, CardContent, Chip, Stack, Typography } from "@mui/material";
import React from "react";

import { NextLinkComposed } from "@/app/components/Link";
import { FragmentType, getFragmentData, graphql } from "@/gql/app";
import { SignUpAvailability } from "@/gql/app/graphql";
import dayjs from "@/lib/date";

const EventListItemFragment = graphql(`
  fragment EventListItem_Event on Event {
    id
    name
    description
    startAt
    signUpAvailability
    shortDescription
    signUpDetails {
      signUpsStartAt
    }
    organization {
      id
      colorScheme
    }
  }
`);

type Props = {
  event: FragmentType<typeof EventListItemFragment>;
};

export const EventListItem: React.FC<Props> = (props) => {
  const event = getFragmentData(EventListItemFragment, props.event);
  return (
    <Card
      sx={{
        borderLeftWidth: "16px",
        borderLeftStyle: "solid",
        borderLeftColor: event.organization?.colorScheme ?? "primary.main",
      }}
    >
      <CardActionArea component={NextLinkComposed} key={event.id} to={`/events/${event.id}`}>
        <CardContent>
          <Stack
            direction={{ xs: "column", md: "row" }}
            justifyContent="space-between"
            alignItems={{ md: "flex-end", xs: "stretch" }}
            spacing={1}
          >
            <Stack>
              <Typography variant="h4" component="h2" gutterBottom>
                {event.name}
              </Typography>

              <Typography variant="body2">Dato: {dayjs(event.startAt).format("LLL")}</Typography>

              <Typography variant="body2">{event.shortDescription || "Trykk for å lese mer"}</Typography>
            </Stack>
            <StatusChip
              signUpAvailability={event.signUpAvailability}
              signUpsStartAt={event.signUpDetails?.signUpsStartAt}
            />
          </Stack>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

type StatusChipProps = {
  signUpAvailability: SignUpAvailability;
  signUpsStartAt?: string | null;
};

function StatusChip({ signUpAvailability, signUpsStartAt }: StatusChipProps): React.ReactElement | null {
  switch (signUpAvailability) {
    case SignUpAvailability.Confirmed:
      return <Chip label="Påmeldt" variant="outlined" color="primary" />;
    case SignUpAvailability.OnWaitlist:
      return <Chip label="På venteliste" />;
    case SignUpAvailability.Available:
      return <Chip label="Påmelding tilgjengelig" color="primary" />;
    case SignUpAvailability.WaitlistAvailable:
      return <Chip label="Venteliste tilgjengelig" />;
    case SignUpAvailability.Disabled:
    case SignUpAvailability.Closed:
    case SignUpAvailability.Unavailable:
      return null;
    case SignUpAvailability.NotOpen:
      return <Chip label={`Påmelding åpner ${dayjs(signUpsStartAt).format("DD. MMMM [kl.] HH:mm")}`} />;
  }
}
