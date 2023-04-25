import { Alert, Button } from "@mui/material";

import { NextLinkComposed } from "@/components/Link";

type Props = {
  hasBoughtTicket?: boolean | null;
  eventId: string;
};

export const PaymentStatus: React.FC<Props> = ({ hasBoughtTicket, eventId }) => {
  if (hasBoughtTicket)
    return (
      <Alert color="success" variant="outlined">
        Du har betalt for billetten.
      </Alert>
    );
  return (
    <Alert
      color="warning"
      variant="outlined"
      action={
        <Button
          component={NextLinkComposed}
          to={{
            pathname: "/ecommerce/checkout",
            query: { productId: eventId, quantity: 1, redirect: `/events/${eventId}` },
          }}
          color="inherit"
          size="small"
        >
          Kjøp
        </Button>
      }
    >
      Du må betale for billetten.
    </Alert>
  );
};
