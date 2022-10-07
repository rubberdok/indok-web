import { useQuery } from "@apollo/client";
import { CircularProgress, Container, Stack } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useRouter } from "next/router";
import { useState } from "react";

import OrgEvents from "@/components/pages/events/org/OrgEvents";
import OrganizationListings from "@/components/pages/listings/organization/OrganizationListings";
import OrganizationHero from "@/components/pages/organization/OrganizationHero";
import { AdminOrganizationDocument } from "@/generated/graphql";
import Layout from "@/layouts/Layout";
import { NextPageWithLayout } from "@/pages/_app";

const RootStyle = styled("div")(({ theme }) => ({
  margin: theme.spacing(4, 0),
}));

const OrganizationDetailPage: NextPageWithLayout = () => {
  const router = useRouter();
  const { orgId } = router.query;

  const { data, loading, error } = useQuery(AdminOrganizationDocument, {
    variables: { orgId: orgId as string },
    skip: Number.isNaN(parseInt(orgId as string)),
  });

  const [activeTab, setActiveTab] = useState<number>(0);

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  if (error) return <p>Error</p>;
  if (!data?.organization || loading) return <CircularProgress />;

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
