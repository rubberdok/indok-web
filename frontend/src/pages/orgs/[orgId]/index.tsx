import { useQuery } from "@apollo/client";
import Layout from "@components/Layout";
import { GET_ORGANIZATION } from "@graphql/orgs/queries";
import { Organization } from "@interfaces/organizations";
import {
  Box,
  CircularProgress,
  Grid,
  Typography,
} from "@material-ui/core";
import { NextPage } from "next";
import { useRouter } from "next/router";
import OrganizationListings from "@components/pages/listings/organization/OrganizationListings";
import OrgEvents from "@components/pages/events/org/OrgEvents";

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
        {data?.organization && <>
          <Grid container spacing={10}>
            <Grid item>
              <Typography variant="h1" align="center">
                {data.organization.name}
              </Typography>
            </Grid>
            {data.organization.events && <OrgEvents organization={data.organization} />}
            {data.organization.listings && <OrganizationListings organization={data.organization} />}
          </Grid>
        </>}
      </Box>
    </Layout>
  );
};

export default OrganizationDetailPage;
