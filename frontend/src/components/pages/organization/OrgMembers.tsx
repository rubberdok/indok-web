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

import { AdminOrganizationFragment, MembershipsDocument, UserDocument } from "@/generated/graphql";

type Props = {
  organization: AdminOrganizationFragment;
};

export const OrgMembers: React.FC<Props> = ({ organization }) => {
  const {
    data: membershipsData,
    loading: membershipsLoading,
    error: membershipsError,
  } = useQuery(MembershipsDocument, { variables: { organizationId: organization.id } });
  const { data: userData, loading: userLoading, error: userError } = useQuery(UserDocument);

  if (membershipsError || userError) return <p>Error</p>;
  if (!membershipsData?.memberships || membershipsLoading || !userData || userLoading) return <CircularProgress />;

  console.log(membershipsData.memberships);
  console.log(userData);

  let isAdmin = false;
  if (
    membershipsData.memberships?.filter((membership) => membership.user?.id == userData.user?.id)[0].group?.uuid ==
    organization?.hrGroup?.uuid
  ) {
    isAdmin = true;
  }

  [...data?.memberships].sort((a, b) => a.user.firstName.localeCompare(b.user.firstName));

  return (
    <Stack spacing={4}>
      <Typography variant="h3">Oversikt over medlemmer</Typography>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Navn</TableCell>
              <TableCell>Gruppe</TableCell>
              {isAdmin && <TableCell>Rediger</TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {membershipsData.memberships.map((membership) => (
              <TableRow key={membership.id}>
                <TableCell>
                  {membership.user.firstName} {membership.user.lastName}
                </TableCell>
                <TableCell>
                  {membership?.group?.uuid == organization.hrGroup?.uuid ? "Administrator" : "Medlem"}
                </TableCell>
                {isAdmin && (
                  <TableCell>
                    <Button startIcon={<Create />}>Rediger</Button>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Stack>
  );
};
