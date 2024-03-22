import { Unstable_Grid2 as Grid } from "@mui/material";

import { Organization } from "@/app/_components/Organization";

import { organizationData } from "../../_data/organizations";
import { Header } from "../_components/Header";
import { getClient } from "@/lib/apollo/ApolloClient";
import { graphql } from "@/gql/app";

export default async function Page() {
  const client = getClient();
  const { data } = await client.query({
    query: graphql(`
      query AboutUsOrganizationsPage {
        organizations {
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
    `),
  });
  const { organizations } = data.organizations;

  return (
    <>
      <Header
        title="Våre foreninger"
        subheader="Foreningen for Studentene ved Industriell Økonomi og Teknologiledelse er den øverste instansen (moderforeningen) for all studentfrivillighet på masterstudiet Indøk ved NTNU."
      />
      <Grid container alignItems="stretch" spacing={2} direction="row">
        {organizations.map((organization) => (
          <Grid xs={12} sm={6} md={3} key={organization.id}>
            <Organization organization={organization} link={`/about/organizations/${organization.id}`} />
          </Grid>
        ))}
        {organizationData.map(({ organization }) => (
          <Grid xs={12} sm={6} md={3} key={organization.id}>
            <Organization organization={organization} link={`/about/organizations/static/${organization.id}`} />
          </Grid>
        ))}
      </Grid>
    </>
  );
}
