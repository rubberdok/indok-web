import { Grid, Typography } from "@material-ui/core";
import Profile from "@public/illustrations/Profile.svg";
import { User } from "src/types/users";
import createLinkProfileAction from "./linkProfileAction";
import ProfileCardBase, { ProfileActionProps } from "./ProfileCardBase";

type Props = {
  user?: User;
};

/** Displays user info and a link to the user edit page. */
const PersonalCard: React.VFC<Props & ProfileActionProps> = ({ user, "data-test-id": dataTestId }) => {
  return (
    <ProfileCardBase
      title="Personlig informasjon"
      Action={createLinkProfileAction({ text: "Rediger", link: "/profile/edit" })}
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
