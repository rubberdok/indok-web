import { useQuery } from "@apollo/client";
import { MailOutline } from "@mui/icons-material";
import { Link, Stack, Typography } from "@mui/material";
import React from "react";

import { ActiveBookingResponsibleDocument } from "@/generated/graphql";

export const ContactCabinBoard: React.FC = () => {
  const { data } = useQuery(ActiveBookingResponsibleDocument);

  if (data?.activeBookingResponsible?.email) {
    return (
      <Stack direction="column" spacing={2}>
        <Typography variant="subtitle1">Spørsmål?</Typography>
        <Stack direction="row" alignItems="center" spacing={1}>
          <MailOutline />
          <Link href={`mailto:${data?.activeBookingResponsible.email}`}>{data?.activeBookingResponsible.email}</Link>
        </Stack>
      </Stack>
    );
  }
  return null;
};
