"use client";

import { useBackgroundQuery, useQuery, useSuspenseQuery } from "@apollo/client";
import { Avatar, Container, Grid, Typography } from "@mui/material";
import { redirect } from "next/navigation";

import { PermissionRequired } from "../components/PermissionRequired";

import { LogoutButton } from "./components/LogoutButton";
import { AdminPage, CabinsAdmin, Event, Form, Orders, Organization, Personal, Report } from "./components/ProfileCard";

import { Breadcrumbs } from "@/app/components/Breadcrumbs";
import { graphql } from "@/gql";
import { generateFeideLoginUrl } from "@/utils/auth";

// Opt out of caching for all data requests in the route segment
export const dynamic = "force-dynamic";

const profileDocument = graphql(/* GraphQL */ `
  query Profile {
    user {
      id
      feideEmail
      email
      username
      firstName
      lastName
      dateJoined
      graduationYear
      gradeYear
      allergies
      phoneNumber
      firstLogin
    }
  }
`);

const cabinPermissionDocument = graphql(/* GraphQL */ `
  query CabinPermission {
    hasPermission(permission: "cabins.manage_booking")
  }
`);

const adminCapabilitiesDocument = graphql(/* GraphQL */ `
  query ProfileAdminEditCapabilities {
    canManageUserProfiles
    canManageUserNfc
  }
`);

// Returns a string with the first letter of the given first name,
// and the first letter of the last space-separated part of lastName.
function getUserInitials(firstName: string, lastName: string): string {
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
}

const ID_PREFIX = "profile-";

export default function ProfilePage() {
  const { data } = useSuspenseQuery(profileDocument);

  /**
   * Running this as a background query prevents a waterfall of queries, where
   * the PermissinoRequired component would suspend for fetching after the parent component
   * has finished fetching. Instead, we run the query in the background, and read it
   * in the PermissionRequired component.
   */
  const [queryRef] = useBackgroundQuery(cabinPermissionDocument);
  const { data: adminCapabilities } = useQuery(adminCapabilitiesDocument, {
    skip: data.user === null,
  });
  const hasAdminEditAccess =
    Boolean(adminCapabilities?.canManageUserProfiles) || Boolean(adminCapabilities?.canManageUserNfc);

  // If the user is not logged in, redirect to the login page
  if (data.user === null) return redirect(generateFeideLoginUrl());

  const initials = getUserInitials(data.user.firstName, data.user.lastName);

  return (
    <Container>
      <Breadcrumbs
        links={[
          { name: "Hjem", href: "/" },
          { name: "Profil", href: "/profile" },
        ]}
        sx={{ mb: 4 }}
      />
      <Grid container direction="column" spacing={2} alignItems="center" justifyContent="center" sx={{ mb: 4 }}>
        <Grid item>
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
        </Grid>
        <Grid item>
          {data?.user && <Typography variant="h4" component="h1">{`Hei, ${data.user.firstName}`}</Typography>}
        </Grid>
        <Grid item xs={10}>
          <Typography variant="body1" align="center">
            Her kan du endre din informasjon, se tidligere arrangementer og foreningene der du er medlem.
          </Typography>
        </Grid>

        <Grid container item justifyContent="center" alignItems="stretch" spacing={4}>
          <Grid item xs={12} md={6} lg={5}>
            <Personal user={data?.user ?? undefined} data-test-id={`${ID_PREFIX}personal-`} />
          </Grid>
          <Grid item xs={12} md={6} lg={5}>
            <Event data-test-id={`${ID_PREFIX}event-`} />
          </Grid>
          <Grid item xs={12} md={6} lg={5}>
            <Organization data-test-id={`${ID_PREFIX}organization-`} />
          </Grid>
          <Grid item xs={12} md={6} lg={5}>
            <Form data-test-id={`${ID_PREFIX}form-`} />
          </Grid>
          <Grid item xs={12} md={6} lg={5}>
            <Report data-test-id={`${ID_PREFIX}report-`} />
          </Grid>
          <Grid item xs={12} md={6} lg={5}>
            <Orders data-test-id={`${ID_PREFIX}orders-`} />
          </Grid>
          <Grid item xs={12} md={6} lg={5}>
            <PermissionRequired queryRef={queryRef}>
              <CabinsAdmin data-test-id={`${ID_PREFIX}cabin-`} />
            </PermissionRequired>
          </Grid>
          {hasAdminEditAccess && (
            <Grid item xs={12} md={6} lg={5}>
              <AdminPage data-test-id={`${ID_PREFIX}admin-page-`} />
            </Grid>
          )}
        </Grid>

        <Grid item>
          <LogoutButton />
        </Grid>
      </Grid>
    </Container>
  );
}
