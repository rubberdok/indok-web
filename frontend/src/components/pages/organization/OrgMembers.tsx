import { useQuery } from "@apollo/client";
import { Create } from "@mui/icons-material";
import {
  Button,
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

import { PermissionRequired } from "@/components/Auth";
import { AdminOrganizationFragment, MembershipsDocument, UserDocument } from "@/generated/graphql";

type Props = {
  organization: AdminOrganizationFragment;
};

export const OrgMembers: React.FC<Props> = ({ organization }) => {
  const { data, loading, error } = useQuery(MembershipsDocument, { variables: { organizationId: organization.id } });

  if (error) return <p>Error</p>;
  if (!data?.memberships || loading) return <CircularProgress />;

  data?.memberships?.sort((a, b) => a.user.firstName.localeCompare(b.user.firstName));

  return (
    <Stack spacing={4}>
      <Typography variant="h3">Oversikt over medlemmer</Typography>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Navn</TableCell>
              <TableCell>Gruppe</TableCell>
              <PermissionRequired permission="organizations.change_organization">
                <TableCell>Rediger</TableCell>
              </PermissionRequired>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.memberships.map((membership) => (
              <TableRow key={membership.id}>
                <TableCell>
                  {membership.user.firstName} {membership.user.lastName}
                </TableCell>
                <TableCell>
                  {membership?.group?.uuid == organization.hrGroup?.uuid ? "Administrator" : "Medlem"}
                </TableCell>
                <PermissionRequired permission="organizations.change_organization">
                  <TableCell>
                    <Button startIcon={<Create />}>Rediger</Button>
                  </TableCell>
                </PermissionRequired>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Stack>
  );
};
