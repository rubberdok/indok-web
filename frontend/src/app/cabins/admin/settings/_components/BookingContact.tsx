import { useMutation } from "@apollo/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Edit } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import {
  Card,
  CardContent,
  CardHeader,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { useAlerts } from "@/app/components/Alerts";
import { FragmentType, getFragmentData, graphql } from "@/gql/app";
import dayjs from "@/lib/date";

const BookingContactQueryFragment = graphql(`
  fragment AdminBookingContact_Query on Query {
    bookingContact {
      bookingContact {
        id
        name
        email
        phoneNumber
        updatedAt
      }
    }
  }
`);

type BookingContactProps = {
  query: FragmentType<typeof BookingContactQueryFragment>;
};

const schema = z.object({
  name: z.string(),
  email: z.string().email(),
  phoneNumber: z.string().regex(/^(0047|\+47|47)?\d{8}$/, {
    message: "Ugyldig telefonnummer",
  }),
});

type BookingContactForm = {
  name: string;
  email: string;
  phoneNumber: string;
};

function BookingContact(props: BookingContactProps) {
  const { bookingContact } = getFragmentData(BookingContactQueryFragment, props.query).bookingContact;
  const [editing, setEditing] = useState(false);
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<BookingContactForm>({
    defaultValues: bookingContact,
    resolver: zodResolver(schema),
  });
  const { notify } = useAlerts();

  const [updateBookingContact, { loading }] = useMutation(
    graphql(`
      mutation BookingContact_UpdateBookingContact($data: UpdateBookingContactInput!) {
        updateBookingContact(data: $data) {
          bookingContact {
            id
            name
            email
            phoneNumber
            updatedAt
          }
        }
      }
    `),
    {
      onCompleted() {
        notify({ message: "Kontaktinformasjon oppdatert", type: "success" });
        setEditing(false);
      },
      onError(errors) {
        notify({ title: "Noe gikk galt", message: errors.message, type: "error" });
      },
    }
  );

  function onSubmit(data: BookingContactForm) {
    updateBookingContact({
      variables: {
        data,
      },
    });
  }

  return (
    <>
      <Dialog open={editing} onClose={() => setEditing(false)}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogTitle>Rediger kontaktinformasjon</DialogTitle>
          <DialogContent>
            <Stack direction="column" pt={1} spacing={1}>
              <TextField
                {...register("name")}
                error={Boolean(errors.name)}
                helperText={errors.name?.message ?? " "}
                label="Navn"
              />
              <TextField
                {...register("email")}
                error={Boolean(errors.email)}
                helperText={errors.email?.message ?? " "}
                label="E-post"
                type="email"
              />
              <TextField
                {...register("phoneNumber")}
                error={Boolean(errors.phoneNumber)}
                helperText={errors.phoneNumber?.message ?? " "}
                type="tel"
                label="Telefonnummer"
              />
            </Stack>
          </DialogContent>
          <DialogActions>
            <LoadingButton
              color="secondary"
              loading={loading}
              onClick={() => {
                setEditing(false);
              }}
            >
              Avbryt
            </LoadingButton>
            <LoadingButton type="submit" loading={loading}>
              Lagre
            </LoadingButton>
          </DialogActions>
        </form>
      </Dialog>
      <Card>
        <CardHeader title="Kontaktinformasjon" />
        <CardContent>
          <TableContainer>
            <Table size="small" sx={{ textWrap: "nowrap" }}>
              <TableHead>
                <TableRow>
                  <TableCell>Navn</TableCell>
                  <TableCell>E-post</TableCell>
                  <TableCell>Telefonnummer</TableCell>
                  <TableCell align="right">Sist endret</TableCell>
                  <TableCell align="center">Rediger</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>{bookingContact.name}</TableCell>
                  <TableCell>{bookingContact.email}</TableCell>
                  <TableCell>{bookingContact.phoneNumber}</TableCell>
                  <TableCell align="right">{dayjs(bookingContact.updatedAt).format("LL")}</TableCell>
                  <TableCell align="center">
                    <IconButton onClick={() => setEditing(true)}>
                      <Edit />
                    </IconButton>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </>
  );
}

export { BookingContact };
