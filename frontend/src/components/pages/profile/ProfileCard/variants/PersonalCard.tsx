import { Grid, Typography } from "@material-ui/core";
import Profile from "@public/illustrations/Profile.svg";
import { User } from "src/types/users";
import ProfileCard from "../base";

type Props = {
  user?: User;
};

const PersonalCard: React.VFC<Props> = ({ user }) => {
  return (
    <ProfileCard title="Personlig informasjon" actionText="Rediger" actionLink="/profile/edit/" image={Profile} alt="">
      <Grid container direction="column">
        <Grid item>{user && <Typography variant="body2">{`${user.firstName} ${user.lastName}`}</Typography>}</Grid>
        <Grid item>
          {user && user.gradeYear && <Typography variant="body2">{`${user.gradeYear}. klasse`}</Typography>}
        </Grid>
      </Grid>
    </ProfileCard>
  );
};

export default PersonalCard;
