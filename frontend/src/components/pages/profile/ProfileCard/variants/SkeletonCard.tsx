import { Typography } from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";
import ProfileCardBase from "./ProfileCardBase";

const SkeletonCard: React.VFC = () => (
  <Skeleton variant="rect" width="100%" height="100%">
    <ProfileCardBase title="Loading" actionText="Loading" actionLink="/">
      <Typography variant="body2">Loading</Typography>
      <Typography variant="body2">Loading</Typography>
    </ProfileCardBase>
  </Skeleton>
);

export default SkeletonCard;
