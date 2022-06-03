import { Avatar, Grid, Typography, useTheme } from "@mui/material";
import { Skeleton } from "@mui/material";
import SkeletonCard from "./ProfileCard/variants/SkeletonCard";

const ProfileSkeleton: React.VFC = () => {
  const theme = useTheme();

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
          <Skeleton variant="circular">
            <Avatar style={{ backgroundColor: "#526fa0", width: theme.spacing(16), height: theme.spacing(16) }} />
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
                Her kan du endre din informasjon, se tidligere arrangementer og foreningene der du er medlem.
              </Typography>
            </Skeleton>
          </Grid>
        </Grid>

        <Grid container item spacing={4} justifyContent="center" sm={10} xs={12} alignItems="stretch">
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
