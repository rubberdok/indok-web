import { Card, CardActionArea, CardContent, Chip, Stack, Typography } from "@mui/material";
import React from "react";

import { NextLinkComposed } from "@/components/Link";
import { FragmentType, getFragmentData, graphql } from "@/gql/pages";
import { SignUpAvailability } from "@/gql/pages/graphql";
import dayjs from "@/lib/date";

const EventListItemFragment = graphql(`
  fragment EventListItem on Event {
    id
    name
    description
    startAt
    signUpAvailability
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
        borderLeftColor: "primary.main",
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

              <Typography variant="body2">{event.description || "Trykk for å lese mer"}</Typography>
            </Stack>
            <StatusChip signUpAvailability={event.signUpAvailability} />
          </Stack>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

type StatusChipProps = {
  signUpAvailability: SignUpAvailability;
};

function StatusChip({ signUpAvailability }: StatusChipProps): React.ReactElement | null {
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
      return <Chip label={`Påmelding åpner ${dayjs().format("DD. MMMM [kl.] HH:mm")}`} />;
  }
}
