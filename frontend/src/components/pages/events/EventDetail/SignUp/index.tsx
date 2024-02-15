import { Alert, AlertTitle, Unstable_Grid2 as Grid } from "@mui/material";

import Link from "@/components/Link";
import { FragmentType, getFragmentData, graphql } from "@/gql/pages";
import { OrderPaymentStatus, SignUpAvailability } from "@/gql/pages/graphql";

import { Actions } from "./Actions";
import { PaymentStatus } from "./Payments";

const SignUpFragment = graphql(`
  fragment EventSignUp_EventFragment on Event {
    signUpAvailability
    id
    user {
      id
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

  const isSignedUp = event.signUpAvailability === SignUpAvailability.Confirmed;
  const isOnWaitingList = event.signUpAvailability === SignUpAvailability.OnWaitlist;

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
            {/* <Typography>Du er nummer {event.userAttendance?.positionOnWaitingList} på ventelisten.</Typography> */}
          </Alert>
        </Grid>
      )}
    </Grid>
  );
};
