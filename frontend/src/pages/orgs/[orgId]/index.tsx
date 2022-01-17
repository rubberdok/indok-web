import { useQuery } from "@apollo/client";
import Layout from "@components/Layout";
import { GET_ORGANIZATION } from "@graphql/orgs/queries";
import { Organization } from "@interfaces/organizations";
import Link from "next/link";
import { Box, CircularProgress, Grid, Typography, Button } from "@material-ui/core";
import { NextPage } from "next";
import { useRouter } from "next/router";
import OrganizationListings from "@components/pages/listings/organization/OrganizationListings";
import OrgEvents from "@components/pages/events/org/OrgEvents";
import { Person } from "@material-ui/icons";

const OrganizationDetailPage: NextPage = () => {
  const router = useRouter();
  const { orgId } = router.query;
  const orgNumberId = parseInt(orgId as string);

  const { data, loading, error } = useQuery<{ organization: Organization }, { orgId: number }>(GET_ORGANIZATION, {
    variables: { orgId: orgNumberId },
    skip: Number.isNaN(orgNumberId),
  });

  if (error) return <p>Error</p>;
  if (loading) return <CircularProgress />;

  return (
    <Layout>
      <Box m={10}>
        {data?.organization && (
          <>
            <Grid container spacing={5} direction="column" justifyContent="flex-start">
              <Grid item>
                <Typography variant="h1">{data.organization.name}</Typography>
              </Grid>
              <Grid item>{data.organization.events && <OrgEvents organization={data.organization} />}</Grid>
              <Grid item>
                {data.organization.listings && <OrganizationListings organization={data.organization} />}
              </Grid>
            </Grid>
          </>
        )}
      </Box>
    </Layout>
  );
};

export default OrganizationDetailPage;
