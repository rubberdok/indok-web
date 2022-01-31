import { Card, CardContent, CardHeader, Grid, useTheme } from "@material-ui/core";
import Image from "next/image";
import useStyles from "../styles";

export type ProfileActionProps = {
  "data-test-id"?: string;
};

type Props = {
  title: string;
  Action?: React.VFC<ProfileActionProps>;
  image?: StaticImageData;
  alt?: string;
};

/**
 * Base component for cards on the profile page.
 * Displays the given title, children and image (with alt text).
 * Also takes an Action component for the card action,
 * that must accept ProfileActionProps.
 */
const ProfileCardBase: React.FC<Props & ProfileActionProps> = ({
  title,
  children,
  Action,
  image,
  alt,
  ...actionProps
}) => {
  const theme = useTheme();
  const classes = useStyles();

  return (
    <Card className={classes.fullHeightCard}>
      <Grid container direction="row" alignItems="center" style={{ height: "100%" }}>
        <Grid container item xs style={{ height: "100%" }} direction="column" justifyContent="space-between">
          <CardHeader title={title} />
          <CardContent>{children}</CardContent>
          {Action && <Action {...actionProps} />}
        </Grid>
        {image && (
          <Grid item xs={3} style={{ marginRight: theme.spacing(4) }}>
            <Image src={image} layout="responsive" objectFit="contain" alt={alt} />
          </Grid>
        )}
      </Grid>
    </Card>
  );
};

export default ProfileCardBase;
