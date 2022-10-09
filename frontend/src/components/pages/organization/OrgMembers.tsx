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

import { AdminOrganizationFragment, MembershipsDocument } from "@/generated/graphql";

type Props = {
  organization: AdminOrganizationFragment;
};

export const OrgMembers: React.FC<Props> = ({ organization }) => {
  const { data, loading, error } = useQuery(MembershipsDocument, { variables: { organizationId: organization.id } });

  if (error) return <p>Error</p>;
  if (!data?.memberships || loading) return <CircularProgress />;

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
            {data.memberships.map((membership) => (
              <TableRow key={membership.id}>
                <TableCell>
                  {membership.user.firstName} {membership.user.lastName}
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
