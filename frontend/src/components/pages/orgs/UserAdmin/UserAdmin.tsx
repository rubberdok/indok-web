import React, { useState, useEffect } from "react";
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

type PermissionGroups = {
  name: string;
  uuid: string;
  users: {
    id: string;
  }[];
};

type UserWithCheck = User & { checked: boolean; ableToSeeSearchFilter: boolean; abletoSeeResponsibleGroup: boolean };
type PermissionGroupsWithCheck = PermissionGroups & { checked: boolean };

const EditUsersInOrganization: React.FC<Props> = ({ organization }) => {
  const router = useRouter();
  const { orgId } = router.query;
  const orgNumberId = parseInt(orgId as string);
  const classes = useStyles();
  //All people fetched that are inside the organization
  const [checkedPeople, setCheckedPeople] = useState<UserWithCheck[]>([]);
  //The current searchfilter
  const [searchFilter, setSearchFilter] = useState("");
  //Fetched permissiongroups and whether they are checked
  const [fetchedPermissionGroups, setFetchedPermissionGroups] = useState<PermissionGroupsWithCheck[]>([]);

  //Gucci - Handling logic when checkmarking people
  const handleCheckedPeople = (user: UserWithCheck) => {
    const newList = checkedPeople.map((checkedUser) => {
      if (checkedUser.id == user.id) {
        const updateUser = {
          ...checkedUser,
          checked: !checkedUser.checked,
        };
        return updateUser;
      }
      return checkedUser;
    });
    setCheckedPeople(newList);
    //
  };

  //TODO - Reseting the checkedFilter
  const resetCheckedFilter = () => {
    const newCheckedPeople = checkedPeople.map((checkedUser) => {
      const updatedUser = {
        ...checkedUser,
        checked: false,
      };
      return updatedUser;
    });
    setCheckedPeople(newCheckedPeople);
  };

  //Gucci - Fetching users in the organization
  const { error, loading, data } = useQuery<{
    organization: { users: User[]; permissionGroups: PermissionGroups[] };
  }>(
    gql`
      query organization($id: ID) {
        organization(id: $id) {
          users {
            id
            username
            firstName
            lastName
            email
          }
          permissionGroups {
            name
            uuid
            users {
              id
            }
          }
        }
      }
    `,
    { variables: { id: orgNumberId } }
  );

  //TODO: Test this with actual data - Should switch ableToSee based on if the person is in the specified group or not
  useEffect(() => {
    let somethingChecked = false;

    // Reseting all of the users
    const removingAllUser: UserWithCheck[] = [];
    checkedPeople.map((user) => {
      const newUser = {
        ...user,
        abletoSeeResponsibleGroup: false,
      };
      removingAllUser.push(newUser);
    });

    let updateUsers: UserWithCheck[] = removingAllUser;
    const secondPermission = false;
    fetchedPermissionGroups.forEach((permission) => {
      if (permission.checked) {
        somethingChecked = true;

        const temp: UserWithCheck[] = [];

        updateUsers.forEach((user) => {
          let isInGroup = false;
          permission.users.forEach((id) => {
            // Checking if we want to update the user
            if (user.id == id.id) {
              isInGroup = true;
              const updateUser = {
                ...user,
                abletoSeeResponsibleGroup: true,
              };
              temp.push(updateUser);
            }
          });

          if (!isInGroup) {
            temp.push(user);
          }
        });

        updateUsers = temp;
      }
    });

    //If no group has been selected, show everyone.
    if (!somethingChecked) {
      const resetingUsers: UserWithCheck[] = [];
      checkedPeople.map((user) => {
        const newUser = {
          ...user,
          abletoSeeResponsibleGroup: true,
        };
        resetingUsers.push(newUser);
      });
      setCheckedPeople(resetingUsers);
    } else {
      setCheckedPeople(updateUsers);
    }
  }, [fetchedPermissionGroups]);

  //Gucci - When people are fetched all people are choosen
  useEffect(() => {
    const allUsers: UserWithCheck[] = [];
    data?.organization.users.forEach((user) => {
      const userWithCheck = {
        ...user,
        checked: false,
        ableToSeeSearchFilter: true,
        abletoSeeResponsibleGroup: true,
      };
      allUsers.push(userWithCheck);
    });
    setCheckedPeople(allUsers);

    const allPermissionGroups: PermissionGroupsWithCheck[] = [];
    data?.organization.permissionGroups.forEach((permission) => {
      const permissionWithCheck = {
        ...permission,
        checked: false,
      };
      allPermissionGroups.push(permissionWithCheck);
    });
    setFetchedPermissionGroups(allPermissionGroups);
  }, [data]);

  //Gucci - Filter out users that does not fufill the searchbar query
  useEffect(() => {
    const updatedUsers = checkedPeople.map((checkedUser) => {
      const fullName = checkedUser.firstName + " " + checkedUser.lastName;
      if (!fullName.toLocaleLowerCase().includes(searchFilter.toLocaleLowerCase())) {
        const updatedUser = {
          ...checkedUser,
          ableToSeeSearchFilter: false,
        };
        return updatedUser;
      } else {
        const updatedUser = {
          ...checkedUser,
          ableToSeeSearchFilter: true,
        };
        return updatedUser;
      }
    });
    setCheckedPeople(updatedUsers);
  }, [searchFilter]);

  if (error) return <p>Error</p>;
  if (loading) return <p>Loading...</p>;

  return (
    <Box m={10}>
      {data?.organization?.users ? (
        <Grid container spacing={4}>
          <Grid item xs={12}>
            <Typography variant="h1">{organization.name}</Typography>
          </Grid>
          {fetchedPermissionGroups ? (
            <FilterUsers
              setPermissionGroups={setFetchedPermissionGroups}
              permissionGroups={fetchedPermissionGroups}
              setSearch={setSearchFilter}
              setResetCheckedPeople={resetCheckedFilter}
              checkedPeople={checkedPeople}
            />
          ) : (
            <></>
          )}
          <Grid item container>
            <Grid item xs>
              <Card variant="outlined">
                <CardHeader title="Rediger medlemmer" />
                <Divider variant="middle" />
                {data.organization.users ? (
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
                          {checkedPeople?.map((user: UserWithCheck, index) => {
                            if (user.ableToSeeSearchFilter && user.abletoSeeResponsibleGroup) {
                              return (
                                <TableRow className={classes.hover} key={index} hover>
                                  <TableCell>{user.firstName + " " + user.lastName}</TableCell>
                                  <TableCell>{user.email}</TableCell>
                                  <TableCell size="small" align="right">
                                    <Button variant="contained" color="primary">
                                      Rediger tilgang
                                    </Button>
                                  </TableCell>
                                  <TableCell size="small" align="right">
                                    <Checkbox
                                      checked={user.checked}
                                      color="primary"
                                      onChange={() => {
                                        handleCheckedPeople(user);
                                      }}
                                    />
                                  </TableCell>
                                </TableRow>
                              );
                            }
                            return;
                          })}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </CardContent>
                ) : null}
              </Card>
            </Grid>
          </Grid>
        </Grid>
      ) : null}
    </Box>
  );
};

export default EditUsersInOrganization;
