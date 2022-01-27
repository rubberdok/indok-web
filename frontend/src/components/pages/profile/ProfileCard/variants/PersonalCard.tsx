import { Grid, Typography } from "@material-ui/core";
import Profile from "@public/illustrations/Profile.svg";
import { User } from "src/types/users";
import ProfileCardBase, { IntegrationTestProps } from "./ProfileCardBase";

type Props = {
  user?: User;
};

const PersonalCard: React.VFC<Props & IntegrationTestProps> = ({ user, "data-test-id": dataTestId }) => {
  return (
    <ProfileCardBase
      title="Personlig informasjon"
      actionText="Rediger"
      actionLink="/profile/edit/"
      image={Profile}
      alt=""
      data-test-id={dataTestId}
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
    </ProfileCardBase>
  );
};

export default PersonalCard;
