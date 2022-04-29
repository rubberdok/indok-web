import { useQuery } from "@apollo/client";
import { GET_USER } from "@graphql/users/queries";
import { Organization } from "@interfaces/organizations";
import { User } from "@interfaces/users";
import { Card, CardActionArea, CircularProgress, Container, Grid, styled, Typography } from "@mui/material";
import Link from "next/link";
import React from "react";
import Layout from "src/layouts";
import { HEADER_DESKTOP_HEIGHT, HEADER_MOBILE_HEIGHT } from "src/theme/constants";
import { NextPageWithLayout } from "../_app";

const RootStyle = styled("div")(({ theme }) => ({
  paddingTop: HEADER_MOBILE_HEIGHT,
  margin: theme.spacing(4, 0),
  [theme.breakpoints.up("md")]: {
    paddingTop: HEADER_DESKTOP_HEIGHT,
  },
}));

const OrganizationPage: NextPageWithLayout = () => {
  const { data } = useQuery<{ user: User }>(GET_USER);

  return (
    <RootStyle>
      <Container>
        <Grid container direction="column" spacing={10}>
          <Grid item>
            <Typography variant="h3" align="center">
              Dine foreninger
            </Typography>
          </Grid>
          <Grid item container spacing={10} justifyContent="center">
            {data?.user?.organizations ? (
              data.user.organizations.map((org: Organization) => (
                <Grid item key={org.id}>
                  <Card>
                    <Link passHref href={`orgs/${org.id}`}>
                      <CardActionArea sx={{ p: 4 }}>
                        <Typography variant="h5" align="center">
                          {org.name}
                        </Typography>
                      </CardActionArea>
                    </Link>
                  </Card>
                </Grid>
              ))
            ) : (
              <CircularProgress />
            )}
          </Grid>
        </Grid>
      </Container>
    </RootStyle>
  );
};

OrganizationPage.getLayout = (page: React.ReactElement) => <Layout>{page}</Layout>;

export default OrganizationPage;
