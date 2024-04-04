import { useQuery } from "@apollo/client";
import { CircularProgress, Container, Stack } from "@mui/material";
import { useRouter } from "next/router";
import { useState } from "react";

import { OrganizationEvents } from "@/components/pages/events";
import { OrganizationListings } from "@/components/pages/listings/organization/OrganizationListings";
import { OrganizationHero } from "@/components/pages/organization/OrganizationHero";
import { OrgMembers } from "@/components/pages/organization/OrgMembers";
import { OrgProducts } from "@/components/pages/organization/OrgShop";
import { AdminOrganizationDocument } from "@/generated/graphql";
import { NextPageWithLayout } from "@/lib/next";

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

      <Container>
        {data?.organization && (
          <Stack spacing={4}>
            {activeTab == 0 && data.organization.events && <OrganizationEvents organization={data.organization} />}
            {activeTab == 1 && data.organization.listings && <OrganizationListings organization={data.organization} />}
            {activeTab == 2 && data.organization && <OrgMembers organization={data.organization} />}
            {activeTab == 3 && data.organization && <OrgProducts organization={data.organization} />}
          </Stack>
        )}
      </Container>
    </>
  );
};

export default OrganizationDetailPage;
