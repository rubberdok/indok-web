"use client";

import { useBackgroundQuery, useSuspenseQuery } from "@apollo/client";
import { Avatar, Container, Unstable_Grid2 as Grid, Tooltip, Typography } from "@mui/material";
import { notFound } from "next/navigation";

import { Breadcrumbs } from "@/app/components/Breadcrumbs";
import { graphql } from "@/gql/app";

import { PermissionRequired } from "../../components/PermissionRequired";

import { LogoutButton } from "./components/LogoutButton";
import { CabinsAdmin, DocumentsAdmin, Event, Orders, Organization, Personal, Report } from "./components/ProfileCard";

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
  const { data } = useSuspenseQuery(
    graphql(`
      query AppProfileUser {
        user {
          user {
            id
            firstName
            lastName
            gradeYear
            isSuperUser
            studyProgram {
              id
              name
            }
          }
        }

        ...CabinsAdminCard_Query
      }
    `)
  );

  /**
   * Running this as a background query prevents a waterfall of queries, where
   * the PermissinoRequired component would suspend for fetching after the parent component
   * has finished fetching. Instead, we run the query in the background, and read it
   * in the PermissionRequired component.
   */
  const [cabinQueryRef] = useBackgroundQuery(
    graphql(`
      query AppProfileCabinPermission {
        hasFeaturePermission(data: { featurePermission: CABIN_ADMIN }) {
          id
          hasFeaturePermission
        }
      }
    `)
  );
  const [documentsQueryRef] = useBackgroundQuery(
    graphql(`
      query AppProfileDocumentsPermission {
        hasFeaturePermission(data: { featurePermission: ARCHIVE_WRITE_DOCUMENTS }) {
          id
          hasFeaturePermission
        }
      }
    `)
  );

  const user = data.user.user;

  if (!user) return notFound();
  const initials = getUserInitials(user.firstName, user.lastName);

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
        <Grid>
          <Avatar
            sx={{
              bgcolor: "primary.main",
              width: (theme) => theme.spacing(16),
              height: (theme) => theme.spacing(16),
            }}
          >
            <Typography variant="h3" component="p" color="common.white">
              {initials}
              {user.isSuperUser && (
                <span>
                  <Tooltip title="Superbruker" arrow>
                    <span>🦸</span>
                  </Tooltip>
                </span>
              )}
            </Typography>
          </Avatar>
        </Grid>
        <Grid>
          <Typography variant="h4" component="h1">{`Hei, ${user.firstName}`}</Typography>
        </Grid>
        <Grid xs={10}>
          <Typography variant="body1" align="center">
            Her kan du endre din informasjon, se tidligere arrangementer og foreningene der du er medlem.
          </Typography>
        </Grid>

        <Grid container justifyContent="center" alignItems="stretch" spacing={4}>
          <Grid xs={12} md={6} lg={5}>
            <Personal user={user} data-test-id={`${ID_PREFIX}personal-`} />
          </Grid>
          <Grid xs={12} md={6} lg={5}>
            <Event data-test-id={`${ID_PREFIX}event-`} />
          </Grid>
          <Grid xs={12} md={6} lg={5}>
            <Organization data-test-id={`${ID_PREFIX}organization-`} />
          </Grid>
          <Grid xs={12} md={6} lg={5}>
            <Report data-test-id={`${ID_PREFIX}report-`} />
          </Grid>
          <Grid xs={12} md={6} lg={5}>
            <Orders data-test-id={`${ID_PREFIX}orders-`} />
          </Grid>
          <Grid xs={12} md={6} lg={5}>
            <PermissionRequired queryRef={cabinQueryRef}>
              <CabinsAdmin data-test-id={`${ID_PREFIX}cabin-`} query={data} />
            </PermissionRequired>
          </Grid>
          <Grid xs={12} md={6} lg={5}>
            <PermissionRequired queryRef={documentsQueryRef}>
              <DocumentsAdmin data-test-id={`${ID_PREFIX}documents-`} />
            </PermissionRequired>
          </Grid>
        </Grid>

        <Grid>
          <LogoutButton />
        </Grid>
      </Grid>
    </Container>
  );
}
