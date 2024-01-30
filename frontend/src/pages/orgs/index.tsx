import { useQuery } from "@apollo/client";
import { Card, CardActionArea, Container, Grid, Typography } from "@mui/material";

import { Link } from "@/components";
import { graphql } from "@/gql/pages";
import { Layout, RootStyle } from "@/layouts/Layout";
import { NextPageWithLayout } from "@/lib/next";

const OrganizationPage: NextPageWithLayout = () => {
  const { data } = useQuery(
    graphql(`
      query OrganizationPageUser {
        user {
          user {
            id
            organizations {
              id
              name
            }
          }
        }
      }
    `)
  );

  return (
    <Container>
      <Grid container direction="column" spacing={10}>
        <Grid item>
          <Typography variant="h3" align="center">
            Dine foreninger
          </Typography>
        </Grid>
        <Grid item container spacing={10} justifyContent="center">
          {data?.user?.user?.organizations.map((org) => (
            <Grid item key={org.id}>
              <Card>
                <CardActionArea sx={{ p: 4 }} component={Link} href={`orgs/${org.id}`}>
                  <Typography variant="h5" align="center">
                    {org.name}
                  </Typography>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Grid>
    </Container>
  );
};

OrganizationPage.getLayout = (page) => (
  <Layout>
    <RootStyle>{page}</RootStyle>
  </Layout>
);

export default OrganizationPage;
