import { useQuery } from "@apollo/client";
import { Logout, PermissionRequired } from "@components/Auth";
import Breadcrumbs from "@components/Breadcrumbs";
import {
  CabinsAdmin,
  Event,
  Form,
  Orders,
  Organization,
  Personal,
  Report,
} from "@components/pages/profile/ProfileCard";
import { UserInfoDocument } from "@generated/graphql";
import { GET_USER_INFO } from "@graphql/users/queries";
import Layout from "@layouts/Layout";
import { addApolloState, initializeApollo } from "@lib/apolloClient";
import { Avatar, Container, Grid, Stack, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { generateFeideLoginUrl } from "@utils/auth";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import Head from "next/head";
import { useMemo } from "react";
import { HEADER_DESKTOP_HEIGHT, HEADER_MOBILE_HEIGHT } from "src/theme/constants";
import { User } from "src/types/users";
import { NextPageWithLayout } from "@layouts/Layout";

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

const ProfilePage: NextPageWithLayout<InferGetServerSidePropsType<typeof getServerSideProps>> = () => {
  const { data } = useQuery<{ user?: User }>(GET_USER_INFO);
  const initials = useMemo(() => (data?.user ? userInitials(data.user.firstName, data.user.lastName) : ""), [data]);

  return (
    <>
      <Head>
        <title>Profil | Forening for studentene ved Industriell Økonomi og Teknologiledelse</title>
        <meta name="description" content="Profilside" />
      </Head>
      <Container>
        <Breadcrumbs
          links={[
            { name: "Hjem", href: "/" },
            { name: "Profil", href: "/profile" },
          ]}
        />
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

          <Grid container columnSpacing={{ xs: 0, md: 4 }} rowSpacing={4} justifyContent="center" alignItems="stretch">
            <Grid item xs={12} md={5}>
              <Personal user={data?.user} data-test-id={`${ID_PREFIX}personal-`} />
            </Grid>
            <Grid item xs={12} md={5}>
              <Event data-test-id={`${ID_PREFIX}event-`} />
            </Grid>
            <Grid item xs={12} md={5}>
              <Organization data-test-id={`${ID_PREFIX}organization-`} />
            </Grid>
            <Grid item xs={12} md={5}>
              <Form data-test-id={`${ID_PREFIX}form-`} />
            </Grid>
            <Grid item xs={12} md={5}>
              <Report data-test-id={`${ID_PREFIX}report-`} />
            </Grid>
            <Grid item xs={12} md={5}>
              <Orders data-test-id={`${ID_PREFIX}orders-`} />
            </Grid>
            <Grid item xs={12} md={5}>
              <PermissionRequired permission="cabins.manage_booking">
                <CabinsAdmin data-test-id={`${ID_PREFIX}cabins-`} />
              </PermissionRequired>
            </Grid>
          </Grid>
          <Logout />
        </Stack>
      </Container>
    </>
  );
};

ProfilePage.getLayout = function getLayout(page: React.ReactElement) {
  return (
    <Layout>
      <RootStyle>{page}</RootStyle>
    </Layout>
  );
};

export default ProfilePage;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const client = initializeApollo({}, ctx);
  const { data, error } = await client.query({
    query: UserInfoDocument,
  });

  if (error) return { notFound: true };
  if (!data.user) {
    return { redirect: { destination: generateFeideLoginUrl("/profile"), permanent: false } };
  }
  return addApolloState(client, { props: { user: data.user } });
};
