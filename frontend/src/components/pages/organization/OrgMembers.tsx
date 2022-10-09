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

import { AdminOrganizationFragment, OrgUsersDocument, UserWithEventsAndOrgsDocument } from "@/generated/graphql";

type Props = {
  organization: AdminOrganizationFragment;
};

export const OrgMembers: React.FC<Props> = ({ organization }) => {
  const { data, loading, error } = useQuery(UserWithEventsAndOrgsDocument);

  const {
    data: usersData,
    loading: usersLoading,
    error: usersError,
  } = useQuery(OrgUsersDocument, {
    variables: { orgId: organization.id },
    skip: Number.isNaN(parseInt(organization.id)),
  });

  if (error || usersError) return <p>Error</p>;
  if (!data || loading || !usersData || usersLoading) return <CircularProgress />;

  let isHRGroup = false;

  data?.user?.memberships?.forEach((membership) => {
    if (!membership.group?.uuid) return;
    if (membership.group.uuid === membership?.organization?.hrGroup?.uuid) {
      isHRGroup = true;
    }
  });

  if (!isHRGroup) return <Typography variant="h3">Du har ikke tilgang til denne siden.</Typography>;

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
            {usersData?.organization?.users.map((user) => (
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
