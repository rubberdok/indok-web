import Layout from "@components/Layout";
import { CircularProgress } from "@material-ui/core";

const ProfileSkeleton: React.VFC = () => {
  return (
    <Layout>
      <CircularProgress />;
    </Layout>
  );
};

export default ProfileSkeleton;
