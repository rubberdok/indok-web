"use client";

import { useSuspenseQuery } from "@apollo/client";
import { Unstable_Grid2 as Grid, Typography } from "@mui/material";
import { notFound } from "next/navigation";

import { Organization } from "@/app/_components/Organization";
import { Breadcrumbs } from "@/app/components/Breadcrumbs";
import { graphql } from "@/gql/app";

export default function Page() {
  const { data } = useSuspenseQuery(
    graphql(`
      query UserOrganizationsPage {
        user {
          user {
            id
            organizations {
              id
              name
              logo {
                id
                url
              }
            }
          }
        }
      }
    `)
  );

  if (!data.user.user) {
    return notFound();
  }

  const { organizations } = data.user.user;
  return (
    <>
      <Breadcrumbs
        links={[
          { name: "Hjem", href: "/" },
          { name: "Profil", href: "/profile" },
          { name: "Mine foreninger", href: "/profile/organizations" },
        ]}
      />
      <Typography variant="subtitle1" component="h1">
        Dine foreninger
      </Typography>
      <Grid container direction="row">
        {organizations.map((organization) => (
          <Grid xs={12} sm={6} md={3} key={organization.id}>
            <Organization organization={organization} link={`/organizations/${organization.id}/admin`} />
          </Grid>
        ))}
      </Grid>
    </>
  );
}
