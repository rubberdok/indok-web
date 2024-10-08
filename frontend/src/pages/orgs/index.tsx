import { useQuery } from "@apollo/client";
import { Card, CardActionArea, CircularProgress, Container, Grid, Typography } from "@mui/material";

import { Link } from "@/components";
import { UserWithEventsAndOrgsDocument } from "@/generated/graphql";
import { Layout, RootStyle } from "@/layouts/Layout";
import { NextPageWithLayout } from "@/lib/next";

const OrganizationPage: NextPageWithLayout = () => {
  const { data } = useQuery(UserWithEventsAndOrgsDocument);

  return (
    <Container>
      <Grid container direction="column" spacing={10}>
        <Grid item>
          <Typography variant="h3" align="center">
            Dine foreninger
          </Typography>
        </Grid>
        <Grid item container spacing={10} justifyContent="center">
          {data?.user?.organizations ? (
            data.user.organizations.map((org) => (
              <Grid item key={org.id}>
                <Card>
                  <CardActionArea sx={{ p: 4 }} component={Link} href={`orgs/${org.id}`}>
                    <Typography variant="h5" align="center">
                      {org.name}
                    </Typography>
                  </CardActionArea>
                </Card>
              </Grid>
            ))
          ) : (
            <CircularProgress />
          )}
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
