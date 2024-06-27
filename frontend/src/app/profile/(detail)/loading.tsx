import { Avatar, Container, Unstable_Grid2 as Grid, Skeleton, Typography } from "@mui/material";

import { Breadcrumbs } from "@/app/components/Breadcrumbs";

import { LogoutButton } from "./components/LogoutButton";
import { SkeletonCard } from "./components/ProfileCard/variants/SkeletonCard";

export default function Loading() {
  return (
    <Container>
      <Breadcrumbs
        links={[
          { name: "Hjem", href: "/" },
          { name: "Profil", href: "/profile" },
        ]}
        sx={{ mb: 4 }}
      />
      <Grid container direction="column" spacing={2} alignItems="center" justifyContent="center" sx={{ mb: 4 }}>
        <Grid>
          <Skeleton variant="circular">
            <Avatar
              sx={{
                bgcolor: "primary.main",
                width: 128,
                height: 128,
              }}
            >
              <Typography variant="h3" component="p" color="common.white">
                AA
              </Typography>
            </Avatar>
          </Skeleton>
        </Grid>
        <Grid>
          <Typography variant="h4" component="h1">
            <Skeleton width={200} />
          </Typography>
        </Grid>
        <Grid xs={10}>
          <Typography variant="body1" textAlign="center">
            <Skeleton />
          </Typography>
        </Grid>

        <Grid container justifyContent="center" alignItems="stretch" spacing={4} width="100%">
          <Grid xs={12} md={6} lg={5}>
            <SkeletonCard />
          </Grid>
          <Grid xs={12} md={6} lg={5}>
            <SkeletonCard />
          </Grid>
          <Grid xs={12} md={6} lg={5}>
            <SkeletonCard />
          </Grid>
          <Grid xs={12} md={6} lg={5}>
            <SkeletonCard />
          </Grid>
          <Grid xs={12} md={6} lg={5}>
            <SkeletonCard />
          </Grid>
        </Grid>

        <Grid>
          <Skeleton variant="rounded">
            <LogoutButton />
          </Skeleton>
        </Grid>
      </Grid>
    </Container>
  );
}
