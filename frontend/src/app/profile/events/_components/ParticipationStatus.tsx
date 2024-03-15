"use client";
import { Cancel, CheckCircle, Pending } from "@mui/icons-material";
import { Stack, Typography } from "@mui/material";

import { FragmentType, getFragmentData, graphql } from "@/gql/app";
import { ParticipationStatus as EventParticipationStatus } from "@/gql/app/graphql";

type ParticipationStatusProps = {
  signUp: FragmentType<typeof ParticipationStatusFragment>;
};
const ParticipationStatusFragment = graphql(`
  fragment ParticipationStatus_SignUp on SignUp {
    participationStatus
    approximatePositionOnWaitList
  }
`);
export function ParticipationStatus(props: ParticipationStatusProps) {
  const { participationStatus, approximatePositionOnWaitList } = getFragmentData(
    ParticipationStatusFragment,
    props.signUp
  );

  switch (participationStatus) {
    case EventParticipationStatus.Confirmed: {
      return (
        <Stack direction="row" spacing={2}>
          <CheckCircle color="success" />
          <Typography variant="body1">Du er påmeldt</Typography>
        </Stack>
      );
    }
    case EventParticipationStatus.OnWaitlist: {
      return (
        <Stack direction="row" spacing={2}>
          <Pending color="warning" />
          <Typography variant="body1">
            Du er på venteliste, og er nummer {approximatePositionOnWaitList} i køen
          </Typography>
        </Stack>
      );
    }
    case EventParticipationStatus.Retracted: {
      return (
        <Stack direction="row" spacing={2}>
          <Cancel color="error" />
          <Typography variant="body1">Påmeldingen er trukket</Typography>
        </Stack>
      );
    }
    case EventParticipationStatus.Removed: {
      return (
        <Stack direction="row" spacing={2}>
          <Cancel color="error" />
          <Typography variant="body1">Du har blitt meldt av arrangementet av arrangøren</Typography>
        </Stack>
      );
    }
  }
}
