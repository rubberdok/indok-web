"use client";

import { NextLinkComposed } from "@/app/components/Link";
import { graphql } from "@/gql/app";
import { useSuspenseQuery } from "@apollo/client";
import { Card, CardActionArea, CardHeader, Container, Typography } from "@mui/material";
import { notFound } from "next/navigation";

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
    <Container>
      <Typography variant="h3" component="h1">
        Dine foreninger
      </Typography>
      {organizations.map((organization) => (
        <Card key={organization.id}>
          <CardActionArea component={NextLinkComposed} to={`/organizations/${organization.id}/admin`}>
            <CardHeader title={organization.name} />
          </CardActionArea>
        </Card>
      ))}
    </Container>
  );
}
