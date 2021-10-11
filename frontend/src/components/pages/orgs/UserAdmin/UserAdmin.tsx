import React from "react";
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
} from "@material-ui/core";
import { Organization } from "@interfaces/organizations";
import { Delete } from "@material-ui/icons";

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
  /* Fetching user data and then mapping it to components
  {data &&
    data.organization.users?.map((user) => (
      <Grid item key={user.username}>
        {user.username}
      </Grid>
    ))}
  */

  return (
    <Box m={10}>
      {data?.organization?.users ? (
        <Grid container spacing={10}>
          <Grid item>
            <Typography variant="h1" align="center">
              {organization.name}
            </Typography>
          </Grid>
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
                                <Button variant="contained" color="primary" startIcon={<Delete />}>
                                  Fjern fra gruppe
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
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
