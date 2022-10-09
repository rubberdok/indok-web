import { useQuery } from "@apollo/client";
import { Card, CardActionArea, CircularProgress, Container, Grid, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import Link from "next/link";
import React from "react";

import { UserWithEventsAndOrgsDocument } from "@/generated/graphql";
import { Layout } from "@/layouts/Layout";
import { NextPageWithLayout } from "@/pages/_app";
import { HEADER_DESKTOP_HEIGHT, HEADER_MOBILE_HEIGHT } from "@/theme/constants";

const RootStyle = styled("div")(({ theme }) => ({
  paddingTop: HEADER_MOBILE_HEIGHT,
  margin: theme.spacing(4, 0),
  [theme.breakpoints.up("md")]: {
    paddingTop: HEADER_DESKTOP_HEIGHT,
  },
}));

const OrganizationPage: NextPageWithLayout = () => {
  const { data } = useQuery(UserWithEventsAndOrgsDocument);

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
              data.user.organizations.map((org) => (
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
