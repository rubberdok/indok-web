import { ResultOf } from "@graphql-typed-document-node/core";
import { Card, CardActionArea, CardContent, Chip, Stack, Typography } from "@mui/material";
import dayjs from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import React from "react";

import { NextLinkComposed } from "@/components/Link";
import { EventsDocument } from "@/generated/graphql";
dayjs.extend(isSameOrAfter);

type Props = {
  event: NonNullable<ResultOf<typeof EventsDocument>["allEvents"]>[number];
  user: ResultOf<typeof EventsDocument>["user"];
};

export const EventListItem: React.FC<Props> = ({ event, user }) => {
  return (
    <Card
      sx={{
        borderLeftWidth: "16px",
        borderLeftStyle: "solid",
        borderLeftColor: event.organization?.color ?? "primary.main",
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
                {event.title}
              </Typography>

              <Typography variant="body2">Dato: {dayjs(event.startTime).format("LLL")}</Typography>

              <Typography variant="body2">{event.shortDescription ?? "Trykk for å lese mer"}</Typography>
            </Stack>
            <StatusChip event={event} user={{ ...event.userAttendance, gradeYear: user?.gradeYear }} />
          </Stack>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

type StatusChipProps = {
  event: {
    isAttendable?: boolean | null;
    isFull?: boolean | null;
    allowedGradeYears?: number[] | null;
    signupOpenDate?: string | null;
  };
  user: {
    isOnWaitingList?: boolean | null;
    isSignedUp?: boolean | null;
    gradeYear?: number | null;
  };
};

function StatusChip({ event, user }: StatusChipProps): React.ReactElement | null {
  if (user.isSignedUp) return <Chip label="Påmeldt" variant="outlined" color="primary" />;
  if (user.isOnWaitingList) return <Chip label="På venteliste" />;

  const signUpOpenDate = event.signupOpenDate ? dayjs(event.signupOpenDate) : undefined;
  const isSignUpOpen = signUpOpenDate && dayjs().isSameOrAfter(signUpOpenDate);

  let canAttend = event.isAttendable && isSignUpOpen;
  if (user.gradeYear && event.allowedGradeYears) {
    canAttend = canAttend && event.allowedGradeYears.includes(user.gradeYear);
  }

  if (event.isFull && canAttend) return <Chip label="Venteliste tilgjengelig" />;
  if (canAttend) return <Chip label="Påmelding tilgjengelig" color="primary" />;

  if (signUpOpenDate && dayjs().isBefore(signUpOpenDate)) {
    return <Chip label={`Påmelding åpner ${signUpOpenDate?.format("DD. MMMM [kl.] HH:mm")}`} />;
  }
  return null;
}
