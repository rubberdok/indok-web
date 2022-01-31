import { Grid, Typography } from "@material-ui/core";
import CreditCard from "@public/illustrations/CreditCard.svg";
import createLinkProfileAction from "./linkProfileAction";
import ProfileCardBase, { ProfileActionProps } from "./ProfileCardBase";

/** Displays a card on the profile page that links to the user's orders. */
const OrdersCard: React.VFC<ProfileActionProps> = (props) => {
  return (
    <ProfileCardBase
      title="Ordrehistorikk"
      Action={createLinkProfileAction({ text: "Se ordrehistorikk", link: "/ecommerce" })}
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
