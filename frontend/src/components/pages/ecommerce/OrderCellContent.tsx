import { Link as MuiLink, Typography } from "@mui/material";
import dayjs from "dayjs";
import Link from "next/link";
import { useRouter } from "next/router";

import { OrderFragment, PaymentStatus } from "@/generated/graphql";
import { HeaderValuePair } from "@/interfaces/utils";

type Props = { order: OrderFragment; field: HeaderValuePair<OrderFragment> };

const OrderCellContent: React.FC<Props> = ({ order, field }) => {
  const router = useRouter();

  let content: string;
  switch (field.header) {
    case "Ordre-ID":
      return (
        <Link href={`/ecommerce/fallback?orderId=${order.id}&redirect=${router.asPath}`} passHref>
          <MuiLink variant="caption" component="button" color="secondary">
            {order.id}
          </MuiLink>
        </Link>
      );
    case "Produkt":
      content = order.product.name;
      break;
    case "Totalpris":
      content = `${order.totalPrice} kr`;
      break;
    case "Tidspunkt":
      content = dayjs(order.timestamp).format("DD/MM/YYYY, HH:mm");
      break;
    case "Status":
      switch (order.paymentStatus) {
        case PaymentStatus.Captured:
          content = "Fullført";
          break;
        case PaymentStatus.Reserved:
          content = "Betalt";
          break;
        case PaymentStatus.Initiated:
          content = "Påbegynt";
          break;
        case PaymentStatus.Failed:
        case PaymentStatus.Cancelled:
        case PaymentStatus.Rejected:
          content = "Avbrutt";
          break;
        case PaymentStatus.Refunded:
          content = "Refundert";
          break;
      }
      break;
    default:
      content = `${order[field.field]}`;
  }
  return <Typography variant="body2">{content}</Typography>;
};

export default OrderCellContent;
