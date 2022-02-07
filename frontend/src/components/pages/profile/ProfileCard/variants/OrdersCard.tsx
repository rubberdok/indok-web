import { Grid, Typography } from "@material-ui/core";
import CreditCard from "@public/illustrations/CreditCard.svg";
import LinkAction from "../LinkAction";
import BaseCard from "../BaseCard";

/** Displays a card on the profile page that links to the user's orders. */
const OrdersCard: React.VFC = (props) => {
  return (
    <BaseCard
      title="Ordrehistorikk"
      Action={<LinkAction text="Se ordrehistorikk" link="/ecommerce" {...props} />}
      image={CreditCard}
      alt=""
      {...props}
    >
      <Grid container direction="column">
        <Grid item>
          <Typography variant="body2">
            Her kan du se en oversikt over alle ordre og betalinger du har gjennomført.
          </Typography>
        </Grid>
      </Grid>
    </BaseCard>
  );
};

export default OrdersCard;
