import { Markdown } from "@/app/_components/Markdown";
import { Organization } from "@/app/_components/Organization";
import { graphql } from "@/gql/app";
import { getClient } from "@/lib/apollo/ApolloClient";
import { Unstable_Grid2 as Grid } from "@mui/material";

export default async function Page({ params }: { params: { organizationId: string } }) {
  const client = getClient();

  const { data } = await client.query({
    query: graphql(`
      query AboutUsOrganizationPage($data: OrganizationInput!) {
        organization(data: $data) {
          organization {
            id
            name
            description
            logo {
              id
              url
            }
          }
        }
      }
    `),
    variables: {
      data: {
        id: params.organizationId,
      },
    },
  });
  const { organization } = data.organization;

  return (
    <>
      <Grid container direction="row" spacing={2}>
        <Grid xs={12} sm={6} md={9}>
          <Markdown>{organization.description}</Markdown>
        </Grid>
        <Grid xs={12} sm={6} md={3}>
          <Organization organization={organization} sx={{}} />
        </Grid>
      </Grid>
    </>
  );
}
