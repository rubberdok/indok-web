import { useMutation, useQuery } from "@apollo/client";
import { Delete, GroupAdd, AdminPanelSettings } from "@mui/icons-material";
import {
  Button,
  CircularProgress,
  Grid,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { orderBy } from "lodash";
import { useState } from "react";

import { PermissionRequired } from "@/components/Auth";
import {
  AdminOrganizationFragment,
  MembershipsDocument,
  MembershipType,
  AssignMembershipWithUsernameDocument,
  DeleteMembershipDocument,
  ChangeMembershipDocument,
} from "@/generated/graphql";

type Props = {
  organization: AdminOrganizationFragment;
};

export const OrgMembers: React.FC<Props> = ({ organization }) => {
  const { data, loading, error } = useQuery(MembershipsDocument, { variables: { organizationId: organization.id } });
  const [AssignMembershipWithUsername] = useMutation(AssignMembershipWithUsernameDocument);
  const [DeleteMembership] = useMutation(DeleteMembershipDocument);
  const [ChangeMembership] = useMutation(ChangeMembershipDocument);

  const [userInput, setUserInput] = useState<string>("");

  if (error) return <p>Error</p>;
  if (!data?.memberships || loading) return <CircularProgress />;

  //Sorterer medlemmer alfabetisk
  const memberships = orderBy(data?.memberships, "user.firstName", "asc");

  const handleAddMembership = () => {
    //Legg til funksjonalitet for å legge til bruker ved brukernavn

    AssignMembershipWithUsername({
      variables: {
        membershipData: {
          organizationId: organization.id,
          username: userInput.toLowerCase(), //Just to make sure
          groupId: organization?.memberGroup?.uuid,
        },
      },
    });
    //Problem: Clientside cache doesnt get updated
    setUserInput("");
  };

  const handleGroupChange = (membership: MembershipType | any) => {
    if (!membership) return;

    const currentRole = membership?.group?.uuid == organization.adminGroup?.uuid ? "ADMIN" : "MEMBER";
    if (currentRole == "ADMIN") {
      //Legg til funksjonalitet for å demotere bruker

      ChangeMembership({
        variables: {
          membershipData: {
            membershipId: membership?.id,
            groupId: organization?.memberGroup?.uuid,
          },
        },
      });
    }

    if (currentRole == "MEMBER") {
      //Legg til funksjonalitet for å promote bruker

      ChangeMembership({
        variables: {
          membershipData: {
            membershipId: membership?.id,
            groupId: organization?.adminGroup?.uuid,
          },
        },
      });
    }
  };

  const handleRemoveMembership = (membership: MembershipType | any) => {
    if (!membership) return;

    DeleteMembership({
      variables: {
        membershipId: membership.id,
      },
    });

    //Problem: Clientside cache doesnt get updated
  };

  return (
    <Stack spacing={4}>
      <Typography variant="h3">Oversikt over medlemmer</Typography>
      <PermissionRequired permission="organizations.change_organization">
        <Grid container spacing={1}>
          <Grid item xs={6} md={4} lg={2}>
            <TextField
              variant="standard"
              placeholder="Skriv inn brukernavn"
              onChange={(e) => setUserInput(e.target.value)}
              value={userInput}
            />
          </Grid>
          <Grid item xs={6} md={4} lg={2}>
            <Button startIcon={<GroupAdd />} onClick={() => handleAddMembership()}>
              Legg til
            </Button>
          </Grid>
        </Grid>
      </PermissionRequired>
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
            {memberships.map((membership) => (
              <TableRow key={membership.id}>
                <TableCell>
                  {membership.user.firstName} {membership.user.lastName}
                </TableCell>
                <TableCell>
                  {membership?.group?.uuid == organization.adminGroup?.uuid ? "Administrator" : "Medlem"}
                </TableCell>
                <PermissionRequired permission="organizations.change_organization">
                  <TableCell>
                    <Button
                      onClick={() => handleGroupChange(membership)}
                      variant="contained"
                      color="warning"
                      startIcon={<AdminPanelSettings />}
                      sx={{ mr: 1 }}
                    >
                      {membership?.group?.uuid == organization.adminGroup?.uuid ? "Demoter" : "Promoter"}
                    </Button>
                    <Button
                      onClick={() => handleRemoveMembership(membership)}
                      variant="contained"
                      color="error"
                      startIcon={<Delete />}
                    >
                      Fjern
                    </Button>
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
