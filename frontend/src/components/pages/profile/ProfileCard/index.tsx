import { Card, CardActions, CardContent, CardHeader, Grid, useTheme } from "@material-ui/core";
import Image from "next/image";
import useStyles from "./styles";

type Props = {
  title: string;
  children: React.ReactElement;
  cardActions?: React.ReactElement;
  image?: StaticImageData;
};

const ProfileCard: React.FC<Props> = ({ title, children, cardActions, image }) => {
  const theme = useTheme();
  const classes = useStyles();

  return (
    <Card className={classes.fullHeightCard}>
      <Grid container direction="row" alignItems="center">
        <Grid item xs>
          <CardHeader title={title} />
          <CardContent>{children}</CardContent>
        </Grid>
        {image && (
          <Grid item xs={3} style={{ marginRight: theme.spacing(6) }}>
            <Image src={image} layout="responsive" objectFit="contain" />
          </Grid>
        )}
      </Grid>
      <CardActions>{cardActions}</CardActions>
    </Card>
  );
};

export default ProfileCard;
