import { Skeleton, Typography } from "@mui/material";

import { ProfileCardBase } from "./ProfileCardBase";

export const SkeletonCard: React.FC = () => (
  <Skeleton variant="rounded" width="100%">
    <ProfileCardBase title="Loading" actionText="Loading" actionLink="/">
      <Typography variant="body2">Loading</Typography>
      <Typography variant="body2">Loading</Typography>
    </ProfileCardBase>
  </Skeleton>
);
