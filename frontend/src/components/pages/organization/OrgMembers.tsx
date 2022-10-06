import { useQuery } from "@apollo/client";
import { CircularProgress, Stack, Typography } from "@mui/material";

import { GET_USER } from "@/graphql/users/queries";
import { Organization } from "@/interfaces/organizations";
import { User } from "@/interfaces/users";

type Props = {
  organization: Organization;
};

const OrgMembers: React.FC<Props> = ({ organization }) => {
  const { data, loading, error } = useQuery<{ user: User }>(GET_USER);

  let isHRGroup = false;

  data?.user.memberships?.forEach((membership) => {
    if (membership.group == membership.organization.hrGroup.uuid) {
      isHRGroup = true;
    }
  });

  if (error) return <p>Error</p>;
  if (!data || loading) return <CircularProgress />;

  if (!isHRGroup) return <Typography variant="h3">Du har ikke tilgang til denne siden.</Typography>;

  return (
    <Stack spacing={4}>
      <Typography variant="h3">Oversikt over medlemmer</Typography>
      <Typography variant="h3">Members</Typography>
    </Stack>
  );
};

export default OrgMembers;
