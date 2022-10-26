import { useQuery } from "@apollo/client";
import { MailOutline } from "@mui/icons-material";
import { Link, Stack, Typography } from "@mui/material";
import React from "react";

import { LabeledIcon } from "@/components/LabeledIcon";
import { ActiveBookingResponsibleDocument } from "@/generated/graphql";

export const ContactCabinBoard: React.FC<React.PropsWithChildren<unknown>> = () => {
  const { data } = useQuery(ActiveBookingResponsibleDocument);

  if (data?.activeBookingResponsible?.email) {
    return (
      <Stack direction="column" spacing={2} mb={4}>
        <Typography variant="subtitle1">Spørsmål?</Typography>
        <LabeledIcon
          icon={<MailOutline />}
          value={
            <Typography variant="body1" sx={{ ml: 1 }}>
              <Link href={`mailto:${data?.activeBookingResponsible.email}`}>
                {data?.activeBookingResponsible.email}
              </Link>
            </Typography>
          }
        />
      </Stack>
    );
  } else {
    return <></>;
  }
};
