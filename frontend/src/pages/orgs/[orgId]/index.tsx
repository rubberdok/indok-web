import { useQuery } from "@apollo/client";
import { CircularProgress, Container, Stack } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useRouter } from "next/router";
import { useState } from "react";

import OrgEvents from "@/components/pages/events/org/OrgEvents";
import OrganizationListings from "@/components/pages/listings/organization/OrganizationListings";
import OrganizationHero from "@/components/pages/organization/OrganizationHero";
import { GET_ORGANIZATION } from "@/graphql/orgs/queries";
import { Organization } from "@/interfaces/organizations";
import Layout from "@/layouts/Layout";
import { NextPageWithLayout } from "@/pages/_app";

const RootStyle = styled("div")(({ theme }) => ({
  margin: theme.spacing(4, 0),
}));

const OrganizationDetailPage: NextPageWithLayout = () => {
  const router = useRouter();
  const { orgId } = router.query;
  const orgNumberId = parseInt(orgId as string);

  const { data, loading, error } = useQuery<{ organization: Organization }, { orgId: number }>(GET_ORGANIZATION, {
    variables: { orgId: orgNumberId },
    skip: Number.isNaN(orgNumberId),
  });

  const [activeTab, setActiveTab] = useState<number>(0);

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  if (error) return <p>Error</p>;
  if (!data || loading) return <CircularProgress />;

  return (
    <>
      <OrganizationHero handleTabChange={handleTabChange} activeTab={activeTab} organization={data.organization} />

      <RootStyle>
        <Container>
          {data?.organization && (
            <Stack spacing={4}>
              {activeTab == 0 && data.organization.events && <OrgEvents organization={data.organization} />}
              {activeTab == 1 && data.organization.listings && (
                <OrganizationListings organization={data.organization} />
              )}
            </Stack>
          )}
        </Container>
      </RootStyle>
    </>
  );
};

OrganizationDetailPage.getLayout = (page: React.ReactElement) => <Layout>{page}</Layout>;

export default OrganizationDetailPage;
