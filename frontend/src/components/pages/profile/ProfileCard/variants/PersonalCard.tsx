import { Button, Grid, Typography } from "@material-ui/core";
import Profile from "@public/static/illustrations/Profile.svg";
import Link from "next/link";
import { User } from "src/types/users";
import ProfileCard from "..";

type Props = {
  user?: User;
};

const PersonalCard: React.VFC<Props> = ({ user }) => {
  return (
    <ProfileCard
      title="Personlig informasjon"
      cardActions={
        <Grid container direction="row" justify="flex-end">
          <Grid item>
            <Link passHref href="/profile/edit/">
              <Button>Rediger</Button>
            </Link>
          </Grid>
        </Grid>
      }
      image={Profile}
      alt=""
    >
      <Grid container direction="column">
        <Grid item>{user && <Typography variant="body2">{`${user.firstName} ${user.lastName}`}</Typography>}</Grid>
        <Grid item>{user && <Typography variant="body2">{`${user.gradeYear}. klasse`}</Typography>}</Grid>
      </Grid>
    </ProfileCard>
  );
};

export default PersonalCard;
