import React, { useState } from "react";
import { useQuery, gql } from "@apollo/client";
import { useRouter } from "next/router";
import { User } from "@interfaces/users";
import {
  Grid,
  Box,
  Typography,
  Card,
  CardHeader,
  Divider,
  CardContent,
  TableContainer,
  Table,
  TableRow,
  TableHead,
  TableCell,
  TableBody,
  makeStyles,
  Button,
  Checkbox,
} from "@material-ui/core";
import { Organization } from "@interfaces/organizations";
import FilterUsers from "./FilterUsers";
import { PersonAdd } from "@material-ui/icons";
import AddMember from "@components/pages/orgs/UserAdmin/AddMember";

const useStyles = makeStyles(() => ({
  hover: {
    "&:hover": {
      cursor: "default",
    },
  },
}));

type Props = {
  organization: Organization;
};

const EditUsersInOrganization: React.FC<Props> = ({ organization }) => {
  const router = useRouter();
  const { orgId } = router.query;
  const orgNumberId = parseInt(orgId as string);
  const classes = useStyles();
  const [checkedPeople, setCheckedPeople] = useState<User[]>([]);
  const [enabledFilters, setEnabledFilter] = useState<string[]>([]);
  const [addMemberOpen, openAddMember] = useState<boolean>(false);

  const handleEnabledFilter = (name: string, checked: boolean) => {
    if (checked) {
      if (!enabledFilters.includes(name)) {
        setEnabledFilter([...enabledFilters, name]);
      }
    } else {
      if (enabledFilters.includes(name)) {
        setEnabledFilter(enabledFilters.filter((filter) => filter == name));
      }
    }
  };

  const handleCheckedPeople = (user: User, checked: boolean) => {
    if (checked) {
      if (!checkedPeople.includes(user)) {
        setCheckedPeople([...checkedPeople, user]);
        console.log(checkedPeople);
      }
    } else {
      if (checkedPeople.includes(user)) {
        setCheckedPeople(checkedPeople.filter((checkedUser) => checkedUser.id !== user.id));
        console.log(checkedPeople);
      }
    }
  };
  const { error, loading, data } = useQuery<{
    organization: { users: User[] };
  }>(
    gql`
      query organization($id: ID) {
        organization(id: $id) {
          users {
            username
            firstName
            lastName
            email
          }
        }
      }
    `,
    { variables: { id: orgNumberId } }
  );

  if (error) return <p>Error</p>;
  if (loading) return <p>Loading...</p>;

  return (
    <Box m={10}>
      {data?.organization?.users && <>
        {addMemberOpen && <AddMember open={addMemberOpen} setOpen={openAddMember} organizationId={orgNumberId} />}
        <Grid container spacing={4}>
          <Grid item xs={12} container justifyContent="space-between" alignItems="center">
            <Grid item>
              <Typography variant="h1">{organization.name}</Typography>
            </Grid>
            <Grid item>
              <Button variant="contained" color="primary" startIcon={<PersonAdd />} onClick={() => openAddMember(true)}>
                Legg til medlem
              </Button>
            </Grid>
          </Grid>
          <FilterUsers organization={organization}/>
          <Grid item container>
            <Grid item xs>
              <Card variant="outlined">
                <CardHeader title="Rediger medlemmer" />
                <Divider variant="middle" />
                {data.organization.users && (
                  <CardContent>
                    <TableContainer>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell>Navn</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell />
                            <TableCell />
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {data?.organization?.users.map((user: User, index) => (
                            <TableRow className={classes.hover} key={index} hover>
                              <TableCell>{user.firstName + " " + user.lastName}</TableCell>
                              <TableCell>{user.email}</TableCell>
                              <TableCell size="small" align="right">
                                <Button variant="contained" color="primary">
                                  Rediger rolle
                                </Button>
                              </TableCell>
                              <TableCell size="small" align="right">
                              <Checkbox
                                  color="primary"
                                  onChange={(event) => {
                                    handleCheckedPeople(user, event.target.checked);
                                  }}
                                />
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </CardContent>
                )}
              </Card>
            </Grid>
          </Grid>
        </Grid>
      </>}
    </Box>
  );
};

export default EditUsersInOrganization;
