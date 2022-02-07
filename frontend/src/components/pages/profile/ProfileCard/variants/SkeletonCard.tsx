import { Typography } from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";
import LinkAction from "../LinkAction";
import BaseCard from "../BaseCard";

/** Placeholder card while profile cards are loading. */
const SkeletonCard: React.VFC = () => (
  <Skeleton variant="rect" width="100%" height="100%">
    <BaseCard title="Loading" Action={<LinkAction text="Loading" link="/" />}>
      <Typography variant="body2">Loading</Typography>
      <Typography variant="body2">Loading</Typography>
    </BaseCard>
  </Skeleton>
);

export default SkeletonCard;
