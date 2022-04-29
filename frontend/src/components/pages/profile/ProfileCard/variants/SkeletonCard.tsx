import { Typography } from "@mui/material";
import { Skeleton } from "@mui/material";
import ProfileCardBase from "./ProfileCardBase";

const SkeletonCard: React.VFC = () => (
  <Skeleton variant="rectangular" width="100%" height="100%">
    <ProfileCardBase title="Loading" actionText="Loading" actionLink="/">
      <Typography variant="body2">Loading</Typography>
      <Typography variant="body2">Loading</Typography>
    </ProfileCardBase>
  </Skeleton>
);

export default SkeletonCard;
