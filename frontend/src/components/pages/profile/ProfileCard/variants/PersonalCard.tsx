import { Grid, Typography } from "@material-ui/core";
import Profile from "@public/illustrations/Profile.svg";
import { User } from "src/types/users";
import ProfileCard from "../base";

type Props = {
  user?: User;
  "data-test-id"?: string;
};

const PersonalCard: React.VFC<Props> = ({ user, "data-test-id": dataTestId, ...props }) => {
  return (
    <ProfileCard
      title="Personlig informasjon"
      actionText="Rediger"
      actionLink="/profile/edit/"
      image={Profile}
      alt=""
      data-test-id={dataTestId}
      {...props}
    >
      <Grid container direction="column">
        <Grid item>
          {user && (
            <Typography
              variant="body2"
              data-test-id={`${dataTestId}name`}
            >{`${user.firstName} ${user.lastName}`}</Typography>
          )}
        </Grid>
        <Grid item>
          {user && user.gradeYear && <Typography variant="body2">{`${user.gradeYear}. klasse`}</Typography>}
        </Grid>
      </Grid>
    </ProfileCard>
  );
};

export default PersonalCard;
