import { useQuery } from "@apollo/client";
import { MailOutline } from "@mui/icons-material";
import { Link, Stack, Typography } from "@mui/material";
import React from "react";

import { graphql } from "@/gql/pages";

export const ContactCabinBoard: React.FC = () => {
  const { data } = useQuery(
    graphql(`
      query BookingContact {
        bookingContact {
          bookingContact {
            id
            name
            email
          }
        }
      }
    `)
  );

  if (data?.bookingContact.bookingContact) {
    const { name, email } = data.bookingContact.bookingContact;

    return (
      <Stack direction="column" spacing={2}>
        <Typography variant="subtitle1">Spørsmål?</Typography>
        <Stack direction="row" alignItems="center" spacing={1}>
          <Typography>{name}</Typography>
          <MailOutline />
          <Link href={`mailto:${email}`}>{email}</Link>
        </Stack>
      </Stack>
    );
  }
  return null;
};
