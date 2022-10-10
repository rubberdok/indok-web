import { useQuery } from "@apollo/client";
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
import { useState } from "react";

import { PermissionRequired } from "@/components/Auth";
import { AdminOrganizationFragment, MembershipsDocument } from "@/generated/graphql";

type Props = {
  organization: AdminOrganizationFragment;
};

export const OrgMembers: React.FC<Props> = ({ organization }) => {
  const { data, loading, error } = useQuery(MembershipsDocument, { variables: { organizationId: organization.id } });

  const [userInput, setUserInput] = useState<string>("");

  if (error) return <p>Error</p>;
  if (!data?.memberships || loading) return <CircularProgress />;

<<<<<<< HEAD
  console.log(data.memberships);
  data?.memberships?.sort((a, b) => a.user.firstName.localeCompare(b.user.firstName));
=======
  //Sorterer medlemmer alfabetisk
  [...data?.memberships].sort((a, b) => a.user.firstName.localeCompare(b.user.firstName));

  const addUser = () => {
    //Legg til funksjonalitet for å legge til bruker ved brukernavn
    console.log(userInput);
    setUserInput(""); //Funker men oppdaterer ikke siden?
  };
>>>>>>> 80e11b75 (add username input to add members and create buttons for changing member-status)

  [...data?.memberships].sort((a, b) => a.user.firstName.localeCompare(b.user.firstName));

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
            >
              {userInput}
            </TextField>
          </Grid>
          <Grid item xs={6} md={4} lg={2}>
            <Button startIcon={<GroupAdd />} onClick={() => addUser()}>
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
                    <Button variant="contained" color="warning" startIcon={<AdminPanelSettings />} sx={{ mr: 1 }}>
                      {membership?.group?.uuid == organization.hrGroup?.uuid ? "Demoter" : "Promoter"}
                    </Button>
                    <Button variant="contained" color="error" startIcon={<Delete />}>
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
