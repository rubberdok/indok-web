import { Alert, AlertTitle, Unstable_Grid2 as Grid, Typography } from "@mui/material";

import { FragmentType, getFragmentData, graphql } from "@/gql/pages";
import { OrderPaymentStatus } from "@/gql/pages/graphql";

import { ParticipationStatus } from "@/gql/app/graphql";
import { Actions } from "./Actions";
import { PaymentStatus } from "./Payments";
import { Link } from "@/app/components/Link";

const SignUpFragment = graphql(`
  fragment EventSignUp_EventFragment on Event {
    signUpAvailability
    id
    user {
      id
      signUp {
        id
        participationStatus
        approximatePositionOnWaitList
      }
      ticket {
        id
        paymentStatus
      }
    }
    ticketInformation {
      product {
        id
        price {
          valueInNok
        }
      }
    }
    ...Action_EventFragment
  }
`);

type Props = {
  event: FragmentType<typeof SignUpFragment>;
};

export const SignUp: React.FC<Props> = (props) => {
  const event = getFragmentData(SignUpFragment, props.event);

  const isSignedUp = event.user?.signUp?.participationStatus === ParticipationStatus.Confirmed;
  const isOnWaitingList = event.user?.signUp?.participationStatus === ParticipationStatus.OnWaitlist;

  return (
    <Grid container direction="column" alignItems="center" spacing={2}>
      <Grid container alignItems="center" direction="column" xs={12} sm={8} md={6}>
        <Actions event={event} />
      </Grid>
      {isSignedUp && (
        <>
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
          {event.ticketInformation?.product && event.user?.ticket && (
            <Grid xs={12} sm={8} md={6}>
              <PaymentStatus
                hasBoughtTicket={event.user.ticket.paymentStatus === OrderPaymentStatus.Captured}
                orderId={event.user.ticket.id}
              />
            </Grid>
          )}
        </>
      )}
      {isOnWaitingList && (
        <Grid xs={12} sm={8} md={6}>
          <Alert color="info" variant="outlined">
            <AlertTitle>Du er på ventelisten</AlertTitle>
            <Typography>Du er nummer {event.user?.signUp?.approximatePositionOnWaitList} på ventelisten.</Typography>
            <Typography variant="caption">
              Dette er et estimat, som følge av plassfordeling kan det forekomme avvik.
            </Typography>
          </Alert>
        </Grid>
      )}
    </Grid>
  );
};
