import { Card, CardContent, CardHeader, Grid, useTheme } from "@material-ui/core";
import Image from "next/image";
import { ComponentType } from "react";
import useStyles from "../styles";

export type IntegrationTestProps = {
  "data-test-id"?: string;
};

type Props = {
  title: string;
  Action?: React.VFC<IntegrationTestProps>;
  image?: StaticImageData;
  alt?: string;
};

const ProfileCardBase: React.FC<Props & IntegrationTestProps> = ({
  title,
  children,
  Action,
  image,
  alt,
  "data-test-id": dataTestId,
}) => {
  const theme = useTheme();
  const classes = useStyles();

  return (
    <Card className={classes.fullHeightCard}>
      <Grid container direction="row" alignItems="center" style={{ height: "100%" }}>
        <Grid container item xs style={{ height: "100%" }} direction="column" justifyContent="space-between">
          <CardHeader title={title} />
          <CardContent>{children}</CardContent>
          {Action && <Action data-test-id={dataTestId} />}
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
