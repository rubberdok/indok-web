import { useQuery } from "@apollo/client";
import {
  CabinsAdmin,
  Event,
  Form,
  Orders,
  Organization,
  Personal,
  Report,
} from "@components/pages/profile/ProfileCard";
import PermissionRequired from "@components/permissions/PermissionRequired";
import { GET_USER_INFO } from "@graphql/users/queries";
import { Avatar, Button, Container, Grid, Stack, styled, Typography } from "@mui/material";
import Head from "next/head";
import NextLink from "next/link";
import { useMemo } from "react";
import Layout from "src/layouts";
import { HEADER_DESKTOP_HEIGHT, HEADER_MOBILE_HEIGHT } from "src/theme/constants";
import { User } from "src/types/users";
import { NextPageWithLayout } from "../_app";

const ID_PREFIX = "profile-";

// Returns a string with the first letter of the given first name,
// and the first letter of the last space-separated part of lastName.
const userInitials = (firstName: string, lastName: string): string => {
  let initials = "";

  // Since "" is falsey, ensures that we have a string to index
  if (firstName) {
    initials += firstName[0];
  }

  if (lastName) {
    const lastNames = lastName.split(" ");
    initials += lastNames[lastNames.length - 1][0];
  }

  return initials;
};

const RootStyle = styled("div")(({ theme }) => ({
  paddingTop: HEADER_MOBILE_HEIGHT,
  margin: theme.spacing(4, 0),
  [theme.breakpoints.up("md")]: {
    paddingTop: HEADER_DESKTOP_HEIGHT,
  },
}));

const ProfilePage: NextPageWithLayout = () => {
  const { data } = useQuery<{ user?: User }>(GET_USER_INFO);
  const initials = useMemo(() => (data?.user ? userInitials(data.user.firstName, data.user.lastName) : ""), [data]);

  return (
    <RootStyle>
      <Head>
        <title>Profil | Forening for studentene ved Industriell Økonomi og Teknologiledelse</title>
        <meta name="description" content="Profilside" />
      </Head>
      <Container>
        <Stack alignItems="center" sx={{ mb: 4 }} spacing={2}>
          <Avatar
            sx={{
              bgcolor: "primary.main",
              width: (theme) => theme.spacing(16),
              height: (theme) => theme.spacing(16),
            }}
          >
            {data?.user && (
              <Typography variant="h3" component="p" color="common.white">
                {initials}
              </Typography>
            )}
          </Avatar>
          {data?.user && <Typography variant="h4" component="h1">{`Hei, ${data.user.firstName}`}</Typography>}
          <Typography variant="body1" align="center">
            Her kan du endre din informasjon, se tidligere arrangementer og foreningene der du er medlem.
          </Typography>

          <Grid
            container
            columnSpacing={{ xs: 0, md: 4 }}
            rowSpacing={4}
            justifyContent="center"
            sm={10}
            xs={12}
            alignItems="stretch"
          >
            <Grid item xs={12} md={6}>
              <Personal user={data?.user} data-test-id={`${ID_PREFIX}personal-`} />
            </Grid>
            <Grid item xs={12} md={6}>
              <Event data-test-id={`${ID_PREFIX}event-`} />
            </Grid>
            <Grid item xs={12} md={6}>
              <Organization data-test-id={`${ID_PREFIX}organization-`} />
            </Grid>
            <Grid item xs={12} md={6}>
              <Form data-test-id={`${ID_PREFIX}form-`} />
            </Grid>
            <Grid item xs={12} md={6}>
              <Report data-test-id={`${ID_PREFIX}report-`} />
            </Grid>
            <Grid item xs={12} md={6}>
              <Orders data-test-id={`${ID_PREFIX}orders-`} />
            </Grid>
            <Grid item xs={12} md={6}>
              <PermissionRequired permission="cabins.manage_booking">
                <CabinsAdmin data-test-id={`${ID_PREFIX}cabins-`} />
              </PermissionRequired>
            </Grid>
          </Grid>
          <NextLink href="/logout" passHref>
            <Button variant="contained" color="error">
              Logg ut
            </Button>
          </NextLink>
        </Stack>
      </Container>
    </RootStyle>
  );
};

ProfilePage.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout>{page}</Layout>;
};

export default ProfilePage;
