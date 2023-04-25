import { Card, CardContent, Divider, Stack, Typography } from "@mui/material";

import Link from "@/components/Link";
import { EventDetailFieldsFragment } from "@/generated/graphql";

import { SignUpDetail } from "./SignUpDetail";

type Props = {
  event: {
    signupOpenDate: string;
    deadline: string;
    id: string;
    hasExtraInformation?: boolean | null;
  } & Pick<EventDetailFieldsFragment, "userAttendance">;
};

export const SignUp: React.FC<Props> = ({ event }) => {
  const isSignedUp = Boolean(event.userAttendance?.isSignedUp);
  const isOnWaitingList = Boolean(event.userAttendance?.isOnWaitingList);
  console.log({ att: event.userAttendance });

  return (
    <Card variant="outlined" elevation={0}>
      <CardContent>
        <Stack direction="column" justifyContent="center" spacing={2}>
          <SignUpDetail event={event} />
          {(isSignedUp || isOnWaitingList) && (
            <>
              <Divider variant="fullWidth" flexItem />
              {isOnWaitingList && (
                <Typography>Du er nummer {event.userAttendance?.positionOnWaitingList} på ventelisten.</Typography>
              )}
              {isSignedUp && (
                <Typography>
                  Du er påmeldt arrangementet. Dersom du ønsker å endre allergier eller kontaktinfo kan du gjøre dette
                  på <Link href="/profile">profilsiden</Link>.
                </Typography>
              )}
            </>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
};
