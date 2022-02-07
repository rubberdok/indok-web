import { Grid, Typography } from "@material-ui/core";
import CreditCard from "@public/illustrations/CreditCard.svg";
import LinkAction from "./actions/LinkAction";
import ProfileCardBase from "./ProfileCardBase";

/** Displays a card on the profile page that links to the user's orders. */
const OrdersCard: React.VFC = (props) => {
  return (
    <ProfileCardBase
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
    </ProfileCardBase>
  );
};

export default OrdersCard;
