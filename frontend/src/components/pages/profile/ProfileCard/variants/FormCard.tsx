import { Grid, Typography } from "@material-ui/core";
import Form from "@public/illustrations/Form.svg";
import ProfileCard from "../base";

const FormCard: React.VFC = ({ ...props }) => {
  return (
    <ProfileCard title="Verv" actionText="Se verv" actionLink="/listings" image={Form} alt="" {...props}>
      <Grid container direction="column">
        <Grid item>
          <Typography variant="body2">Her kan du se en oversikt over alle innsendte søknader på verv.</Typography>
        </Grid>
      </Grid>
    </ProfileCard>
  );
};

export default FormCard;
