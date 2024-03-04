import { Link, NextLinkComposed } from "@/app/components/Link";
import { Alert, Button } from "@mui/material";

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
        <Button component={NextLinkComposed} to={`/checkout/${orderId}`} color="inherit" size="small">
          Kjøp
        </Button>
      }
    >
      Du må betale for billetten.
    </Alert>
  );
};
