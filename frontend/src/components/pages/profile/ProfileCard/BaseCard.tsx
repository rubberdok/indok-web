import { Card, CardContent, CardHeader, Grid, useTheme } from "@material-ui/core";
import Image from "next/image";
import useStyles from "./styles";

type Props = {
  title: string;
  Action?: React.ReactNode;
  image?: StaticImageData;
  alt?: string;
};

/**
 * Base card for cards on the profile page.
 * Takes an Action component that is displayed as a card action on the bottom of the card.
 */
const BaseCard: React.FC<Props> = ({ title, children, Action, image, alt }) => {
  const theme = useTheme();
  const classes = useStyles();

  return (
    <Card className={classes.fullHeightCard}>
      <Grid container direction="row" alignItems="center" style={{ height: "100%" }}>
        <Grid container item xs style={{ height: "100%" }} direction="column" justifyContent="space-between">
          <CardHeader title={title} />
          <CardContent>{children}</CardContent>
          {Action}
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

export default BaseCard;
