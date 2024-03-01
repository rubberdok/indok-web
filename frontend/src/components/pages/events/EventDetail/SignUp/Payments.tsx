import { Alert, Button } from "@mui/material";

import Link, { NextLinkComposed } from "@/components/Link";

type Props = {
  hasBoughtTicket?: boolean | null;
  orderId: string;
};

export const PaymentStatus: React.FC<Props> = ({ hasBoughtTicket, orderId }) => {
  if (hasBoughtTicket)
    return (
      <Alert color="success" variant="outlined">
        Du har betalt for billetten. <Link href={`/receipt/${orderId}`}>Se kvittering</Link>
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
            pathname: "/checkout/[orderId]",
            query: { orderId },
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
