import { Grid, Typography } from "@mui/material";
import CreditCard from "@public/illustrations/CreditCard.svg";
import ProfileCardBase from "./ProfileCardBase";

const OrdersCard: React.VFC = ({ ...props }) => {
  return (
    <ProfileCardBase
      title="Ordrehistorikk"
      actionText="Se ordrehistorikk"
      actionLink="/ecommerce"
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
