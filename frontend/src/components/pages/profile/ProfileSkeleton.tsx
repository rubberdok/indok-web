import useStyles from "@components/pages/profile/styles";
import { Avatar, Grid, Typography, useTheme } from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";
import SkeletonCard from "./ProfileCard/variants/SkeletonCard";

const ProfileSkeleton: React.VFC = () => {
  const theme = useTheme();
  const classes = useStyles();

  return (
    <Grid
      container
      direction="column"
      alignItems="center"
      style={{ marginTop: theme.spacing(8), marginBottom: theme.spacing(8) }}
      spacing={2}
    >
      <>
        <Grid item>
          <Skeleton variant="circle">
            <Avatar classes={{ root: classes.large }} />
          </Skeleton>
        </Grid>
        <Grid container item direction="column" alignItems="center" xs={10} style={{ marginBottom: theme.spacing(4) }}>
          <Grid item>
            <Skeleton variant="text">
              <Typography variant="subtitle1" component="h1">
                Hei, Navn
              </Typography>
            </Skeleton>
          </Grid>
          <Grid item>
            <Skeleton variant="text" width="100%" height="100%">
              <Typography variant="body2" align="center">
                Her kan du endre din informasjon, se tidligere arrangementer og organisasjonene der du er medlem.
              </Typography>
            </Skeleton>
          </Grid>
        </Grid>

        <Grid
          container
          item
          className={classes.cards}
          spacing={4}
          justifyContent="center"
          sm={10}
          xs={12}
          alignItems="stretch"
        >
          <Grid item md={6}>
            <SkeletonCard />
          </Grid>
          <Grid item md={6}>
            <SkeletonCard />
          </Grid>
          <Grid item md={6}>
            <SkeletonCard />
          </Grid>
          <Grid item md={6}>
            <SkeletonCard />
          </Grid>
          <Grid item md={6}>
            <SkeletonCard />
          </Grid>
          <Grid item md={6}>
            <SkeletonCard />
          </Grid>
        </Grid>
      </>
    </Grid>
  );
};

export default ProfileSkeleton;
