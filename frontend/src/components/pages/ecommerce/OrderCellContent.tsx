import { Order } from "@interfaces/ecommerce";
import { HeaderValuePair } from "@interfaces/utils";
import { Link as MuiLink, Typography } from "@mui/material";
import dayjs from "dayjs";
import Link from "next/link";
import { useRouter } from "next/router";

const OrderCellContent = ({ order, field }: { order: Order; field: HeaderValuePair<Order> }) => {
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
      content =
        order.paymentStatus == "CAPTURED"
          ? "Fullført"
          : order.paymentStatus == "RESERVED"
          ? "Betalt"
          : order.paymentStatus == "INITIATED"
          ? "Påbegynt"
          : ["FAILED", "CANCELLED", "REJECTED"].includes(order.paymentStatus)
          ? "Avbrutt"
          : order.paymentStatus;
      break;
    default:
      content = `${order[field.field]}`;
  }
  return <Typography variant="body2">{content}</Typography>;
};

export default OrderCellContent;
