import { useQuery } from "@apollo/client";
import { MailOutline } from "@mui/icons-material";
import { Link, Stack, Typography } from "@mui/material";
import React from "react";

import LabeledIcon from "@/components/LabeledIcon";
import { QUERY_BOOKING_RESPONSIBLE } from "@/graphql/cabins/queries";
import { BookingResponsible } from "@/interfaces/cabins";

const ContactCabinBoard: React.FC = () => {
  const { data } = useQuery<{ activeBookingResponsible: BookingResponsible }>(QUERY_BOOKING_RESPONSIBLE);

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

export default ContactCabinBoard;
