import { Tab, Tabs } from "@mui/material";

import { Title } from "@/components/Title";
import { AdminOrganizationFragment } from "@/generated/graphql";

type Props = {
  organization: AdminOrganizationFragment;
  activeTab: number;
  handleTabChange: (event: React.SyntheticEvent, newValue: number) => void;
};

export const OrganizationHero: React.FC<Props> = ({ organization, handleTabChange, activeTab }) => {
  return (
    <Title
      title={organization.name}
      overline="Administrasjonsside"
      breadcrumbs={[
        { href: "/", name: "Hjem" },
        { href: "/orgs", name: "Foreninger" },
        { name: organization.name, href: `/orgs/${organization.id}` },
      ]}
      variant="dark"
    >
      <Tabs textColor="primary" indicatorColor="primary" onChange={handleTabChange} value={activeTab}>
        <Tab label="Arrangementer" />
        <Tab label="Verv" />
        <Tab label="Medlemmer" />
      </Tabs>
    </Title>
  );
};
