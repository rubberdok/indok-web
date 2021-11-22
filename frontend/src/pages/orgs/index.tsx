import { useQuery } from "@apollo/client";
import Layout from "@components/Layout";
import { GET_USER } from "@graphql/users/queries";
import { Organization } from "@interfaces/organizations";
import { User } from "@interfaces/users";
import { Box, CircularProgress, Container, Grid, Paper, Typography } from "@mui/material";
import makeStyles from '@mui/styles/makeStyles';
import { NextPage } from "next";
import Link from "next/link";

const useStyles = makeStyles((theme) => ({
  container: { padding: theme.spacing(4) },
  hover: {
    "&:hover": {
      backgroundColor: theme.palette.primary.light,
      cursor: "pointer",
      color: theme.palette.primary.contrastText,
    },
  },
}));

const OrganizationPage: NextPage = () => {
  const { data } = useQuery<{ user: User }>(GET_USER);
  const classes = useStyles();

  return (
    <Layout>
      <Container className={classes.container}>
        <Grid container direction="column" spacing={10}>
          <Grid item>
            <Typography variant="h1" align="center">
              Dine Organisasjoner
            </Typography>
          </Grid>
          <Grid item container spacing={10} justifyContent="center">
            {data?.user?.organizations ? (
              data.user.organizations.map((org: Organization) => (
                <Grid item key={org.id}>
                  <Link passHref href={`orgs/${org.id}`}>
                    <Paper className={classes.hover}>
                      <Box p={5}>
                        <Typography variant="h5" align="center">
                          {org.name}
                        </Typography>
                      </Box>
                    </Paper>
                  </Link>
                </Grid>
              ))
            ) : (
              <CircularProgress />
            )}
          </Grid>
        </Grid>
      </Container>
    </Layout>
  );
};

export default OrganizationPage;
