import { MailOutline, PhoneOutlined } from "@mui/icons-material";
import { Card, CardContent, CardHeader, Link, Stack, Typography } from "@mui/material";
import React from "react";

import { FragmentType, getFragmentData, graphql } from "@/gql/app";

const QueryFragment = graphql(`
  fragment ContactCabinBoard_Query on Query {
    bookingContact {
      bookingContact {
        id
        name
        email
        phoneNumber
      }
    }
  }
`);

type Props = {
  query: FragmentType<typeof QueryFragment>;
};

export const ContactCabinBoard: React.FC<Props> = (props) => {
  const data = getFragmentData(QueryFragment, props.query);

  if (data?.bookingContact.bookingContact) {
    const { name, email, phoneNumber } = data.bookingContact.bookingContact;

    return (
      <Stack direction="column" spacing={2} width="min-content">
        <Typography variant="subtitle1">Spørsmål?</Typography>
        <Card>
          <CardHeader title={name} />
          <CardContent>
            {email && (
              <Stack direction="row" alignItems="center" spacing={1}>
                <MailOutline />
                <Link
                  href={`mailto
              :${email}`}
                >
                  {email}
                </Link>
              </Stack>
            )}
            {phoneNumber && (
              <Stack direction="row" alignItems="center" spacing={1}>
                <PhoneOutlined />
                <Link href={`tel:${phoneNumber}`}>{phoneNumber}</Link>
              </Stack>
            )}
          </CardContent>
        </Card>
      </Stack>
    );
  }
  return null;
};
