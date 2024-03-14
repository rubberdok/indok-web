"use client";

import { useAlerts } from "@/app/components/Alerts";
import { graphql } from "@/gql/app";
import { BookingStatus } from "@/gql/app/graphql";
import { useMutation, useSuspenseQuery } from "@apollo/client";
import { Unstable_Grid2 as Grid, Typography } from "@mui/material";
import { Booking } from "../_components/Booking";

function BookingPage({ status }: { status?: BookingStatus }) {
  const { data } = useSuspenseQuery(
    graphql(`
      query CabinsAdminBookingsPage_Bookings($data: BookingsInput!) {
        bookings(data: $data) {
          bookings {
            id
            ...Booking_Booking
          }
          total
        }
      }
    `),
    {
      variables: {
        data: {
          status: status ?? null,
        },
      },
    }
  );

  const { notify } = useAlerts();
  const [changeBookingStatus, { loading }] = useMutation(
    graphql(`
      mutation CabinsAdminBookingsPage_UpdateBookingStatus($data: UpdateBookingStatusInput!) {
        updateBookingStatus(data: $data) {
          booking {
            id
            status
            ...Booking_Booking
          }
        }
      }
    `),
    {
      onCompleted(data) {
        if (data.updateBookingStatus.booking.status === BookingStatus.Confirmed) {
          notify({
            message: "Bestillingen er bekreftet",
            type: "success",
          });
        }
        if (data.updateBookingStatus.booking.status === BookingStatus.Rejected) {
          notify({
            message: "Bestillingen er avslått",
            type: "success",
          });
        }
      },
      onError(error) {
        notify({
          title: "Feil ved oppdatering av bestilling",
          message: error.message,
          type: "error",
        });
      },
    }
  );

  return (
    <Grid container direction="column" spacing={2} alignItems="center">
      {data.bookings.total === 0 && (
        <Grid>
          <Typography textAlign="center" variant="caption">
            Ingen bestlillinger
          </Typography>
        </Grid>
      )}
      {data.bookings.bookings.map((booking) => (
        <Grid xs={12}>
          <Booking
            key={booking.id}
            booking={booking}
            loading={loading}
            onApprove={() => {
              changeBookingStatus({
                variables: {
                  data: {
                    id: booking.id,
                    status: BookingStatus.Confirmed,
                    feedback: null,
                  },
                },
              });
            }}
            onReject={({ feedback }) => {
              changeBookingStatus({
                variables: {
                  data: {
                    id: booking.id,
                    status: BookingStatus.Rejected,
                    feedback: feedback ?? null,
                  },
                },
              });
            }}
          />
        </Grid>
      ))}
    </Grid>
  );
}

export { BookingPage };
