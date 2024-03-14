import { Link } from "@/app/components/Link";
import { FragmentType, getFragmentData, graphql } from "@/gql/app";
import { BookingStatus } from "@/gql/app/graphql";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoadingButton } from "@mui/lab";
import {
  Box,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import dayjs from "dayjs";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

type Props = {
  booking: FragmentType<typeof BookingFragment>;
  onApprove?: () => void;
  onReject?: (params: { feedback?: string }) => void;
  loading?: boolean;
};

const BookingFragment = graphql(`
  fragment Booking_Booking on Booking {
    lastName
    id
    firstName
    endDate
    startDate
    email
    createdAt
    cabins {
      id
      name
    }
    phoneNumber
    status
    totalCost
    feedback
    questions
  }
`);

function Booking({ onApprove, onReject, loading, ...props }: Props) {
  const [open, setOpen] = useState(false);
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<{ feedback: string | undefined }>({
    defaultValues: {
      feedback: "",
    },
    resolver: zodResolver(z.object({ feedback: z.string().optional() })),
  });
  const booking = getFragmentData(BookingFragment, props.booking);

  const isInThePast = dayjs(booking.startDate).isBefore(dayjs(), "day");
  const disabled = isInThePast;

  return (
    <>
      {onReject && (
        <Dialog open={open} onClose={() => setOpen(false)}>
          <form
            onSubmit={handleSubmit(({ feedback }) => {
              onReject({ feedback });
              setOpen(false);
            })}
          >
            <DialogTitle>Tilbakemelding til brukeren</DialogTitle>
            <DialogContent>
              <Typography gutterBottom>
                Dersom du ønsker å gi tilbakemeldingen til brukeren, f.eks. for hvorfor bestillingen ble avslått, kan du
                gjøre det her.
              </Typography>
              <TextField
                {...register("feedback")}
                fullWidth
                multiline
                rows={3}
                maxRows={5}
                label="Tilbakemelding til brukeren"
                error={Boolean(errors.feedback)}
                helperText={errors.feedback?.message ?? " "}
              />
            </DialogContent>
            <DialogActions>
              <LoadingButton loading={loading} onClick={() => setOpen(false)}>
                Avbryt
              </LoadingButton>
              <LoadingButton loading={loading} disabled={disabled} type="submit" color="error" variant="contained">
                Avslå
              </LoadingButton>
            </DialogActions>
          </form>
        </Dialog>
      )}
      <Card>
        <CardHeader subheader={`Bestillingstidspunkt: ${dayjs(booking.createdAt).format("LLL")}`} />
        <CardContent>
          <Stack direction="column" spacing={2}>
            <Box>
              <Typography variant="subtitle1">Kontaktinformasjon</Typography>
              <Stack direction="column">
                <Typography>
                  {booking.firstName} {booking.lastName}
                </Typography>
                <Link href={`mailto:${booking.email}`}>{booking.email}</Link>
                <Link href={`tel:${booking.phoneNumber}`}>{booking.phoneNumber}</Link>
              </Stack>
            </Box>
            <Box>
              <Typography variant="subtitle1">Dato</Typography>
              <Typography>
                {dayjs(booking.startDate).format("dddd LL")} - {dayjs(booking.endDate).format("dddd LL")} (
                {dayjs(booking.endDate).diff(booking.startDate, "day")} dager)
              </Typography>
            </Box>
            <Box>
              <Typography variant="subtitle1">Hytte(r)</Typography>
              <Typography>{booking.cabins.map((cabin) => cabin.name).join(", ")}</Typography>
            </Box>
            <Box>
              <Typography variant="subtitle1">Totalpris</Typography>
              <Typography>
                {new Intl.NumberFormat("nb-NO", { style: "currency", currency: "NOK" }).format(booking.totalCost)}
              </Typography>
            </Box>
            {booking.questions && (
              <Box>
                <Typography variant="subtitle1">Henvendelse fra brukeren</Typography>
                <Typography>{booking.questions}</Typography>
              </Box>
            )}
            <Box>
              <Typography variant="subtitle1">Status</Typography>
              <Typography>
                {booking.status === BookingStatus.Pending && "Avventer"}
                {booking.status === BookingStatus.Confirmed && "Godkjent"}
                {booking.status === BookingStatus.Rejected && "Avslått"}
              </Typography>
              {booking.feedback && (
                <>
                  <Typography variant="subtitle2">Tilbakemelding til brukeren</Typography>
                  <Typography>{booking.feedback}</Typography>
                </>
              )}
            </Box>
          </Stack>
        </CardContent>
        {(onApprove || onReject) && (
          <CardActions>
            {onReject && (
              <LoadingButton
                disabled={disabled}
                onClick={() => setOpen(true)}
                loading={loading}
                color="error"
                variant="contained"
              >
                Avslå
              </LoadingButton>
            )}
            {onApprove && (
              <LoadingButton
                disabled={disabled}
                onClick={() => onApprove()}
                loading={loading}
                color="success"
                variant="contained"
              >
                Godkjenn
              </LoadingButton>
            )}
          </CardActions>
        )}
      </Card>
    </>
  );
}

export { Booking };
