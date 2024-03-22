"use client";
import { Currency } from "@/app/_components/Currency";
import { graphql } from "@/gql/app";
import { BookingStatus as BookingStatusEnum } from "@/gql/app/graphql";
import { skipToken, useSuspenseQuery } from "@apollo/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { KeyboardArrowRight } from "@mui/icons-material";
import {
  Alert,
  AlertTitle,
  Card,
  CardContent,
  CardHeader,
  IconButton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";

const schema = z.object({
  email: z.string().email(),
});

type FormData = z.infer<typeof schema>;

export default function Page({
  searchParams,
  params,
}: {
  params: { bookingId: string };
  searchParams: { email: string | undefined };
}) {
  const router = useRouter();
  const { data } = useSuspenseQuery(
    graphql(`
      query BookingsPage_Bookings($data: BookingInput!) {
        booking(data: $data) {
          booking {
            id
            startDate
            endDate
            firstName
            lastName
            totalCost
            email
            status
            feedback
            phoneNumber
            guests {
              internal
              external
            }
            cabins {
              id
              name
            }
          }
        }
      }
    `),
    searchParams.email
      ? {
          variables: {
            data: {
              id: params.bookingId,
              email: searchParams.email,
            },
          },
        }
      : skipToken
  );

  function onSubmit(data: FormData) {
    router.replace(`/cabins/bookings/${params.bookingId}?email=${data.email}`, { scroll: false });
  }
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      email: searchParams.email,
    },
    resolver: zodResolver(schema),
  });

  const booking = data?.booking.booking;

  if (!booking) {
    return (
      <Stack direction="row" justifyContent="center">
        <form onSubmit={handleSubmit(onSubmit)}>
          <TextField
            type="email"
            label="E-post"
            {...register("email")}
            error={Boolean(errors.email)}
            helperText={errors.email?.message ?? "Fyll inn e-posten på bookingen for å se detaljer"}
            InputProps={{
              endAdornment: (
                <IconButton type="submit" color="primary">
                  <KeyboardArrowRight />
                </IconButton>
              ),
            }}
          />
        </form>
      </Stack>
    );
  }

  return (
    <Card>
      <CardHeader title="Hyttebooking" />
      <CardContent>
        <Stack direction="column">
          <Stack direction="row" justifyContent="space-between">
            <Typography variant="body1">Dato</Typography>
            <Typography variant="body1">
              {new Date(booking.startDate).toLocaleDateString("no-NB")} -{" "}
              {new Date(booking.endDate).toLocaleDateString("no-NB")}
            </Typography>
          </Stack>
          <Stack direction="row" justifyContent="space-between">
            <Typography variant="body1">Hytter</Typography>
            <Typography variant="body1">{booking.cabins.map((cabin) => cabin.name).join(", ")}</Typography>
          </Stack>
          <Stack direction="row" justifyContent="space-between">
            <Typography variant="body1">Pris</Typography>
            <Typography variant="body1">
              <Currency amount={booking.totalCost} />
            </Typography>
          </Stack>
          <Stack direction="row" justifyContent="space-between">
            <Typography variant="body1">Navn</Typography>
            <Typography variant="body1">
              {booking.firstName} {booking.lastName}
            </Typography>
          </Stack>
          <Stack direction="row" justifyContent="space-between">
            <Typography variant="body1">E-post</Typography>
            <Typography variant="body1">{booking.email}</Typography>
          </Stack>
          <Stack direction="row" justifyContent="space-between">
            <Typography variant="body1">Telefon</Typography>
            <Typography variant="body1">{booking.phoneNumber}</Typography>
          </Stack>
          <Stack direction="row" justifyContent="space-between">
            <Typography variant="body1">Interne deltakere</Typography>
            <Typography variant="body1">{booking.guests.internal}</Typography>
          </Stack>
          <Stack direction="row" justifyContent="space-between">
            <Typography variant="body1">Eksterne deltakere</Typography>
            <Typography variant="body1">{booking.guests.external}</Typography>
          </Stack>
          <BookingStatus status={booking.status} feedback={booking.feedback} />
        </Stack>
      </CardContent>
    </Card>
  );
}

function BookingStatus({ status, feedback }: { status: BookingStatusEnum; feedback?: string | null }) {
  switch (status) {
    case BookingStatusEnum.Confirmed:
      return (
        <Alert severity="success">
          <AlertTitle>Bekreftet</AlertTitle>
          Din booking er bekreftet.
        </Alert>
      );
    case BookingStatusEnum.Pending:
      return (
        <Alert severity="info">
          <AlertTitle>Venter på svar</AlertTitle>
          Hyttestyret har mottatt din forespørsel og vil svare så snart som mulig.
        </Alert>
      );
    case BookingStatusEnum.Rejected:
      return (
        <Alert severity="error">
          <AlertTitle>Avvist</AlertTitle>
          {feedback}
        </Alert>
      );
  }
}
