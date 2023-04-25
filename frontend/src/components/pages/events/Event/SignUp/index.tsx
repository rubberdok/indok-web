import { Alert, AlertTitle, Unstable_Grid2 as Grid, Typography } from "@mui/material";

import Link from "@/components/Link";
import { EventDetailFieldsFragment } from "@/generated/graphql";

import { Actions } from "./Actions";

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

  return (
    <Grid container direction="column" alignItems="center">
      <Grid container alignItems="center" direction="column" xs={12} sm={8} md={6}>
        <Actions event={event} />
      </Grid>
      {isSignedUp && (
        <Grid xs={12} sm={8} md={6}>
          <Alert color="success" variant="outlined">
            <AlertTitle>Du er påmeldt arrangementet.</AlertTitle>
            Dersom du ønsker å endre allergier eller kontaktinfo kan du gjøre dette på{" "}
            <Link href="/profile" underline="always" color="text.primary">
              profilsiden
            </Link>
            .
          </Alert>
        </Grid>
      )}
      {isOnWaitingList && (
        <Grid xs={12} sm={8} md={6}>
          <Alert color="info" variant="outlined">
            <AlertTitle>Du er på ventelisten</AlertTitle>
            <Typography>Du er nummer {event.userAttendance?.positionOnWaitingList} på ventelisten.</Typography>
          </Alert>
        </Grid>
      )}
    </Grid>
  );
};
