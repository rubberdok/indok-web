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

type UserWithCheck = User & { checked: boolean, ableToSee: boolean };

const EditUsersInOrganization: React.FC<Props> = ({ organization }) => {
  const router = useRouter();
  const { orgId } = router.query;
  const orgNumberId = parseInt(orgId as string);
  const classes = useStyles();
  //All people fetched that are inside the group
  const [checkedPeople, setCheckedPeople] = useState<UserWithCheck[]>([]);
  //Group filters that are choosen
  const [groupFilter, setGroupFilter] = useState<string[]>([]);
  //The current searchfilter 
  const [searchFilter, setSearchFilter] = useState("");

  //Function that is sent to filter component
  const handleSearch = (text: string) => {
    setSearchFilter(text);
  }

  //Handling the sorting with people inside groups
  const handleGroupFilter = (name: string, checked: boolean) => {
    if (checked) {
      if (!groupFilter.includes(name)) {
        setGroupFilter([...groupFilter, name]);
      }
    } else {
      if (groupFilter.includes(name)) {
        setGroupFilter(groupFilter.filter((filter) => filter == name));
      }
    }
  };

  //Handling logic when checkmarking people
  const handleCheckedPeople = (user: UserWithCheck) => {
    const newList = checkedPeople.map((checkedUser) => {
      console.log('id:');
      console.log(checkedUser.id);
      console.log(user.id);
      if (checkedUser.id == user.id) {
        const updateUser = {
          ...checkedUser,
          checked: !checkedUser.checked,
        }
        return updateUser;
      }
      return checkedUser;

    });
    setCheckedPeople(newList);
  };

  //Gucci - Reseting the checkedFilter
  const resetCheckedFilter = () => {
    const newCheckedPeople = checkedPeople.map((checkedUser) => {
      const updatedUser = {
        ...checkedUser,
        checked: false,
      }
      return updatedUser;
    });
    setCheckedPeople(newCheckedPeople);
  }

  //Gucci - Fetching users in the organization
  const { error, loading, data } = useQuery<{
    organization: { users: User[] };
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
        }
      }
    `,
    { variables: { id: orgNumberId } }
  );

  //Gucci - When people are fetched all people are choosen
  useEffect(() => {
    const allUsers: UserWithCheck[] = [];
    console.log(data);
    data?.organization.users.forEach((user) => {
      const userWithCheck = {
        ...user,
        checked: false,
        ableToSee: true,
      }
      allUsers.push(userWithCheck);
    });
    setCheckedPeople(allUsers);
  }, [data]);

  useEffect(() => {
    console.log('checkedPeople have changed');
    console.log(checkedPeople);
  }, [checkedPeople])

  //Gucci - Filter out users that does not fufuill the searchbar query
  useEffect(() => {
    const updatedUsers = checkedPeople.map((checkedUser) => {
      let fullName = checkedUser.firstName + " " + checkedUser.lastName;
      if (!fullName.toLocaleLowerCase().includes(searchFilter.toLocaleLowerCase())) {
        const updatedUser = {
          ...checkedUser,
          ableToSee: false,
        }
        return updatedUser;
      } else {
        const updatedUser = {
          ...checkedUser,
          ableToSee: true,
        }
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
          <FilterUsers handleGroupFilter={handleGroupFilter} handleSearch={handleSearch} setResetCheckedPeople={resetCheckedFilter} />
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
                            if (user.ableToSee) {
                              return (
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
                                      checked={user.checked}
                                      color="primary"
                                      onChange={() => {
                                        handleCheckedPeople(user);
                                      }}
                                    />
                                  </TableCell>
                                </TableRow>
                              )
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
