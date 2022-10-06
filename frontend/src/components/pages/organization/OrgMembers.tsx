import { useQuery } from "@apollo/client";
import {
  CircularProgress,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

import { GET_ORGANIZATION_USERS } from "@/graphql/orgs/queries";
import { GET_USER } from "@/graphql/users/queries";
import { Organization } from "@/interfaces/organizations";
import { User } from "@/interfaces/users";

type Props = {
  organization: Organization;
};

const OrgMembers: React.FC<Props> = ({ organization }) => {
  const { data, loading, error } = useQuery<{ user: User }>(GET_USER);

  const orgNumberId = parseInt(organization.id as string);

  const {
    data: usersData,
    loading: usersLoading,
    error: usersError,
  } = useQuery<{ organization: Organization }, { orgId: number }>(GET_ORGANIZATION_USERS, {
    variables: { orgId: orgNumberId },
    skip: Number.isNaN(orgNumberId),
  });
  if (usersError) return <p>Error</p>;
  if (!usersData || usersLoading) return <CircularProgress />;

  let isHRGroup = false;

  data?.user.memberships?.forEach((membership) => {
    if (!membership.group?.uuid) return;
    if (membership.group.uuid == membership.organization.hrGroup.uuid) {
      isHRGroup = true;
    }
  });

  if (error) return <p>Error</p>;
  if (!data || loading) return <CircularProgress />;

  if (!isHRGroup) return <Typography variant="h3">Du har ikke tilgang til denne siden.</Typography>;
  console.log(usersData);
  return (
    <Stack spacing={4}>
      <Typography variant="h3">Oversikt over medlemmer</Typography>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Navn</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {usersData.organization.users.map((user: User) => (
              <TableRow key={user.id}>
                <TableCell>
                  {user.firstName} {user.lastName}
                </TableCell>
                <TableCell size="small" align="right"></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Stack>
  );
};

export default OrgMembers;
